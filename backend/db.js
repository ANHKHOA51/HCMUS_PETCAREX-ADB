import sql from 'mssql';

// console.log("Database configuration:", {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   server: process.env.DB_SERVER
// });

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "Truong123@",
  database: process.env.DB_NAME || "PETCAREX",
  server: process.env.DB_SERVER || "localhost", 
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