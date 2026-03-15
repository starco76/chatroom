from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import jwt
import uuid
import time

app = FastAPI()

# Static files + templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Secret برای JWT
CENTRIFUGO_SECRET = "token_hmac_secret_keysecrettoken_hmac_secret_key"
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
    room_id = uuid.uuid4().hex[:8]
    rooms[room_id] = {"users": {}}
    now = int(time.time())
    payload = {"sub": user, "exp": now + TOKEN_LIFETIME, "room": room_id}
    token = jwt.encode(payload, CENTRIFUGO_SECRET, algorithm="HS256")
    return JSONResponse({"room_id": room_id, "token": token})

# صفحه چت روم


@app.get("/room/{room_id}")
def room_page(request: Request, room_id: str):
    return templates.TemplateResponse("room.html", {"request": request, "room_id": room_id})

# API گرفتن JWT برای کاربر بعد از وارد کردن نام


@app.get("/token")
def get_token(user: str, room: str):
    now = int(time.time())
    payload = {"sub": user, "exp": now + TOKEN_LIFETIME,
               "room": room, "info": {"user": user}}
    token = jwt.encode(payload, CENTRIFUGO_SECRET, algorithm="HS256")
    return JSONResponse({"token": token})
