require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { connectDB, sql } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();


app.get("/barber", async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM barber");
        res.json(result.recordset);
    } catch (err) {
        console.error("Veritabanı bağlantı hatası:", err.message || err);
        res.status(500).json({ success: false, message: "Veritabanı bağlantı hatası!", error: err.message });
    }
});

app.post("/barber/signup", async (req, res) => {
    const { name, phone, password, location } = req.body;
    console.log("Gelen veri:", req.body);

    if (!name || !phone || !password || !location) {
        return res.status(400).json({ success: false, message: "Tüm alanlar gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const existingUser = await pool.request()
            .input("phone", sql.NVarChar, phone)
            .query("SELECT * FROM barber WHERE phone = @phone");

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "Bu telefon numarası zaten kayıtlı!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.request()
            .input("name", sql.NVarChar, name)
            .input("phone", sql.NVarChar, phone)
            .input("password", sql.NVarChar, hashedPassword)
            .input("location", sql.NVarChar, location)
            .query("INSERT INTO barber (name, phone, password, location) VALUES (@name, @phone, @password, @location)");

        res.json({ success: true, message: "Kuaför kaydı başarılı!" });
    } catch (err) {
        console.error("Kuaför kayıt hatası:", err.message || err);
        res.status(500).json({ success: false, message: "Kayıt sırasında hata oluştu!", error: err.message });
    }
});

app.post("/barber/login", async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ success: false, message: "Telefon numarası ve şifre gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("phone", sql.NVarChar, phone)
            .query("SELECT * FROM barber WHERE phone = @phone");

        if (result.recordset.length === 0) {
            return res.status(400).json({ success: false, message: "Kuaför bulunamadı!" });
        }

        const barber = result.recordset[0];
        const isMatch = await bcrypt.compare(password, barber.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Şifre yanlış!" });
        }

        res.json({ success: true, message: "Giriş başarılı!", barber: { id: barber.id, name: barber.name } });
    } catch (err) {
        console.error("Giriş hatası:", err);
        res.status(500).json({ success: false, message: "Giriş sırasında hata oluştu!" });
    }
});

app.get("/services", async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM services");
        res.json(result.recordset);
    } catch (err) {
        console.error("Hizmetleri getirirken hata oluştu:", err.message || err);
        res.status(500).json({ success: false, message: "Hizmetleri getirirken hata oluştu!", error: err.message });
    }
});

