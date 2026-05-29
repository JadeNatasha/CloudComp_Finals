from database import get_db_connection, get_reporting_db_connection

def run_analytics_etl():
    # 1. EXTRACT: Connect to your main transactional database
    main_conn = get_db_connection()
    # Using RealDictCursor if available, but standard cursor works fine here
    main_cursor = main_conn.cursor() 
    
    # Updated: Changed 'amount' to 'total_statement' and 'completed' to 'In Transit'
    main_cursor.execute("SELECT total_statement FROM orders WHERE status = 'In Transit'")
    orders = main_cursor.fetchall()
    
    # 2. TRANSFORM: Calculate business metrics
    # orders is a list of tuples, e.g., [(100.0,), (250.0,)]
    total_revenue = sum(order[0] for order in orders)
    total_orders = len(orders)
    
    main_conn.close()

    # 3. LOAD: Connect to your reporting/analytics database
    report_conn = get_reporting_db_connection()
    report_cursor = report_conn.cursor()
    
    # Updated: Using INSERT into your new daily_analytics_summary table
    # This adds a new snapshot for today's date
    report_cursor.execute("""
        INSERT INTO daily_analytics_summary (total_revenue, total_orders, total_items_sold) 
        VALUES (%s, %s, %s)
    """, (total_revenue, total_orders, total_orders)) # total_orders used as placeholder for items
    
    report_conn.commit()
    report_cursor.close()
    report_conn.close()
    
    print(f"✅ ETL Sync Complete: ${total_revenue} revenue across {total_orders} orders moved to Reporting DB.")

if __name__ == "__main__":
    run_analytics_etl()