from init_tg_bot import tg_bot as bot
from ast import literal_eval
from config_reader import config
import aiohttp


STICKER_DATA = {}

async def get_sticker_set(pack_name: str):
    sticker_set_data = await bot.get_sticker_set(pack_name)
    sticker_set_data = sticker_set_data.stickers
    return sticker_set_data


import io
import zipfile
import json

import gzip
import json

async def get_sticker_file(file_id: str):
    # Получаем объект файла
    file = await bot.get_file(file_id)
    
    # Скачиваем файл как BytesIO
    file_stream = await bot.download_file(file.file_path)
    
    # Читаем содержимое как байты
    file_bytes = file_stream.read()
    
    # Распаковка GZIP-содержимого
    with gzip.GzipFile(fileobj=io.BytesIO(file_bytes)) as gz:
        # Декодируем JSON из распакованного содержимого
        lottie_json = json.load(gz)
    
    return file_bytes, lottie_json

async def download_sticker(file_id: str):
    telegram_file = await bot.get_file(file_id)
    file_url = f"https://api.telegram.org/file/bot{config.BOT_TOKEN.get_secret_value()}/{telegram_file.file_path}"

    # Скачивание файла
    async with aiohttp.ClientSession() as session:
        async with session.get(file_url) as response:
            if response.status != 200:
                raise ValueError(f"Failed to download file with status {response.status}")
            file_bytes = await response.read()
            STICKER_DATA[file_id] = file_bytes
            return file_bytes





async def prepare_stickers():
    sticker_pack_name = "gift0_5915521180483191380_by_GiftChangesHelper4Bot"
    sticker_set_info = await get_sticker_set(sticker_pack_name)
    for sticker in sticker_set_info[:10]:
        file_bytes = await download_sticker(sticker.file_id)
        STICKER_DATA[sticker.file_id] = file_bytes