app.get('/barber/:id', async (req, res) => {
    const barberId = req.params.id;

    if (!barberId) {
        return res.status(400).json({ success: false, message: "Kuaför ID gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("barberId", sql.Int, barberId)
            .query("SELECT * FROM barber WHERE id = @barberId");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Kuaför bulunamadı!" });
        }

        res.json({ success: true, barber: result.recordset[0] });
    } catch (err) {
        console.error("Kuaför bilgilerini alırken hata oluştu:", err);
        res.status(500).json({ success: false, message: "Kuaför bilgilerini alırken hata oluştu!" });
    }
});

app.get("/barber/:id/services", async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("barberId", sql.Int, id)
            .query(`
                SELECT bs.id, s.name AS service_name, bs.price 
                FROM barber_services bs
                JOIN services s ON bs.service_id = s.id
                WHERE bs.barber_id = @barberId;
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Kuaför hizmetlerini alırken hata oluştu:", err);
        res.status(500).json({ success: false, message: "Kuaför hizmetlerini alırken hata oluştu!" });
    }
});

app.post("/barber_services", async (req, res) => {
    const { barber_id, service_id, price, service_name } = req.body;

    if (!barber_id || !service_id || !price || !service_name) {
        return res.status(400).json({ success: false, message: "Tüm alanlar gereklidir!" });
    }

    try {
        const pool = await connectDB();

        const existingService = await pool.request()
            .input("barberId", sql.Int, barber_id)
            .input("serviceId", sql.Int, service_id)
            .query("SELECT COUNT(*) AS count FROM barber_services WHERE barber_id = @barberId AND service_id = @serviceId");

        if (existingService.recordset[0].count > 0) {
            return res.status(400).json({ success: false, message: "Bu hizmet zaten eklenmiş!" });
        }

        await pool.request()
            .input("barberId", sql.Int, barber_id)
            .input("serviceId", sql.Int, service_id)
            .input("price", sql.Decimal(10, 2), price)
            .input("serviceName", sql.NVarChar(255), service_name)
            .query("INSERT INTO barber_services (barber_id, service_id, price, service_name) VALUES (@barberId, @serviceId, @price, @serviceName)");

        res.json({ success: true, message: "Hizmet başarıyla eklendi!" });

    } catch (err) {
        console.error("Hizmet eklerken hata oluştu:", err);
        res.status(500).json({ success: false, message: "Hizmet eklerken hata oluştu!", error: err.message });
    }
});

app.put("/barber_services/:id", async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    if (!price) {
        return res.status(400).json({ success: false, message: "Fiyat belirtilmelidir!" });
    }
    try {
        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, id)
            .input("price", sql.Decimal(10, 2), price)
            .query("UPDATE barber_services SET price = @price WHERE id = @id");
        res.json({ success: true, message: "Fiyat başarıyla güncellendi!" });
    } catch (err) {
        console.error("Fiyat güncelleme hatası:", err);
        res.status(500).json({ success: false, message: "Fiyat güncellenirken hata oluştu!" });
    }
});

app.delete("/barber_services/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM barber_services WHERE id = @id");
        res.json({ success: true, message: "Hizmet başarıyla silindi!" });
    } catch (err) {
        console.error("Hizmet silme hatası:", err);
        res.status(500).json({ success: false, message: "Hizmet silinirken hata oluştu!" });
    }
});


app.get('/appointments-page', async (req, res) => {
    try {
        const { phone } = req.query;  
        const pool = await connectDB();

        let query = "SELECT * FROM appointments";

        if (phone) {
            query += ` WHERE phone = '${phone}'`;  
        }

        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);  
    } catch (err) {
        console.error("Veri alınırken hata oluştu:", err.message);
        res.status(500).json({ message: "Veri alınırken bir hata oluştu.", error: err.message });
    }
});
app.delete('/appointments-page/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const pool = await connectDB();

        const query = `DELETE FROM appointments WHERE id = @id`;

        await pool.request()
            .input('id', sql.Int, id)  
            .query(query);

        res.status(200).json({ message: "Randevu başarıyla silindi." });
    } catch (err) {
        console.error("Randevu silinirken hata oluştu:", err.message);
        res.status(500).json({ message: "Randevu silinirken bir hata oluştu.", error: err.message });
    }
});


app.get("/barber/:id/appointments", async (req, res) => {
    const barberId = req.params.id;

    if (!barberId) {
        return res.status(400).json({ message: "Kuaför ID gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("barberId", sql.Int, barberId)
            .query(`
                SELECT a.name AS customer_name, a.phone AS customer_phone , a.date, CONVERT(VARCHAR(5), a.time, 108) AS time, a.services AS service_name
                FROM appointments a
                WHERE a.barber_id = @barberId
                ORDER BY a.date, a.time
            `);

        if (result.recordset.length > 0) {
            const formattedAppointments = result.recordset.map((appointment) => {
                const date = new Date(appointment.date);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

                const formattedTime = appointment.time;

                return {
                    customer_name: appointment.customer_name,
                    customer_phone: appointment.customer_phone,
                    date: formattedDate,
                    time: formattedTime,
                    service_name: appointment.service_name,
                };
            });

            res.json(formattedAppointments);
        } else {
            res.status(404).json({ message: "Bu kuaför için randevu bulunamadı!" });
        }
    } catch (err) {
        console.error("Veritabanı hatası:", err.stack);
        res.status(500).json({ message: "Veritabanı hatası", error: err.stack });
    }
});
app.post('/randevu-page', async (req, res) => {
    const { name, phone, barber_id, date, time, services } = req.body;

    console.log('Randevu Verisi:', req.body);

    if (!name || !phone || !barber_id || !date || !time || !services || services.length === 0) {
        return res.status(400).json({ message: "Tüm alanları doldurduğunuzdan emin olun." });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('barber_id', sql.Int, barber_id);
        request.input('date', sql.Date, date);
        request.input('time', sql.NVarChar, time);
        request.input('services', sql.NVarChar, services.join(", "));

        const checkQuery = `
            SELECT COUNT(*) AS count FROM appointments 
            WHERE barber_id = @barber_id AND date = @date AND time = @time
        `;

        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset[0].count > 0) {
            return res.status(400).json({ message: "Bu saat için zaten bir randevu var." });
        }

        request.input('name', sql.NVarChar, name);
        request.input('phone', sql.NVarChar, phone);

        const insertQuery = `
            INSERT INTO appointments (name, phone, barber_id, date, time, services)
            VALUES (@name, @phone, @barber_id, @date, @time, @services)  
        `;

        await request.query(insertQuery);
        res.status(201).json({ message: "Randevunuz başarıyla alındı!" });

    } catch (err) {
        console.error("Server Hatası: ", err);
        res.status(500).json({ message: "Randevu alınırken bir hata oluştu.", error: err.message });
    }
});

app.post("/barber/:id/working-hours", async (req, res) => {
    const barberId = req.params.id;
    const { day_of_week, startTime, endTime } = req.body;

    console.log("Gelen veri:", { barberId, day_of_week, startTime, endTime });

    if (!barberId || !day_of_week || !startTime || !endTime) {
        return res.status(400).json({ success: false, message: "Tüm alanlar gereklidir!" });
    }

    try {
        const pool = await connectDB();

        const startTimeFormatted = new Date(startTime);
        const endTimeFormatted = new Date(endTime);

        await pool.request()
            .input("barberId", sql.Int, barberId)
            .input("day_of_week", sql.NVarChar(50), day_of_week)
            .input("startTime", sql.DateTime, startTimeFormatted)
            .input("endTime", sql.DateTime, endTimeFormatted)
            .query(`
                INSERT INTO WorkingHours (barber_id, day_of_week, start_time, end_time)
                VALUES (@barberId, @day_of_week, @startTime, @endTime)
            `);

        res.json({ success: true, message: "Çalışma saati başarıyla kaydedildi!" });
    } catch (err) {
        console.error("Çalışma saati kaydetme hatası:", err);
        res.status(500).json({ success: false, message: "Çalışma saati kaydedilirken hata oluştu!" });
    }
});

app.get("/barber/:id/working-hours", async (req, res) => {
    const barberId = req.params.id;

    if (!barberId) {
        return res.status(400).json({ success: false, message: "Kuaför ID gereklidir!" });
    }

    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("barberId", sql.Int, barberId)
            .query(`
                SELECT * FROM WorkingHours 
                WHERE barber_id = @barberId
                ORDER BY id DESC;
            `);

        console.log("Veritabanından gelen çalışma saatleri:", result.recordset);

        if (result.recordset.length === 0) {
            return res.json({ success: true, workingHours: [] });
        }

        res.json({ success: true, workingHours: result.recordset });
    } catch (err) {
        console.error("Çalışma saatlerini getirirken hata oluştu:", err);
        res.status(500).json({ success: false, message: "Çalışma saatlerini getirirken hata oluştu!" });
    }
});

app.put("/barber/:id/working-hours", async (req, res) => {
    const barberId = req.params.id;
    const { day_of_week, startTime, endTime } = req.body;

    if (!barberId || !day_of_week || !startTime || !endTime) {
        return res.status(400).json({ success: false, message: "Tüm alanlar gereklidir!" });
    }

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("barberId", sql.Int, barberId)
            .input("day_of_week", sql.NVarChar(50), day_of_week)
            .query(`
                SELECT * FROM WorkingHours WHERE barber_id = @barberId AND day_of_week = @day_of_week
            `);

        if (result.recordset.length > 0) {
            await pool.request()
                .input("barberId", sql.Int, barberId)
                .input("day_of_week", sql.NVarChar(50), day_of_week)
                .input("startTime", sql.DateTime, startTime)
                .input("endTime", sql.DateTime, endTime)
                .query(`
                    UPDATE WorkingHours 
                    SET start_time = @startTime, end_time = @endTime
                    WHERE barber_id = @barberId AND day_of_week = @day_of_week
                `);
            res.json({ success: true, message: "Çalışma saati başarıyla güncellendi!" });
        } else {
            await pool.request()
                .input("barberId", sql.Int, barberId)
                .input("day_of_week", sql.NVarChar(50), day_of_week)
                .input("startTime", sql.DateTime, startTime)
                .input("endTime", sql.DateTime, endTime)
                .query(`
                    INSERT INTO WorkingHours (barber_id, day_of_week, start_time, end_time)
                    VALUES (@barberId, @day_of_week, @startTime, @endTime)
                `);
            res.json({ success: true, message: "Çalışma saati başarıyla kaydedildi!" });
        }

    } catch (err) {
        console.error("Çalışma saati güncellenirken hata oluştu:", err);
        res.status(500).json({ success: false, message: "Çalışma saati güncellenirken hata oluştu!" });
    }
});

app.delete("/barber/:id/working-hours", async (req, res) => {
    const barberId = req.params.id;
    const { day } = req.body;

    if (!barberId || !day) {
        return res.status(400).json({ success: false, message: "Kuaför ID ve gün bilgisi gereklidir!" });
    }

    try {
        const pool = await connectDB();
        await pool.request()
            .input("barberId", sql.Int, barberId)
            .input("day", sql.NVarChar(50), day)
            .query(`
                DELETE FROM WorkingHours
                WHERE barber_id = @barberId AND day = @day
            `);

        res.json({ success: true, message: "Çalışma saati başarıyla silindi!" });
    } catch (err) {
        console.error("Çalışma saati silme hatası:", err);
        res.status(500).json({ success: false, message: "Çalışma saati silinirken hata oluştu!" });
    }
});


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Kuaför API ${PORT} portunda çalışıyor...`);
});
