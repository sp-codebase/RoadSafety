import os
import pandas as pd
from sqlalchemy import create_engine, text


# Local SQL Server
sqlserver_url = (
    "mssql+pyodbc://@localhost/RoadSafetyDB"
    "?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)

sqlserver_engine = create_engine(sqlserver_url)


# Render PostgreSQL
postgres_url = os.getenv("RENDER_DATABASE_URL")

if not postgres_url:
    raise RuntimeError(
        "RENDER_DATABASE_URL environment variable is not set."
    )

postgres_engine = create_engine(postgres_url)


# Tables needed by the current Road Safety API
tables = [
    "clean.news_crashes",
    "clean.news_crashes_hotspot_summary",

    "clean.states_road_accidents",
    "clean.states_fatalities",
    "clean.cities_accidents_fatalities",
    "clean.fatality_by_road_user",
    "clean.type_of_collision",
    "clean.type_of_violation",
    "clean.victims_crime_vehicle",

    "clean.morth_blackspot_counts",
    "clean.morth_blackspot_locations",
]

for table in tables:
    print(f"\nMigrating: {table}")

    schema, table_name = table.split(".", 1)

    # Read from SQL Server
    df = pd.read_sql(
        text(f"SELECT * FROM [{schema}].[{table_name}]"),
        sqlserver_engine,
    )

    print(f"Rows found: {len(df)}")

    # Create schema in PostgreSQL
    with postgres_engine.begin() as connection:
        connection.execute(
            text(f'CREATE SCHEMA IF NOT EXISTS "{schema}"')
        )

    # Write to PostgreSQL
    df.to_sql(
    table_name,
    postgres_engine,
    schema=schema,
    if_exists="replace",
    index=False,
    chunksize=500,
    method="multi",
)

    print(f"✓ Migrated {table}")


print("\nMigration completed successfully.")