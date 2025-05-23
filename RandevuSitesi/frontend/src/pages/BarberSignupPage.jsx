import React, { useState } from "react";
import "../css/signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BarberSignupPage = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(alert("Kayıt başarılı! Giriş yapabilirsiniz."));
        navigate("/barber-login-page");

        if (phone.length !== 11) {
            setError("Telefon numarası 11 basamaklı olmalıdır.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5002/barber/signup", {
                name: name,
                phone: phone,
                password: password,
                location: location
            });

            if (response.data.success) {
                setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
                setName("");
                setPhone("");
                setPassword("");
                setLocation("");
                setConfirmPassword("");
            } else {
                setError(response.data.message || "Kayıt başarısız!");
            }
        } catch (error) {
            console.error("Kayıt sırasında hata oluştu:", error);
            setError("Sunucu hatası! Lütfen tekrar deneyin.");
        }

        setLoading(false);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.length <= 11 && /^[0-9]*$/.test(value)) {
            setPhone(value);
        }
    };

    return (
        <div className="signup-container">
            <section className="signup-form">
                <h2 className="form-title">Kuaför Üyelik</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleSubmit} className="form">
                    <label className="form-label">İsim:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />

                    <label className="form-label">Telefon No:</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        className="form-input"
                    />

                    <label className="form-label">Semt:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="form-input"
                    />

                    <label className="form-label">Şifre:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />

                    <label className="form-label">Şifreyi Tekrar Girin:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-input"
                    />

                    <button type="submit" className="form-button" disabled={loading}>
                        {loading ? "Kayıt Yapılıyor..." : "Kaydol"}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default BarberSignupPage;
