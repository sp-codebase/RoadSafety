"""
sql_config.py

One place that maps every source CSV filename to the table name it will
become in SQL Server. Both load_raw_to_sql.py and build_clean_tables.py
import this so the naming always stays in sync between the raw and
clean schemas (raw.accident <-> clean.accident, etc.).
"""

UPLOAD_DIR = ""  # empty string = look in the same folder as the scripts

# filename -> table_name (used as raw.<table_name> and, where cleaned, clean.<table_name>)
FILE_TABLE_MAP = {
    
    "StateUT-wise_Total_Number_of_Road_Accidents_in_India_from_2016_to_2019.csv": "morth_total_accidents",
    "StateUT-wise_Total_Number_of_Persons_Killed.csv": "morth_persons_killed",
    "StateUT-wise_Total_Number_of_Persons_Injured.csv": "morth_persons_injured",
    "StateUT-wise_Severity_of_Road_Accidents.csv": "morth_severity",
    "StateUT-wise_Fatal_Road_Accidents_in_Rural_and_Urban_Areas_during_2019.csv": "morth_fatal_rural_urban_2019",
    "stateUT-wise_Road_Accidents_as_per_the_Time_of_occurrence_during_2019.csv": "morth_time_of_occurrence_2019",
    "StateUT-wise_Type_of_Road_accidents_during_2019.csv": "morth_type_of_accident_2019",
    "StateUT-wise_Accidents_classified_according_to_Type_of_Collision_during_2019.csv": "morth_collision_type_2019",
    "StatesUTs-wise_Accidents_classified_according_to_Type_of_Collision_during_2021.csv": "morth_collision_type_2021",
    "StateUT-wise_Accidents_Classified_according_to_Road_Features_during_2019.csv": "morth_road_features_2019",
    "StatesUTs-wise_Accidents_classified_according_to_Road_Environment_during_2020.csv": "morth_road_environment_2020",
    "StateUT-wise_Accidents_Classified_according_to_Type_of_Junctions_during_2019.csv": "morth_junctions_2019",
    "StateUT-wise_Accidents_Classified_according_to_Type_of_Traffic_Control_during_2019.csv": "morth_traffic_control_2019",
    "StateUT-wise_Accidents_Classified_according_to_Type_of_Weather_Condition_during_2019.csv": "morth_weather_2019",
    "StateUT-wise_Accidents_classified_according_to_type_of_impacting_vehiclesobjects_during_2019.csv": "morth_impacting_vehicles_2019",
    "StateUT-wise_Accidents_Classified_according_to_Non-Use_of_Safety_Device__Non-Wearing_of_Helmet__during_2019.csv": "morth_helmet_nonuse_2019",
    "StateUT-wise_Accidents_Classified_according_to_Non-Use_of_Safety_Device__Non-Wearing_of_Seat_Belt__by_Victims_during_2019.csv": "morth_seatbelt_nonuse_2019",
    "StatesUTs-wise_data_of_accidents_and_fatalities_classified_according_to_type_of_traffic_violation_on_National_Highways_under_different_categories_during_2020.csv": "morth_nh_traffic_violation_2020",
    "_StateUT-wise_number_of_Blackspots_from_2016_to_2018_.csv": "morth_blackspot_counts",
    "States_wise_list_of_top_ten_black_spots_from_2016_to_2018.csv": "morth_blackspot_locations",
}

# Tables that get a cleaned state-name column standardized (all except accident,
# which is cleaned separately via clean_accident.py)
MORTH_TABLES = {k: v for k, v in FILE_TABLE_MAP.items() if v != "accident"}
