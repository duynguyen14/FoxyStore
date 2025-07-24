import os

from dotenv import load_dotenv
import  pandas as pd
from pathlib import Path
base_dir = Path(__file__).resolve().parent.parent
env_file = os.getenv("APP_ENV_FILE", base_dir / ".env.test")
# env_file = os.getenv("APP_ENV_FILE",base_dir / ".env.prod")
load_dotenv(dotenv_path=env_file)
DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST"),
    "port": int(os.getenv("MYSQL_PORT")),
    "database": os.getenv("MYSQL_DB"),
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD")
}
db_url = f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

def fetch_behavior_data():
    query ="""SELECT COALESCE(CAST(user_id AS CHAR), CONCAT(session_id)) AS user_key,
     product_id,
      MAX(action_value) as rating 
      from behavior
    where user_id IS NOT NULL OR session_id IS NOT NULL
    GROUP BY user_key, product_id
    """
    df = pd.read_sql_query(query,db_url)
    return df