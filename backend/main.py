from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Ideal Day backend is working!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/users/{user_id}")
def get_user(user_id: int):
    return {
        "user_id": user_id, 
        "name": "Алексей", 
        "email": "alex@example.com"
    }


@app.get("/api/search")
def search_users(name: str):
    return {"search_name": name}
