import os

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr


class Config(BaseSettings):
    BOT_TOKEN: SecretStr
    DB_URL: SecretStr

    WEBHOOK_URL: str = "https://of-assigned-lip-neighbors.trycloudflare.com"#https://lavos.tech/api" # webhook URL; for test&dev may be used tunneling ngrok or ssh serveo w port 8000
    WEBAPP_URL: str = "https://t.me/dev_cap_bot/game"#"https://t.me/lavosgame_bot/game?startapp=&version=N" # webapp URL; for test&dev may be used tunneling ngrok or ssh serveo w port 5173

    model_config = SettingsConfigDict(
        env_file_encoding="utf-8",
        env_file=os.path.join(os.path.dirname(__file__), ".env")
    )

config = Config()