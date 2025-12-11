# Database Folder Documentation

This folder contains all necessary resources for setting up, seeding, and testing the performance of the **PETCAREX** database.

## Functionalities

*   **Database Initialization**: Scripts to create the database schema, tables, and stored procedures.
*   **Data Seeding**: Python scripts to generate large volumes of realistic mock data for testing.
*   **Performance Testing**: SQL scripts and logs to benchmark query performance with and without indexes.

---

## Database Initialization

The `init-database` folder contains the core SQL scripts required to build the database structure.

*   **`init.sql`**: Defines the database schema, including all tables (e.g., `KHACHHANG`, `THUCUNG`, `HOADON`, `HOSOBENHAN`) and their relationships (Foreign Keys).
*   **`procedure.sql`**: Contains Stored Procedures and Triggers used for business logic (e.g., `sp_KhoiTaoHoaDon`, `sp_KeToaThuoc`).
*   **`backup.sql` / `backup/`**: Resources for backing up and restoring the database state.

To initialize the database, execute these scripts in your SQL Server environment in the following order:
1.  `init.sql`
2.  `procedure.sql`

---

## Data Seeding

The `seed-data` folder contains Python scripts designed to populate the database with a significant amount of data for stress testing and performance analysis.

### Setup & Installation

1.  **Navigate to the folder**:
    ```bash
    cd database/seed-data
    ```

2.  **Create a Virtual Environment** (Optional but recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configuration**:
    *   Check `scripts/config.py` to ensure the database connection details (Server, User, Password, DB Name) are correct.

### Running the Seed Script

To generate all data, simply run:

```bash
python main.py
```

### Data Volume Overview

The seeding scripts (`scripts/`) generate the following data volume:

*   **Base Data** (`base_data.py`):
    *   **10** Branches.
    *   **~70** Employees (Managers, Receptionists, Sales, Doctors).
    *   **130** Products (10 Vaccines, 20 Medicines, 100 Retail Items).
    *   **1,000** Customers.
    *   **4,000** Pets (4 pets per customer).

*   **Medical Data** (`medical_data.py`):
    *   **100,000** Medical Records (including Diagnosis, Prescriptions, and Invoices).

*   **Retail Data** (`retail_data.py`):
    *   **80,000** Retail Invoices (Sales of retail products).

*   **Vaccine History** (`vaccine_history_data.py`):
    *   **~1,000** Vaccination records (Randomly assigned to pets).

---

## Performance Testing

The `tests` folder is dedicated to benchmarking database performance, specifically focusing on the impact of **Indexes**.

### Structure

The tests are organized into subfolders (`test1`, `test2`, `test3`, etc.), each representing a specific query scenario.

Inside each `test<i>` folder, you will find:

*   **`test<i>_index.sql`**: The query executed **WITH** the specific index applied.
*   **`test<i>_noindex.sql`**: The same query executed **WITHOUT** the index (or with the index disabled/dropped).
*   **`test<i>.log`**: Contains the execution statistics captured from SQL Server (e.g., `Table 'HOADON'. Scan count 1, logical reads 3872...`).
*   **`test<i>.md`**: A generated report summarizing the performance comparison (Logical Reads, CPU Time, Execution Plan cost).

### Automated Testing (Python)

You can automate the execution of these tests using the provided Python script. This is useful for running all benchmarks in one go and ensuring consistent log capture.

1.  **Prerequisites**:
    *   Ensure your Docker container is running (default name: `sqlserverdb`).
    *   Update `tests/main.py` if your container name or password differs.

2.  **Configuration**:
    *   The `tests/config.json` file defines the test cases, mapping SQL input files to their expected log output paths.

3.  **Run the Script**:
    ```bash
    cd database/tests
    python main.py
    ```
    This script will:
    *   Connect to the Docker container.
    *   Execute each `_noindex.sql` and `_index.sql` file defined in `config.json`.
    *   Capture the output (including `STATISTICS IO`, `STATISTICS TIME`) and save it to the specified `.log` files (e.g., `test1/test1_noindex.log`).

### Manual Testing

If you prefer to run tests manually:

1.  Open the SQL files in your SQL Server management tool (e.g., SSMS, Azure Data Studio).
2.  Enable statistics before running:
    ```sql
    SET STATISTICS IO ON;
    SET STATISTICS TIME ON;
    ```
3.  Run the `_noindex.sql` script and record the messages.
4.  Run the `_index.sql` script and record the messages.
5.  Compare the **Logical Reads** and **CPU Time** to observe the optimization provided by the index.
