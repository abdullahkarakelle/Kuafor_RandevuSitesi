import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import BarberSignupPage from "./pages/BarberSignupPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";
import BarberLoginPage from "./pages/BarberLoginPage";
import BarbersPage from "./pages/BarbersPage";
import BarberProfilePage from "./pages/BarberProfilePage";
import RandevuPage from "./pages/RandevuPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BarberWorkingHours from "./components/BarberWorkingHours";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-page" element={<AboutPage />} />
        <Route path="/barbers-page" element={<BarbersPage />} />
        <Route path="/services-page" element={<ServicesPage />} />
        <Route path="/randevu-page" element={<RandevuPage />} />
        <Route path="/customer-login-page" element={<CustomerLoginPage />} />
        <Route path="/customer-signup-page" element={<CustomerSignupPage />} />
        <Route path="/barber-login-page" element={<BarberLoginPage />} />
        <Route path="/barber-signup-page" element={<BarberSignupPage />} />
        <Route path="/barber/:barberId" element={<BarberProfilePage />} />
        <Route path="/barber/:barberId/working-hours" element={<BarberWorkingHours />} />
        <Route path="/appointments-page" element={<AppointmentsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
