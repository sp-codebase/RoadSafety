"""
canonical_states.py

Canonical Indian State/UT name mapping, built from auditing all MoRTH
state-wise CSVs collected for the Road Safety Intelligence project
(blackspot counts, blackspot locations, and the 2019-2021 category
breakdowns by collision type, road features, junctions, traffic
control, weather, vehicle type, and safety-device non-use).

Two kinds of inconsistency were found across files:
  1. Genuine misspellings / formatting variants -> fixed by STATE_NAME_MAP.
  2. Real administrative history (not errors) -> handled separately:
       - Orissa was renamed Odisha in 2011. Some publications still say
         "Orissa"; treat them as the same entity.
       - Jammu and Kashmir was split into two UTs (Jammu & Kashmir, and
         Ladakh) in October 2019. Files published before the split will
         not have a separate "Ladakh" row; files after it will. Do not
         try to force these into the same row count - note it in your
         cleaning log instead.
"""

import re
import pandas as pd

# Canonical name -> every variant spelling/format seen in the raw files so far.
# Add to this dict as you encounter new variants in future MoRTH files.
STATE_NAME_MAP = {
    "Andaman and Nicobar Islands": [
        "Andaman and Nicobar Island", "Andaman and Nicobar Islands",
        "Andaman and Nicobar Is.", "Andaman & Nicobar Islands",
    ],
    "Andhra Pradesh": ["Andhra Pradesh"],
    "Arunachal Pradesh": ["Arunachal Pradesh"],
    "Assam": ["Assam"],
    "Bihar": ["Bihar"],
    "Chandigarh": ["Chandigarh"],
    "Chhattisgarh": ["Chhattisgarh", "Chhattishgarh", "Chattisgarh"],
    # NOTE: Dadra & Nagar Haveli and Daman & Diu were two separate UTs until
    # they were merged into one UT in Jan 2020. Kept as separate canonical
    # entities here (not collapsed) because older files report them
    # separately - merging their names would silently combine two different
    # rows' data. Handle the pre/post-2020 merge explicitly in your ETL
    # instead of via this spelling map.
    "Dadra and Nagar Haveli": ["Dadra and Nagar Haveli"],
    "Daman and Diu": ["Daman and Diu"],
    "Delhi": ["Delhi", "NCT of Delhi"],
    "Goa": ["Goa"],
    "Gujarat": ["Gujarat"],
    "Haryana": ["Haryana"],
    "Himachal Pradesh": ["Himachal Pradesh"],
    "Jammu and Kashmir": ["Jammu and Kashmir", "Jammu & Kashmir"],
    "Ladakh": ["Ladakh"],  # only exists in post Oct-2019 files - do not merge into J&K
    "Jharkhand": ["Jharkhand"],
    "Karnataka": ["Karnataka", "Karnatka"],
    "Kerala": ["Kerala"],
    "Lakshadweep": ["Lakshadweep"],
    "Madhya Pradesh": ["Madhya Pradesh"],
    "Maharashtra": ["Maharashtra", "Maharastra", "Maharahtra"],
    "Manipur": ["Manipur"],
    "Meghalaya": ["Meghalaya", "Megahalaya"],
    "Mizoram": ["Mizoram"],
    "Nagaland": ["Nagaland"],
    "Odisha": ["Odisha", "Orissa", "Orrisa", "Orrisha"],  # 2011 rename, treat as same entity
    "Puducherry": ["Puducherry", "Pondicherry"],
    "Punjab": ["Punjab"],
    "Rajasthan": ["Rajasthan"],
    "Sikkim": ["Sikkim"],
    "Tamil Nadu": ["Tamil Nadu", "Tamilnadu"],
    "Telangana": ["Telangana", "Telengana"],
    "Tripura": ["Tripura"],
    "Uttar Pradesh": ["Uttar Pradesh"],
    "Uttarakhand": ["Uttarakhand", "Uttrakhand", "Uttarkhand"],
    "West Bengal": ["West Bengal", "West Begal"],
}

# Flip into a variant -> canonical lookup (case/whitespace-insensitive)
_VARIANT_TO_CANONICAL = {}
for canonical, variants in STATE_NAME_MAP.items():
    for v in variants:
        _VARIANT_TO_CANONICAL[v.strip().lower()] = canonical


def normalize_state_name(raw_name: str) -> str:
    """Map any known variant spelling to its canonical state/UT name.
    Returns None for rows that aren't real states (e.g. 'Total')."""
    if not isinstance(raw_name, str):
        return None
    cleaned = raw_name.strip()
    if (re.match(r"^total\b", cleaned, flags=re.IGNORECASE)
            or re.match(r"^national average", cleaned, flags=re.IGNORECASE)
            or re.match(r"^all india", cleaned, flags=re.IGNORECASE)
            or cleaned == ""):
        return None  # drop summary/blank rows
    key = cleaned.lower()
    return _VARIANT_TO_CANONICAL.get(key, cleaned)  # fall back to cleaned original if unseen


def load_morth_csv(path: str, state_col: str = None, encoding_fallback="cp1252") -> pd.DataFrame:
    """
    Load a MoRTH state-wise CSV, drop the 'Total' row, and standardize
    the state/UT name column to canonical spelling.

    state_col: name of the state column if it isn't the first column.
    """
    try:
        df = pd.read_csv(path)
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding=encoding_fallback)

    col = state_col or df.columns[0]
    df[col] = df[col].apply(normalize_state_name)
    df = df[df[col].notna()].reset_index(drop=True)
    df = df.rename(columns={col: "state_ut"})
    return df


if __name__ == "__main__":
    # Quick self-test / example usage against files already collected
    base = "/mnt/user-data/uploads/"
    examples = [
        "_StateUT-wise_number_of_Blackspots_from_2016_to_2018_.csv",
        "StatesUTs-wise_Accidents_classified_according_to_Road_Environment_during_2020.csv",
        "StateUT-wise_Accidents_Classified_according_to_Type_of_Weather_Condition_during_2019.csv",
    ]
    for fn in examples:
        try:
            df = load_morth_csv(base + fn)
            print(f"{fn}: {len(df)} state rows after cleaning, "
                  f"{df['state_ut'].nunique()} distinct states")
        except FileNotFoundError:
            print(f"{fn}: not found, skipping self-test")
