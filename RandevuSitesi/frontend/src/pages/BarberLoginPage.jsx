import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

const BarberLoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.length !== 11) {
            alert("Telefon numarası 11 basamaklı olmalıdır.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5002/barber/login", { phone, password });
            console.log("Gelen response:", response.data);

            if (response.data.success) {
                const barberId = response.data.barber?.id; 
                console.log("Barber ID:", barberId); 

                if (!barberId) {
                    alert("Kuaför kimliği alınamadı!");
                    return;
                }

                localStorage.setItem("barberId", barberId);
                navigate(`/barber/${barberId}`);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
            console.error("Giriş hatası:", error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Kuaför Girişi</h2>
                <form onSubmit={handleSubmit}>
                    <label>Telefon No:</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        maxLength={11}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <label>Şifre:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Giriş Yap</button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Kuaför Değilseniz? <a href="/barber-signup-page" style={{ color: '#3498db' }}>Buraya tıklayarak üye olabilirsiniz.</a>
                </p>
            </div>
        </div>
    );
};

export default BarberLoginPage;
