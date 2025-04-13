import os
import pymysql

def test_connection():
    try:
        connection = pymysql.connect(
            host=os.getenv('MYSQLHOST'),
            user=os.getenv('MYSQLUSER'),
            password=os.getenv('MYSQLPASSWORD'),
            database=os.getenv('MYSQLDATABASE'),
            port=int(os.getenv('MYSQLPORT', '3306')),
            ssl={
                'ca': None,
                'cert': None,
                'key': None,
                'verify_cert': False,
            }
        )
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            result = cursor.fetchone()
            print("Database connection successful!")
            print(f"Result: {result}")
        connection.close()
    except Exception as e:
        print(f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    test_connection()