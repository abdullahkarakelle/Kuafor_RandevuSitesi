import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../App.css';

const Navbar = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (sectionId) => {
        if (location.pathname === "/") {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/");
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
            <ul className="navbar-text">
                <li><Link to="/">Anasayfa</Link></li>
                <li><button onClick={() => handleNavigation("services-section")}>Hizmetlerimiz</button></li>
                <li><button onClick={() => handleNavigation("about-section")}>Hakkımızda</button></li>
            </ul>

            <ul className="navbar-right">
                <li className="menu-item"
                    onMouseEnter={() => setIsLoginOpen(true)}
                    onMouseLeave={() => setIsLoginOpen(false)}>
                    <Link to="#">Giriş Yap</Link>
                    {isLoginOpen && (
                        <div className="dropdown">
                            <Link to="/customer-login-page">Müşteri Girişi</Link>
                            <Link to="/barber-login-page">Kuaför Girişi</Link>
                        </div>
                    )}
                </li>

                <li className="menu-item"
                    onMouseEnter={() => setIsSignupOpen(true)}
                    onMouseLeave={() => setIsSignupOpen(false)}>
                    <Link to="#">Üye Ol</Link>
                    {isSignupOpen && (
                        <div className="dropdown">
                            <Link to="/customer-signup-page">Müşteri Üyeliği</Link>
                            <Link to="/barber-signup-page">Kuaför Üyeliği</Link>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
