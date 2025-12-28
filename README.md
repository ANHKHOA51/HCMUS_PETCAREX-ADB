# HCMUS_PETCAREX-ADB

This project contains the source code for the PetCareX system, including a Node.js backend, a React/Vite frontend, and an MSSQL database.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18+)
- npm

> **Database Setup:** For detailed instructions on how to restore the database from a backup file or run data seeding scripts, please refer to the [Database README](database/README.md).

---

## Method 1: Run with Docker (Recommended)

This method sets up the Database, Backend, and Frontend containers automatically.

1. **Clone the repository** (if you haven't already).
2. **Navigate to the project root**.
3. **Run Docker Compose**:
   ```bash
   docker-compose up --build
   ```

### Access Points
- **Frontend**: [http://localhost:4173](http://localhost:4173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **SQL Server**: `localhost:1433` (User: `sa`, Password: `Truong123@`)

---

## Method 2: Run Manually

If you prefer to run the services individually on your machine.

### 1. Database Setup

You need a running MSSQL instance. You can use the Docker container for just the database:

```bash
# Start only the database container
docker-compose up -d sqlserverdb
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create or update the `.env` file in the `backend/` directory. Ensure `DB_SERVER` is set to `localhost` to connect to the exposed Docker port.

   ```env
   DB_SERVER=localhost
   DB_USER=sa
   DB_PASSWORD=Truong123@
   DB_NAME=PETCAREX
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm run dev
   # or
   node app.js
   ```
   The backend will run at [http://localhost:3000](http://localhost:3000).

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in Development Mode (with hot-reload):
   ```bash
   npm run dev
   ```
   Access at [http://localhost:5173](http://localhost:5173).

4. OR Run Production Build Preview:
   ```bash
   npm run build
   npm run preview
   ```
   Access at [http://localhost:4173](http://localhost:4173).
