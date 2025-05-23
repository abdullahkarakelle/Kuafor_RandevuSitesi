import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/barber.css';

const BarbersPage = () => {
    const [barbers, setBarbers] = useState([]);
    const [filteredBarbers, setFilteredBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [servicesError, setServicesError] = useState(null);
    const [nameFilter, setNameFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    
        const fetchBarbers = async () => {
            try {
                const response = await axios.get('http://localhost:5002/barber');
                console.log("API'den gelen kuaför verisi:", response.data);
                setBarbers(response.data);
                setFilteredBarbers(response.data);
            } catch (err) {
                console.error("Kuaförler yüklenirken hata oluştu:", err);
                setError('Kuaförler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchBarbers();
    }, []); 

    const fetchServices = async (barberId) => {
        if (services.length > 0 && selectedBarber && selectedBarber.id === barberId) {
            return;  
        }
        
        setLoadingServices(true);
        setServicesError(null);
        try {
            const response = await axios.get(`http://localhost:5002/barber/${barberId}/services`);
            setServices(response.data);
        } catch (err) {
            console.error("Hizmetler yüklenirken hata oluştu:", err);
            setServicesError('Hizmet bilgileri alınamadı.');
        } finally {
            setLoadingServices(false);
        }
    };

    const handleBarberClick = (barber) => {
        setSelectedBarber(barber);
        fetchServices(barber.id);
    };

    const handleRandevuClick = (barber) => {
        navigate('/randevu-page', { state: { barberId: barber.id, barberName: barber.name } });
    };

    const handleNameFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setNameFilter(value);
        applyFilters(value, locationFilter);
    };

    const handleLocationFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setLocationFilter(value);
        applyFilters(nameFilter, value);
    };

    const applyFilters = (name, location) => {
        const filtered = barbers.filter((barber) =>
            barber.name.toLowerCase().includes(name) &&
            (barber.location?.toLowerCase().includes(location) || false)
        );
        setFilteredBarbers(filtered);
    };

    const handleAppointmentsClick = () => {
        navigate('/appointments-page');
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="barbers-container">
            <h1>Kuaförler</h1>
            {user && (
                <>
                    <h2 style={{ position: "absolute", top: 100, left: 10 }}>Hoşgeldin, {user.name}!</h2>
                    <button onClick={handleAppointmentsClick} className="appointment-button">Randevularımı Gör</button>
                </>
            )}

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="İsme göre filtrele"
                    value={nameFilter}
                    onChange={handleNameFilterChange}
                />
                <input
                    type="text"
                    placeholder="Konuma göre filtrele"
                    value={locationFilter}
                    onChange={handleLocationFilterChange}
                />
            </div>

            <table className="barbers-table">
                <thead>
                    <tr>
                        <th>İsim</th>
                        <th>Semt</th>
                        <th>Detay</th>
                        <th>Randevu Al</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBarbers.length === 0 ? (
                        <tr>
                            <td colSpan="4">Hiç kuaför bulunamadı.</td>
                        </tr>
                    ) : (
                        filteredBarbers.map((barber, index) => (
                            <tr key={barber.id || index}>
                                <td>{barber.name}</td>
                                <td>{barber.location || "Belirtilmemiş"}</td>
                                <td>
                                    <button onClick={() => handleBarberClick(barber)}>Detay</button>
                                </td>
                                <td>
                                    <button onClick={() => handleRandevuClick(barber)}>Randevu Al</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedBarber && (
                <div className="barber-card">
                    <h3>{selectedBarber.name}</h3>
                    <p><strong>Semt:</strong> {selectedBarber.location || "Belirtilmemiş"}</p>
                    <h4>Hizmetler:</h4>
                    {loadingServices ? (
                        <p>Hizmetler yükleniyor...</p>
                    ) : servicesError ? (
                        <p>{servicesError}</p>
                    ) : services.length > 0 ? (
                        <ul>
                            {services.map(service => (
                                <li key={service.id}>
                                    {service.service_name} : <span>{service.price} TL</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Hizmet bilgisi bulunmamaktadır.</p>
                    )}
                    <button onClick={() => setSelectedBarber(null)}>Kapat</button>
                </div>
            )}
        </div>
    );
};

export default BarbersPage;
