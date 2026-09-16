import pyodbc

connection = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RoadSafetyDB;"
    "Trusted_Connection=yes;"
)

print("✅ Connected to SQL Server successfully!")

cursor = connection.cursor()

cursor.execute("""
    SELECT COUNT(*)
    FROM external_data.indian_road_accidents
""")

count = cursor.fetchone()[0]

print("Total accident records:", count)

connection.close()