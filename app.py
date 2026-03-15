from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import jwt
import uuid
import time
import requests
app = FastAPI()

# Static files + templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Secret برای JWT
CENTRIFUGO_SECRET = "l7wqnySzfsmfkjXLAEWpeaiQ3r4pr"
TOKEN_LIFETIME = 3600*2400  # 1 ساعت

# در حافظه ذخیره می‌کنیم برای simplicity (برای production DB لازم است)
rooms = {}

# صفحه اصلی (ساخت روم)


@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# API ساخت روم توسط ادمین


@app.get("/create-room")
def create_room(user: str = "admin"):
    room_id = "test"  # uuid.uuid4().hex[:8]
    return JSONResponse({"room_id": room_id})

# صفحه چت روم


@app.get("/room/{room_id}")
def room_page(request: Request, room_id: str):
    return templates.TemplateResponse("room.html", {"request": request, "room_id": room_id})

# API گرفتن JWT برای کاربر بعد از وارد کردن نام


@app.get("/token")
def get_token(user: str, room: str):
    now = int(time.time())
    now = int(time.time())
    payload = {
        "sub": str(user),
        "exp":  now + TOKEN_LIFETIME,
        "channels": [f"public:{room}"]
    }
    token = jwt.encode(payload, CENTRIFUGO_SECRET, algorithm="HS256")
    return JSONResponse({"token": token})


# یا http://localhost:8000/api اگر لوکال
CENTRIFUGO_URL = "http://centrifugo:8000/api"
CENTRIFUGO_API_KEY = "1pUzkClviGKurR1D"


@app.post("/send")
def send_message(room: str, user: str, text: str):
    # پیام را به Centrifugo publish می‌کنیم
    payload = {
        "channel": f"public:{room}",
        "data": {"user": user, "text": text}
    }
    headers = {"Authorization": f"apikey {CENTRIFUGO_API_KEY}"}

    r = requests.post(f"{CENTRIFUGO_URL}/publish",
                      json=payload, headers=headers)
    if r.status_code != 200:
        return JSONResponse({"error": "failed to send"}, status_code=500)
    return JSONResponse({"status": "ok", "msg": r.text})
