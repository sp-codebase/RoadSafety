"""
Step 1b - Build clean.* Tables in SQL Server

Reuses the cleaning logic we already built and tested:
  - clean_accident() from clean_data.py handles accident.csv
  - load_morth_csv() from canonical_states.py handles every MoRTH file
    (standardizes state names, drops Total/National Average rows)

Same connection-string setup as load_raw_to_sql.py - see that file's
docstring for the two common connection string patterns.
"""

import pandas as pd
from sqlalchemy import create_engine
from sql_config import UPLOAD_DIR, MORTH_TABLES
from clean_data import clean_accident
from canonical_states import load_morth_csv
from load_raw_to_sql import resolve_filename


def build_clean_accident() -> pd.DataFrame:
    raw = pd.read_csv(resolve_filename("accident.csv"))
    return clean_accident(raw)


def build_clean_morth_tables() -> dict:
    """Returns {table_name: cleaned_dataframe} for every MoRTH file."""
    cleaned = {}
    for filename, table_name in MORTH_TABLES.items():
        df = load_morth_csv(resolve_filename(filename))
        cleaned[table_name] = df
    return cleaned


def build_all(engine=None, dry_run=False):
    print("Cleaning accident.csv ...")
    clean_acc = build_clean_accident()
    print(f"  -> clean.accident  ({clean_acc.shape[0]} rows, {clean_acc.shape[1]} cols)")
    if not dry_run:
        clean_acc.to_sql("accident", engine, schema="clean", if_exists="replace", index=False)

    print("\nCleaning MoRTH tables ...")
    morth_cleaned = build_clean_morth_tables()
    for table_name, df in morth_cleaned.items():
        print(f"  -> clean.{table_name}  ({df.shape[0]} rows, {df.shape[1]} cols)")
        if not dry_run:
            df.to_sql(table_name, engine, schema="clean", if_exists="replace", index=False)


if __name__ == "__main__":
    import sys
    from load_raw_to_sql import CONNECTION_STRING

    if "--dry-run" in sys.argv:
        print("DRY RUN - no database connection used\n")
        build_all(dry_run=True)
    else:
        engine = create_engine(CONNECTION_STRING)
        build_all(engine=engine)
        print("\nAll clean tables loaded into SQL Server.")
