import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CustomerLoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.length !== 11) {
            alert("Telefon numarası 11 basamaklı olmalıdır.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5001/customer/login", {
                phone,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));  

                navigate("/barbers-page");
            } else {
                setErrorMessage("Telefon numarası veya şifre yanlış.");
            }
        } catch (err) {
            setErrorMessage("Bir hata oluştu, lütfen tekrar deneyin.");
            console.error("Error during login:", err);
        } finally {
            setLoading(false);
        }
    };


    const handlePhoneChange = (e) => {
        const value = e.target.value;

        if (value.length <= 11 && /^[0-9]*$/.test(value)) {
            setPhone(value);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Müşteri Girişi</h2>
                <form onSubmit={handleSubmit}>
                    <label>Telefon No:</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                    />
                    <label>Şifre:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Üye Değilseniz? <a href="/customer-signup-page" style={{ color: '#3498db' }}>Buraya tıklayarak üye olabilirsiniz.</a>
                </p>
            </div>
        </div>
    );
};

export default CustomerLoginPage;
