from aiogram import Router
from . import handlers

def setup_routers() -> Router:
    router = Router()
    router.include_router(handlers.router)
    return router