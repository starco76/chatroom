import uuid
import requests
from fastapi import FastAPI
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import jwt
import time

CENTRIFUGO_LIFETIME = 3600*240    # 1 ساعت
app = FastAPI()
# static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# templates
templates = Jinja2Templates(directory="templates")

CENTRIFUGO_SECRET = "token_hmac_secret_keysecrettoken_hmac_secret_key"
CENTRIFUGO_API = "http://centrifugo:8000/api"
API_KEY = "apikeycodeapikeycode"


@app.get("/token")
def get_token(user: str = "guest", room: str = "default"):
    now = int(time.time())
    payload = {
        "sub": user,
        "exp": now + CENTRIFUGO_LIFETIME,
        "room": room,
        "info": {"user": user},
    }
    token = jwt.encode(payload, CENTRIFUGO_SECRET, algorithm="HS256")
    return JSONResponse({"token": token})


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

    res = requests.post(
        CENTRIFUGO_API,
        json=payload,
        headers={"Authorization": f"apikey {API_KEY}"}
    )
    print(res.text)

    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@app.get("/room/{room_id}", response_class=HTMLResponse)
def room(request: Request, room_id: str):
    return templates.TemplateResponse(
        "room.html",
        {
            "request": request,
            "room_id": room_id
        }
    )
