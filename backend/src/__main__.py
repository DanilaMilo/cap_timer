import logging
from typing import AsyncGenerator

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.types import Update
from aiogram.enums import ParseMode

import aiogram.webhook
import aiogram.webhook.aiohttp_server
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


from tortoise import Tortoise

from bot import setup_routers
from init_tg_bot import tg_bot as bot
from config_reader import config

from back.app_routes import router as app_router
from back.stickers_handler import prepare_stickers


async def lifespan(app: FastAPI) -> AsyncGenerator:
    await bot.set_webhook(
        url=f"{config.WEBHOOK_URL}/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )

    await prepare_stickers()


    # await Tortoise.init(
    #     db_url=config.DB_URL.get_secret_value(),
    #     modules={"models": ["db.models.user"]}
    # )
    # await Tortoise.generate_schemas()


    yield
    # await Tortoise.close_connections()
    await bot.session.close()


dp = Dispatcher()
dp.message.filter(F.chat.type == 'private')
dp.include_router(setup_routers())

app = FastAPI(lifespan=lifespan)



# Добавляем объекты bot и dp в состояние приложения
app.state.bot = bot
app.state.dp = dp

app.include_router(app_router)
# app.include_router(db_router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

 
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)