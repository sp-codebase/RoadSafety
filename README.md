# 🚦 AI-Based Road Safety Intelligence and Black Spot Prediction System

An AI-powered road safety analytics platform designed to analyze historical Indian road accident data, identify accident hotspots, estimate accident severity, and provide data-driven road safety recommendations.

The system combines **machine learning, spatial clustering, SQL analytics, and interactive maps** to help road authorities understand where and under what conditions serious accidents are more likely to occur.

---



---

## 🎯 Problem Statement

Road accidents remain a major public safety challenge in India.

Although large amounts of accident data are available, it is difficult to convert this data into actionable insights such as:

- Which locations experience accident concentration?
- Which areas should be prioritized for safety interventions?
- What environmental and road conditions are associated with severe accidents?
- Where are potential accident hotspots located?
- What preventive measures can be considered for high-priority locations?

Traditional analysis often focuses on individual accident records or yearly statistics. Our system combines these records with **machine learning and spatial analysis** to provide a more comprehensive view of road safety.

---

## 💡 Our Solution

The **AI-Based Road Safety Intelligence and Black Spot Prediction System** provides a unified platform for:

1. **Accident Data Analysis**
2. **Geographic Hotspot Detection**
3. **Accident Severity Prediction**
4. **Black Spot / Hotspot Visualization**
5. **Risk and Priority Scoring**
6. **Preventive Recommendations**

The platform is designed to support road-safety decision making rather than replace expert investigation.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │                     │
                    │ Dashboard           │
                    │ Interactive Map     │
                    │ Prediction Form     │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │                     │
                    │ /api/health        │
                    │ /api/hotspots      │
                    │ /api/locations     │
                    │ /api/predict-risk  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌──────────────────┐
        │   SQL Server    │         │ ML Pipeline      │
        │                 │         │                  │
        │ Accident Data   │         │ Random Forest    │
        │ Hotspot Data    │         │ Classifier       │
        │ MoRTH Data      │         │                  │
        └─────────────────┘         └──────────────────┘






 # 📊 Dataset Sources

This project uses multiple datasets from Indian road-safety sources. Different datasets are used for different parts of the system because the available datasets contain different types of information.

---

## 1. Fatal Road Traffic Crash Dataset — India

**Source:** Mendeley Data

**Dataset:** *Dataset on fatal road traffic crash attributes extracted via natural language processing of online media articles in India*

**Records:** 2,898 fatal crashes

**Period:** 2022–2023

🔗 https://data.mendeley.com/datasets/bc5sv6wnd9/7

### Dataset Information

The dataset contains fatal road traffic crashes in India extracted from online media reports using natural language processing.

Important attributes include:

- Crash Number
- Crash Date
- Crash Day
- Location
- State
- Million Plus City
- Latitude / Longitude
- Vehicles involved
- Number killed
- Number injured
- Road Type
- Crash Type

### Used in our project for

This dataset is primarily used for **geospatial accident analysis and hotspot detection**.

The latitude and longitude information allows the system to:

1. Plot accident locations on an interactive map.
2. Perform geographic clustering using DBSCAN.
3. Identify potential accident hotspots.
4. Calculate accident, fatality, and injury statistics for each hotspot.
5. Assign a hotspot priority score.

### Important Limitation

This is a **media-reported fatal crash dataset**, not a complete official census of all road accidents in India.

Therefore, the detected hotspots represent patterns within the available dataset and should not automatically be considered official government-designated black spots.

---

## 2. Accident Data of Selected Indian Highways

**Source:** Zenodo

**Dataset:** *Accident Data of Selected Indian Highways for Accident Severity Prediction Using Machine Learning Models*

**Records:** 8,116 accident records

🔗 https://zenodo.org/records/16946653

### Geographic Coverage

The dataset contains accident records from selected Indian highway sections, including:

- Pune–Solapur (NH-9), Maharashtra
- Barwa-Adda–Panagarh (NH-2), Jharkhand & West Bengal
- Chengapally–Walayar, Tamil Nadu
- Nagpur region, Maharashtra

### Important Attributes

The dataset contains information related to:

- Date
- Day of week
- Time of accident
- Accident location
- Chainage
- Road side
- Accident severity
- Causes
- Road features
- Road conditions
- Weather conditions
- Vehicle type involved

### Used in our project for

This dataset is used to train the **Accident Severity Prediction Machine Learning Model**.

The model uses 12 selected features:

```text
Day_of_Week
Month
Hour
IsWeekend
Accident_Location_A
Accident_Location_A_Chainage_km
Accident_Location_A_Chainage_km_RoadSide
Causes_D
Road_Feature_E
Road_Condition_F
Weather_Conditions_H
Vehicle_Type_Involved_J_V1




3. Ministry of Road Transport and Highways (MoRTH) Data

Source: Open Government Data Platform India

MoRTH road accident datasets are used as supporting official government data for understanding road accident patterns in India.

Main Source

🔗 https://tn.data.gov.in/catalog/road-accidents-india-classified-according-various-parameters

The catalog provides road accident information classified according to various parameters.

Year-Specific Sources

Road Accidents in India 2019

🔗 https://www.data.gov.in/catalog/road-accidents-india-2019

Road Accidents in India 2020

🔗 https://punjab.data.gov.in/catalog/road-accidents-india-2020

Road Accidents in India 2021

🔗 https://up.data.gov.in/catalog/road-accidents-india-2021

Used in our project for

MoRTH data provides supporting information for:

Accident statistics
Fatality statistics
Injury statistics
Accident severity analysis
Road environment analysis
Collision types
Junction-related accidents
Weather-related accidents
Traffic-control-related accidents
Other road-safety indicators




4. Official MoRTH Black Spot Data

Source: Ministry of Road Transport and Highways

MoRTH Black Spot Management Information System

🔗 https://www.blackspot.morth.gov.in/

Official black spot information is used as a reference for understanding government-identified accident-prone locations.

Rajasthan Black Spots

The project also references the official Rajasthan black spot document published by MoRTH:

🔗 https://morth.gov.in/sites/default/files/Rajasthan.pdf

Used in our project for

Official black spot information can be used to:

Compare government-identified black spots with data-driven hotspots.
Provide additional context to hotspot analysis.
Demonstrate the difference between official black spots and our DBSCAN-generated potential hotspots.





Dataset Limitations

The datasets have different scopes and collection methodologies.

Therefore:

The datasets should not be treated as a single unified accident census.
The media-reported crash dataset may contain reporting bias.
The highway severity dataset covers selected highway sections rather than all roads in India.
DBSCAN hotspots represent geographic concentrations in the available data.
A data-driven hotspot is not automatically an official MoRTH black spot.
ML predictions represent patterns learned from historical data and do not guarantee future accident outcomes.

