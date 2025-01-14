from aiogram import Router
from aiogram.types import Message, WebAppInfo, FSInputFile, URLInputFile
from aiogram.filters import CommandStart, CommandObject
from aiogram.utils.keyboard import InlineKeyboardBuilder, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.types.menu_button import MenuButton

from aiogram.utils.deep_linking import decode_payload
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message

from config_reader import config
from init_tg_bot import tg_bot as bot




router = Router()


@router.message()
async def handle_message(message: Message):
    user_id = message.from_user.id
    await message.answer(f'test: {user_id}')
