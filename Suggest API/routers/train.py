import json
import os.path

from config.db_config import fetch_behavior_data
import numpy as np
from fastapi import APIRouter
router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)

@router.get("/ai/train")
def train():
    df = fetch_behavior_data()
    print(f"data {df.head()}")
    users_id = df["user_key"].unique()
    products_id = df["product_id"].unique()
    users_id_map = {}
    for idx, user_id in enumerate(users_id):
        users_id_map[str(user_id)] = int(idx)
    products_id_map = {}
    for idx, product_id in enumerate(products_id):
        products_id_map[str(product_id)] = int(idx)
    n_users = len(users_id)
    n_items = len(products_id)
    k = 5
    # khởi tạo ma trận với kích thước n_users dòng và k cột với độ lệch chuẩn là 0.1
    # mỗi dòng tương ứng với 1 user
    # và là 1 vector đặc trưng có k chiều
    U = np.random.normal(scale=0.1, size=(n_users, k))
    # khởi tạo ma trận sản phẩm tương tự user
    P = np.random.normal(scale=0.1, size=(n_items, k))
    # Tham số học
    alpha = 0.01  # learning rate
    lambda_reg = 0.1  # regularization
    epochs = 300
    for epoch in range(epochs):
        total_loss = 0
        for row in df.itertuples():
            # lấy chỉ số đã map cho uid thông qua user_key
            uid = users_id_map[str(row.user_key)]
            # lấy chỉ số đã map cho pid
            pid = products_id_map[str(row.product_id)]
            # lấy socre
            rating = row.rating
            # tính tích vô hướng vector U[uid] * P[pid]
            pred = np.dot(U[uid], P[pid])
            # sai số
            error = rating - pred
            # cập sao cho loss nhỏ hơn
            # cập nhật theo thuật toan sgd đi ngược lại đạo hàm của loss thì càng ngành loss càng nhỏ
            # Cập nhật vector
            # bản chất của nó
            # loss = error^2 + lambda_reg*(U[uid]^2 +P[pid]^2)
            # đạo hàm của loss  theo U[id] = đạo hàm của error^2 theo U[uid] +2* lambda_reg * U[uid]
            # error = rating - (U[uid]*P[pid])
            # đạo hàm của error^2: 2 * (rating - U[uid]*P[pid]) * P[pid]
            # => đạo hàm của loss = -2 *error *P[pid] + 2* lambda_reg * U[uid]
            # cập nhật theo nguọc hướng đạo hàm để tìm dc loss nhỏ hơn
            # U[uid] = U[uid]+2 *error *P[pid] - 2* lambda_reg * U[uid]
            # => ta có biểu thúc sau
            U[uid] += alpha * (error * P[pid] - lambda_reg * U[uid])
            # tương tự so với p
            P[pid] += alpha * (error * U[uid] - lambda_reg * P[pid])

            total_loss += error ** 2

        print(f"Epoch {epoch+1}: Loss = {total_loss:.4f}")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_DIR = os.path.join(BASE_DIR, "models")
    np.save(os.path.join(MODEL_DIR, "U_matrix.npy"), U)
    np.save(os.path.join(MODEL_DIR, "P_matrix.npy"), P)
    with open(os.path.join(MODEL_DIR,"user_map.json"), "w") as f:
        json.dump(users_id_map,f)
    with open(os.path.join(MODEL_DIR,"product_map.json"), "w") as f:
        json.dump(products_id_map,f)
    return {"message": "Model training completed"}