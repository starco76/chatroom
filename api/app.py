import uuid
import requests
from fastapi import FastAPI

app = FastAPI()

CENTRIFUGO_API = "http://centrifugo:8000/api"
API_KEY = "apikey"


@app.get("/create-room")
def create_room():
    room_id = str(uuid.uuid4())[:8]
    return {
        "room_id": room_id,
        "url": f"/room/{room_id}"
    }


@app.post("/send")
def send_message(room: str, user: str, text: str):

    payload = {
        "method": "publish",
        "params": {
            "channel": room,
            "data": {
                "user": user,
                "text": text
            }
        }
    }

    requests.post(
        CENTRIFUGO_API,
        json=payload,
        headers={"Authorization": f"apikey {API_KEY}"}
    )

    return {"status": "ok"}
