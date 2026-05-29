from database import get_db_connection, get_reporting_db_connection

def run_analytics_etl():
    # --- 1. PRODUCT SYNCHRONIZATION (The "Fix" for ghost data) ---
    main_conn = get_db_connection()
    report_conn = get_reporting_db_connection()
    
    main_cursor = main_conn.cursor()
    report_cursor = report_conn.cursor()

    # Extract all products from Main
    main_cursor.execute("SELECT id, name, price, stock, category, image_url FROM products;")
    products = main_cursor.fetchall()

    # TRUNCATE: Delete everything in Reporting DB first to remove 'ghost' items
    report_cursor.execute("TRUNCATE TABLE products;")

    # LOAD: Insert all fresh products
    for p in products:
        report_cursor.execute("""
            INSERT INTO products (id, name, price, stock, category, image_url) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (p[0], p[1], p[2], p[3], p[4], p[5]))
    
    report_conn.commit()
    print(f"✅ Product Sync Complete: {len(products)} products moved to Reporting DB.")

    # --- 2. ANALYTICS CALCULATION (Your existing logic) ---
    main_cursor.execute("SELECT total_statement FROM orders WHERE status = 'In Transit'")
    orders = main_cursor.fetchall()
    
    total_revenue = sum(order[0] for order in orders)
    total_orders = len(orders)
    
    report_cursor.execute("""
        INSERT INTO daily_analytics_summary (total_revenue, total_orders, total_items_sold) 
        VALUES (%s, %s, %s)
    """, (total_revenue, total_orders, total_orders))
    
    report_conn.commit()
    
    # Cleanup
    report_cursor.close()
    report_conn.close()
    main_cursor.close()
    main_conn.close()
    
    print(f"✅ ETL Sync Complete: ${total_revenue} revenue across {total_orders} orders moved to Reporting DB.")

if __name__ == "__main__":
    run_analytics_etl()