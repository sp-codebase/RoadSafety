-- CREATE_SCHEMAS.sql
-- Run this ONCE in SQL Server Management Studio (SSMS) before running
-- the Python load scripts. This just creates the empty database and
-- the three schemas your project plan calls for - the Python scripts
-- create the actual tables inside them automatically.

CREATE DATABASE RoadSafetyDB;
GO

USE RoadSafetyDB;
GO

CREATE SCHEMA raw;
GO
CREATE SCHEMA clean;
GO
CREATE SCHEMA ml;
GO
