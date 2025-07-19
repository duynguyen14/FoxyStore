import os

from dotenv import load_dotenv
import mysql.connector
import  pandas as pd
from sqlalchemy import create_engine
load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT")),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD")
}
db_url = f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

def fetch_behavior_data():
    # query ="""SELECT user_id, product_id, MAX(action_value) as rating from behavior
    # where user_id IS NOT NULL
    # group by user_id, product_id
    # """
    query ="""SELECT COALESCE(CAST(user_id AS CHAR), CONCAT(session_id)) AS user_key,
     product_id,
      MAX(action_value) as rating 
      from behavior
    where user_id IS NOT NULL OR session_id IS NOT NULL
    GROUP BY user_key, product_id
    """
    df = pd.read_sql_query(query,db_url)
    return df
