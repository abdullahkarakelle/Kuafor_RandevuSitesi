require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { connectDB, sql } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); 

app.get("/customer", async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM customer");
        res.json(result.recordset); 
    } catch (err) {
        console.error("Veritabanı bağlantı hatası:", err.message || err);
        res.status(500).json({ success: false, message: "Veritabanı bağlantı hatası!", error: err.message });
    }
});

app.post("/customer/signup", async (req, res) => {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ success: false, message: "Tüm alanlar gereklidir!" });
    }

    try {
        const pool = await connectDB();
        
        const checkPhone = await pool
            .request()
            .input("phone", sql.NVarChar, phone)
            .query("SELECT * FROM customer WHERE phone = @phone");

        if (checkPhone.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "Bu telefon numarası zaten kayıtlı!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input("name", sql.NVarChar, name)
            .input("phone", sql.NVarChar, phone)
            .input("password", sql.NVarChar, hashedPassword)
            .query("INSERT INTO customer (name, phone, password) VALUES (@name, @phone, @password)");

        res.json({ success: true, message: "Kayıt başarılı!" });
    } catch (err) {
        console.error("Veritabanı hatası:", err.message || err);
        res.status(500).json({ success: false, message: "Kayıt sırasında hata oluştu!", error: err.message });
    }
});
app.post("/customer/login", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, message: "Telefon numarası ve şifre gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input("phone", sql.NVarChar, phone)
            .query("SELECT name, phone, password FROM customer WHERE phone = @phone");

        if (result.recordset.length === 0) {
            return res.status(400).json({ success: false, message: "Telefon numarası bulunamadı!" });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Şifre yanlış!" });
        }

        res.json({
            success: true,
            message: "Giriş başarılı!",
            user: {
                name: user.name,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error("Veritabanı hatası:", err.message || err);
        res.status(500).json({ success: false, message: "Giriş sırasında hata oluştu!", error: err.message });
    }
});

const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});
