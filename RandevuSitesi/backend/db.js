require("dotenv").config();
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("SQL Server bağlantısı başarılı!");
        return pool;
    })
    .catch(err => {
        console.error("Veritabanı bağlantı hatası:", err.message || err);
        throw err; 
    });

async function connectDB() {
    try {
        const pool = await poolPromise;
        return pool;
    } catch (err) {
        console.error("Bağlantı alınamadı:", err.message || err);
        throw err;
    }
}

module.exports = { connectDB, sql };
