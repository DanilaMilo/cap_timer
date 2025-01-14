from aiogram.types import Update

from fastapi import APIRouter
from fastapi import Request, HTTPException, Response
from fastapi.responses import JSONResponse

from fastapi.responses import StreamingResponse
from io import BytesIO

from config_reader import config
from back.stickers_handler import STICKER_DATA as file_storage


router = APIRouter()

SECRET_KEY = config.BOT_TOKEN.get_secret_value()
print(file_storage)

# Эндпоинт для доступа к файлам
@router.get("/sticker/{sticker_id}")
async def get_sticker(sticker_id: str):
    # Проверяем, существует ли файл с таким ID
    if sticker_id not in file_storage:
        raise HTTPException(status_code=404, detail=f"Sticker not found, available_stickers: {file_storage.keys()}")

    # Получаем данные файла из памяти

    file_data = file_storage[sticker_id]
    return Response(content=file_data, media_type="application/octet-stream")

@router.get("/version")
async def get_version(request: Request) -> JSONResponse:
    return JSONResponse({"version": config.WEBAPP_URL})

@router.post("/webhook")
async def webhook(request: Request) -> None:
    bot = request.app.state.bot
    dp = request.app.state.dp

    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)