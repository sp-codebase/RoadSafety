"""
Database connection for Road Safety Intelligence API.
"""

from sqlalchemy import create_engine, text


# ==========================================
# SQL Server Connection
# ==========================================

CONNECTION_STRING = (
    "mssql+pyodbc://@localhost/RoadSafetyDB"
    "?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)


# ==========================================
# Create SQLAlchemy Engine
# ==========================================

engine = create_engine(
    CONNECTION_STRING,
    pool_pre_ping=True
)


# ==========================================
# Test Database Connection
# ==========================================

def test_connection():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT 1")
            )

            result.fetchone()

        return True

    except Exception as e:

        print("Database connection failed:")
        print(e)

        return False

