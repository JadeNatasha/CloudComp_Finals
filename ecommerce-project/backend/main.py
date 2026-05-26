from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor

# Import our helper connection and data rules from our new files
from database import get_db_connection
from schemas import OrderCreate

app = FastAPI(title="E-Commerce API Engine")

# Enable CORS so your frontend groupmate's UI can talk to your backend safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "E-Commerce API connected to PostgreSQL on PC!"}

@app.get("/products")
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 💡 FIX: This forces PostgreSQL to keep them locked by ID, no matter what updates!
        cursor.execute("SELECT * FROM products ORDER BY id ASC;")
        products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return products
        
    except Exception as e:
        return {"error": "Database connection failed", "details": str(e)}
    
from pydantic import BaseModel

# Schema specifically for reading incoming stock restock updates
class RestockUpdate(BaseModel):
    stock: int

@app.put("/products/{product_id}/restock")
def restock_product(product_id: int, update_data: RestockUpdate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Directly update the stock column for this item inside Postgres
        cursor.execute(
            "UPDATE products SET stock = %s WHERE id = %s;", 
            (update_data.stock, product_id)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"success": True, "message": "Stock updated safely inside PostgreSQL!"}
        
    except Exception as e:
        return {"error": "Restock transaction failed", "details": str(e)}

@app.post("/buy")
def buy_product(order: OrderCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # 1. Check if the product exists and see how much stock is left (and grab the name!)
        cursor.execute("SELECT stock, name FROM products WHERE id = %s;", (order.product_id,))
        product = cursor.fetchone()
        
        if not product:
            cursor.close()
            conn.close()
            return {"error": "Product not found!"}
            
        current_stock = product['stock']
        product_name = product['name']  # 🌟 Extract the item name from the database row
        
        # 2. Guard rail: Check if there is enough inventory
        if current_stock < order.quantity:
            cursor.close()
            conn.close()
            return {"error": f"Not enough stock! Only {current_stock} left."}
            
        # 3. Subtract the purchased amount from inventory
        new_stock = current_stock - order.quantity
        cursor.execute("UPDATE products SET stock = %s WHERE id = %s;", (new_stock, order.product_id))
        
        # 4. Log the transaction into the orders table (Now capturing the descriptive name!)
        cursor.execute(
            "INSERT INTO orders (user_id, product_id, product_name, quantity) VALUES (%s, %s, %s, %s);",
            (1, order.product_id, product_name, order.quantity)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            "success": True, 
            "message": f"Successfully purchased {order.quantity} units of {product_name}!",
            "remaining_stock": new_stock
        }
        
    except Exception as e:
        return {"error": "Transaction failed", "details": str(e)}