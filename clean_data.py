"""
Step 1 - Data Cleaning & Feature Engineering for accident.csv

Think of this like writing a validation + transformation layer before
your data hits a database in Java - we're checking types, handling
nulls, and deriving new fields (like computing `isWeekend` from a
`LocalDate` instead of storing it raw).

What this script does:
1. Drops UK-specific identifier columns that carry no meaning for our
   India-context project (LSOA codes, ONS authority codes, police force
   IDs) - keeping them would be like keeping a US zip code column in
   an India-only dataset: harmless to leave blank, misleading to use.
2. Decodes the STATS19 numeric category codes into readable labels,
   using the official Road Safety Open Dataset Guide. This matters for
   two reasons: (a) your feature-importance chart should say "Weather:
   Rain" not "Weather: 2", and (b) -1 means "Data missing or out of
   range" in STATS19 - if we don't decode it, the model will treat -1
   as a normal ordered number, which is wrong.
3. Engineers time-based features: Hour, IsNight, DayName, IsWeekend,
   Month - raw "17:42" strings and "04-01-2018" strings aren't usable
   by a model directly.
"""

import pandas as pd
import numpy as np

SRC = "/mnt/user-data/uploads/accident.csv"
OUT = "/home/claude/clean_accident.csv"

# ---------------------------------------------------------------------
# STATS19 codebook (from the official Road Safety Open Dataset Guide).
# -1 = "Data missing or out of range" in every STATS19 categorical field.
# ---------------------------------------------------------------------
MISSING = {-1: "Data missing or out of range"}

ACCIDENT_SEVERITY = {1: "Fatal", 2: "Serious", 3: "Slight"}

DAY_OF_WEEK = {1: "Sunday", 2: "Monday", 3: "Tuesday", 4: "Wednesday",
               5: "Thursday", 6: "Friday", 7: "Saturday"}

ROAD_TYPE = {**MISSING, 1: "Roundabout", 2: "One way street", 3: "Dual carriageway",
             6: "Single carriageway", 7: "Slip road", 9: "Unknown", 12: "One way street/Slip road"}

JUNCTION_DETAIL = {**MISSING, 0: "Not at junction or within 20 metres", 1: "Roundabout",
                    2: "Mini-roundabout", 3: "T or staggered junction", 5: "Slip road",
                    6: "Crossroads", 7: "More than 4 arms (not roundabout)",
                    8: "Private drive or entrance", 9: "Other junction"}

JUNCTION_CONTROL = {**MISSING, 0: "Not at junction or within 20 metres",
                     1: "Authorised person", 2: "Auto traffic signal",
                     3: "Stop sign", 4: "Give way or uncontrolled"}

LIGHT_CONDITIONS = {1: "Daylight", 4: "Darkness - lights lit", 5: "Darkness - lights unlit",
                     6: "Darkness - no lighting", 7: "Darkness - lighting unknown"}

WEATHER_CONDITIONS = {**MISSING, 1: "Fine no high winds", 2: "Raining no high winds",
                       3: "Snowing no high winds", 4: "Fine + high winds",
                       5: "Raining + high winds", 6: "Snowing + high winds",
                       7: "Fog or mist", 8: "Other", 9: "Unknown"}

ROAD_SURFACE = {**MISSING, 1: "Dry", 2: "Wet or damp", 3: "Snow", 4: "Frost or ice",
                 5: "Flood over 3cm deep"}

URBAN_RURAL = {1: "Urban", 2: "Rural", 3: "Unallocated"}

SPECIAL_CONDITIONS = {**MISSING, 0: "None", 1: "Auto traffic signal - out",
                       2: "Auto signal - defective", 3: "Road sign defective",
                       4: "Roadworks", 5: "Road surface defective",
                       6: "Oil or diesel", 7: "Mud"}

CARRIAGEWAY_HAZARDS = {**MISSING, 0: "None", 1: "Vehicle load on road",
                        2: "Other object on road", 3: "Previous accident",
                        4: "Dog on road", 5: "Other animal on road",
                        6: "Pedestrian in carriageway", 7: "Any animal in carriageway"}

DID_POLICE_ATTEND = {**MISSING, 1: "Yes", 2: "No", 3: "No - self completion form"}


def decode(df, col, mapping):
    df[col + "_Label"] = df[col].map(mapping).fillna("Unknown code: " + df[col].astype(str))
    return df


def clean_accident(df: pd.DataFrame) -> pd.DataFrame:
    """Takes the raw accident DataFrame and returns the cleaned version.
    This is the function other scripts (like build_clean_tables.py) import
    and call directly - no file I/O happens in here, just transformation."""
    df = df.copy()

    # --- 1. Drop UK-specific geography/ID columns that don't map to India ---
    drop_cols = ["Police_Force", "Local_Authority_(District)", "Local_Authority_(Highway)",
                 "LSOA_of_Accident_Location", "1st_Road_Class", "1st_Road_Number",
                 "2nd_Road_Class", "2nd_Road_Number"]
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])

    # --- 2. Handle the 1 null Time value ---
    df = df[df["Time"].notna()].reset_index(drop=True)

    # --- 3. Engineer date/time features ---
    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")
    df["Month"] = df["Date"].dt.month
    df["Hour"] = df["Time"].str.split(":").str[0].astype(int)
    df["IsNight"] = ((df["Hour"] >= 20) | (df["Hour"] < 6)).astype(int)
    df["IsWeekend"] = df["Day_of_Week"].isin([1, 7]).astype(int)  # STATS19: 1=Sun, 7=Sat

    # --- 4. Decode categorical codes into readable labels ---
    df = decode(df, "Accident_Severity", ACCIDENT_SEVERITY)
    df = decode(df, "Day_of_Week", DAY_OF_WEEK)
    df = decode(df, "Road_Type", ROAD_TYPE)
    df = decode(df, "Junction_Detail", JUNCTION_DETAIL)
    df = decode(df, "Junction_Control", JUNCTION_CONTROL)
    df = decode(df, "Light_Conditions", LIGHT_CONDITIONS)
    df = decode(df, "Weather_Conditions", WEATHER_CONDITIONS)
    df = decode(df, "Road_Surface_Conditions", ROAD_SURFACE)
    df = decode(df, "Urban_or_Rural_Area", URBAN_RURAL)
    df = decode(df, "Special_Conditions_at_Site", SPECIAL_CONDITIONS)
    df = decode(df, "Carriageway_Hazards", CARRIAGEWAY_HAZARDS)
    df = decode(df, "Did_Police_Officer_Attend_Scene_of_Accident", DID_POLICE_ATTEND)
    return df


def main():
    """Standalone mode: read from the CSV, clean, save back to a CSV.
    Used when you just want the cleaned file without touching SQL Server."""
    df = pd.read_csv(SRC)
    print(f"Loaded {len(df)} rows, {df.shape[1]} columns")
    cleaned = clean_accident(df)
    cleaned.to_csv(OUT, index=False)
    print(f"Saved cleaned dataset -> {OUT}")
    print(f"Final shape: {cleaned.shape}")
    print("\nSample of decoded columns:")
    print(cleaned[["Accident_Severity_Label", "Weather_Conditions_Label",
                    "Road_Surface_Conditions_Label", "Hour", "IsNight", "IsWeekend"]].head(5).to_string(index=False))


if __name__ == "__main__":
    main()
