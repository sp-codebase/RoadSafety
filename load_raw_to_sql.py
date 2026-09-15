"""
Step 1a - Load Raw CSVs into SQL Server's raw schema

This is the "landing zone" step: every CSV goes into SQL Server exactly
as it is, one table per file, no cleaning applied. This matches your
blueprint's rule for the raw schema - we keep an untouched copy so you
can always go back and re-audit the original source if a cleaning
decision later turns out to be wrong.

HOW TO POINT THIS AT YOUR SQL SERVER:
Change CONNECTION_STRING below. Two common cases:

  1. Local SQL Server / SQL Server Express with Windows Authentication:
     "mssql+pyodbc://@localhost\\SQLEXPRESS/RoadSafetyDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

  2. SQL Server with a username/password:
     "mssql+pyodbc://USERNAME:PASSWORD@SERVER_NAME/RoadSafetyDB?driver=ODBC+Driver+17+for+SQL+Server"

You'll need the "ODBC Driver 17 for SQL Server" installed on your machine
(search "ODBC Driver 17 for SQL Server download" - it's a small free
Microsoft installer), plus these two Python packages:
    pip install pyodbc sqlalchemy

Run the CREATE_SCHEMAS.sql script (provided separately) once in SSMS
before running this, so the `raw`, `clean`, and `ml` schemas exist.
"""

import os
import re
import pandas as pd
from sqlalchemy import create_engine
from sql_config import UPLOAD_DIR, FILE_TABLE_MAP

# --- Set to match local SQL Server instance ---
CONNECTION_STRING = (
    "mssql+pyodbc://@localhost/RoadSafetyDB"
    "?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)


def _normalize(name: str) -> str:
    """Strip all non-alphanumeric characters and lowercase to match filenames
    regardless of whether spaces, underscores, parentheses, or quotes differ."""
    return re.sub(r"[^a-zA-Z0-9]+", "", name).lower()


def resolve_filename(expected_filename: str) -> str:
    """Finds the actual file on disk that best matches expected_filename,
    even if spaces/underscores differ. Raises FileNotFoundError with a
    helpful message if nothing close enough is found."""
    directory = UPLOAD_DIR or os.path.dirname(os.path.abspath(__file__))
    target = _normalize(expected_filename)
    for actual in os.listdir(directory):
        if _normalize(actual) == target:
            return os.path.join(directory, actual)
    raise FileNotFoundError(
        f"Could not find a file matching '{expected_filename}' in '{os.path.abspath(directory)}'."
    )


def read_csv_safely(path: str) -> pd.DataFrame:
    """Some MoRTH files use Windows-1252 encoding instead of UTF-8
    (this is what caused the earlier UnicodeDecodeError on the
    blackspot locations file)."""
    try:
        return pd.read_csv(path)
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding="cp1252")


def load_all_raw(engine=None, dry_run=False):
    """
    dry_run=True just reads every file and prints what WOULD be uploaded,
    without needing a database connection at all - use this first to
    confirm every file loads and has the shape you expect.
    """
    for expected_filename, table_name in FILE_TABLE_MAP.items():
        actual_path = resolve_filename(expected_filename)
        df = read_csv_safely(actual_path)
        print(f"{os.path.basename(actual_path)} -> raw.{table_name}  ({df.shape[0]} rows, {df.shape[1]} cols)")

        if not dry_run:
            df.to_sql(table_name, engine, schema="raw", if_exists="replace", index=False)


if __name__ == "__main__":
    import sys

    if "--dry-run" in sys.argv:
        print("DRY RUN - no database connection used\n")
        load_all_raw(dry_run=True)
    else:
        engine = create_engine(CONNECTION_STRING)
        load_all_raw(engine=engine)
        print("\nAll raw tables loaded into SQL Server.")
