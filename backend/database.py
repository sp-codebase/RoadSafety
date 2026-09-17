"""
Database connection for Road Safety Intelligence API.
"""

import os

from sqlalchemy import create_engine, text


# ==========================================
# Render PostgreSQL Connection
# ==========================================

CONNECTION_STRING = os.getenv("RENDER_DATABASE_URL")
if not CONNECTION_STRING:
    raise RuntimeError(
        "RENDER_DATABASE_URL environment variable is not set."
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


