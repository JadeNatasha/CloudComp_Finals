import psycopg2
from psycopg2.extras import RealDictCursor

# 🔑 DATABASE CONFIGURATION
DB_CONFIG = {
    "dbname": "ecommerce_main_db",
    "user": "postgres",
    "password": "anne2663",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    """Helper function to open a clean connection to your database."""
    conn = psycopg2.connect(**DB_CONFIG)
    return conn