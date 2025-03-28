import React from 'react';
import '../App.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section links">
                    <h3>Hızlı Bağlantılar</h3>
                    <ul>
                        <li><a href="/">Ana Sayfa</a></li>
                        <li><a href="services-page">Hizmetler</a></li>
                        <li><a href="about-page">Hakkımızda</a></li>
                        <li><a href="/">İletişim</a></li>
                        <li><a href="/">Gizlilik Politikası</a></li>
                        <li><a href="/">Kullanım Şartları</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3>İletişim</h3>
                    <p>
                        Telefon: +90 555 555 55 55
                    </p>
                    <p>
                        E-posta: info@evdekuafor.com
                    </p>
                </div>

                <div className="footer-section social">
                    <h3>Bizi Takip Edin</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i> facebook.com/evdekuafor
                        </a>
                        <br></br>  <br></br>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i> instagram.com/evdekuafor
                        </a>
                        <br></br>  <br></br>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i> twitter.com/evdekuafor
                        </a>
                        <br></br>  <br></br>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i> linkedin.com/company/evdekuafor
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 Site Adı. Tüm Hakları Saklıdır.</p>
            </div>
        </footer>
    );
};

export default Footer;
