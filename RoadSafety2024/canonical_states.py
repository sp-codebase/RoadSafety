import re

STATE_ALIASES = {
    "andaman and nicobar islands": "Andaman and Nicobar Islands",
    "andaman and nicobar is.": "Andaman and Nicobar Islands",

    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "chattisgarh": "Chhattisgarh",

    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",

    "jammu and kashmir": "Jammu and Kashmir",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "karnatka": "Karnataka",

    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "maharahtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",

    "odisha": "Odisha",
    "orissa": "Odisha",
    "orrisa": "Odisha",

    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "telangana": "Telangana",
    "telengana": "Telangana",

    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "uttarkhand": "Uttarakhand",

    "west bengal": "West Bengal",
    "west begal": "West Bengal",

    "delhi": "Delhi",
    "chandigarh": "Chandigarh",
    "puducherry": "Puducherry",
    "pondicherry": "Puducherry",

    "ladakh": "Ladakh",
    "lakshadweep": "Lakshadweep",
    "daman and diu": "Daman and Diu",
    "dadra and nagar haveli": "Dadra and Nagar Haveli",
}


def normalize_state_name(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    key = re.sub(r"\s+", " ", value.lower())

    return STATE_ALIASES.get(key, value)