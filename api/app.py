from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# templates
templates = Jinja2Templates(directory="templates")


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
