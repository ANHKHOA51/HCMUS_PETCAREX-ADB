import sql from 'mssql';

const config = {
  user: "sa",
  password: "Truong123@",
  database: "PETCAREX",
  server: "localhost", 
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => console.error("Database Connection Failed", err));

const db = await pool;

export default db