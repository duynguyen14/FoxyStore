from services import RecommedService
from fastapi import APIRouter
router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)

@router.get("/{user_id}")
def recommend(user_id: int, top_n: int=10):
    scores = RecommedService.getRecommend(user_id,top_n)
    return {
        "productIds":[
            int(pid) for pid,_ in scores
        ]
    }

