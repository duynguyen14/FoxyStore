from fastapi import FastAPI
from routers import recommed, train

app = FastAPI()

app.include_router(recommed.router)
app.include_router(train.router)
