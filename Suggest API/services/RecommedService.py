import json
import numpy as np
from fastapi import  FastAPI, HTTPException
import os
def getRecommend(user_id: int, top_n: int=10):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    U = np.load(os.path.join(BASE_DIR, "models", "U_matrix.npy"))
    P = np.load(os.path.join(BASE_DIR, "models", "P_matrix.npy"))

    with open(os.path.join(BASE_DIR,"models", "user_map.json"), "r") as f:
        users_id_map = json.load(f)

    with open(os.path.join(BASE_DIR,"models", "product_map.json"), "r") as f:
        products_id_map = json.load(f)
    if (str(user_id) not in users_id_map):
        raise HTTPException(status_code=404, detail="user not found")
        # print("loi")
    uid = users_id_map[str(user_id)]
    scores = []

    for pid, pidx in products_id_map.items():
        score = np.dot(U[uid], P[pidx])
        scores.append((pid, score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_n]