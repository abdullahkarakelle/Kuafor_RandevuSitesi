import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../css/BarberProfilePage.css";


const BarberProfilePage = () => {
    const { barberId } = useParams();
    const [barberInfo, setBarberInfo] = useState(null);
    const [services, setServices] = useState([]);
    const [barberServices, setBarberServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [price, setPrice] = useState("");
    const [prices, setPrices] = useState({});
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate("")

    const fetchBarberInfo = useCallback(async () => {
        if (!barberId) return;
        try {
            const response = await axios.get(`http://localhost:5002/barber/${barberId}`);
            setBarberInfo(response.data.barber);
        } catch (error) {
            console.error("Kuaför bilgileri alınırken hata oluştu:", error);
        }
    }, [barberId]);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:5002/services");
            setServices(response.data);
        } catch (error) {
            console.error("Hizmetler alınırken hata oluştu:", error);
        }
    };

    const fetchBarberServices = useCallback(async () => {
        if (!barberId) return;
        try {
            const response = await axios.get(`http://localhost:5002/barber/${barberId}/services`);
            setBarberServices(response.data);
        } catch (error) {
            console.error("Kuaför hizmetleri alınırken hata oluştu:", error);
        }
    }, [barberId]);

    const fetchAppointments = useCallback(async () => {
        if (!barberId) return;
        try {
            const response = await axios.get(`http://localhost:5002/barber/${barberId}/appointments`);
            console.log("Appointments response:", response.data);

            const formattedAppointments = response.data.map((appointment) => {
                const [day, month, year] = appointment.date.split('.');
                const time = appointment.time;

                const startDate = new Date(`${year}-${month}-${day}T${time}:00`);
                const endDate = new Date(startDate);
                endDate.setMinutes(startDate.getMinutes() + 60);

                return {
                    title: `${appointment.customer_phone} - ${appointment.customer_name} - ${appointment.service_name}  `,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    backgroundColor: "blue",
                    textColor: "white",
                };
            });

            setAppointments(formattedAppointments);
        } catch (error) {
            console.error("Randevular alınırken hata oluştu:", error);
        }
    }, [barberId]);

    useEffect(() => {
        fetchBarberInfo();
        fetchBarberServices();
        fetchAppointments();
    }, [fetchBarberInfo, fetchBarberServices, fetchAppointments]);

    useEffect(() => {
        fetchServices();
    }, []);


    const addService = async () => {
        if (!selectedService || price <= 0) {
            alert("Lütfen geçerli bir hizmet ve fiyat girin");
            return;
        }

        const selectedServiceName = services.find(service => service.id === parseInt(selectedService))?.name;
        if (!selectedServiceName) {
            alert("Seçilen hizmet adı bulunamadı!");
            return;
        }

        const isAlreadyAdded = barberServices.some(bs => bs.service_id === parseInt(selectedService));
        if (isAlreadyAdded) {
            alert("Bu hizmet zaten eklenmiş!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5002/barber_services", {
                barber_id: barberId,
                service_id: selectedService,
                service_name: selectedServiceName,
                price: price,
            });

            if (!response.data.success) {
                alert(response.data.message);
                return;
            }

            alert("Hizmet eklendi!");
            setSelectedService("");
            setPrice("");
            fetchBarberServices();
        } catch (error) {
            console.error("Hizmet eklenirken hata oluştu:", error);
            alert("Hizmet zaten ekli!");
        }
    };

    const updateServicePrice = async (serviceId) => {
        if (!prices[serviceId] || prices[serviceId] <= 0) {
            alert("Geçerli bir yeni fiyat girin");
            return;
        }

        try {
            await axios.put(`http://localhost:5002/barber_services/${serviceId}`, { price: prices[serviceId] });
            alert("Fiyat güncellendi!");
            setPrices({ ...prices, [serviceId]: "" });
            fetchBarberServices();
        } catch (error) {
            console.error("Fiyat güncellenirken hata oluştu:", error);
        }
    };

    const deleteService = async (serviceId) => {
        try {
            await axios.delete(`http://localhost:5002/barber_services/${serviceId}`);
            alert("Hizmet silindi!");
            fetchBarberServices();
        } catch (error) {
            console.error("Hizmet silinirken hata oluştu:", error);
        }
    };


    return (
        <div className="profile-container">
            {barberInfo && (
                <div className="barber-info">
                    <div className="barber-details">
                        <h2>{barberInfo.name}</h2>
                        <p><strong>Telefon:</strong> {barberInfo.phone}</p>
                        <p><strong>Adres:</strong> {barberInfo.location}</p>
                    </div>
                </div>
            )}
            <button onClick={() => navigate(`/barber/${barberId}/working-hours`)}>
                Çalışma Saatlerini Ayarla
            </button>

            <h3>Mevcut Hizmetler</h3>
            <table className="service-table">
                <thead>
                    <tr>
                        <th>Hizmet Adı</th>
                        <th>Fiyat (₺)</th>
                        <th>Yeni Fiyat</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {barberServices.map((bs) => (
                        <tr key={bs.id}>
                            <td>{bs.service_name}</td>
                            <td>{bs.price}₺</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Yeni fiyat"
                                    value={prices[bs.id] || ""}
                                    onChange={(e) => setPrices({ ...prices, [bs.id]: e.target.value })}
                                />
                            </td>
                            <td>
                                <button className="update-btn" onClick={() => updateServicePrice(bs.id)}>Güncelle</button>
                                <button className="delete-btn" onClick={() => deleteService(bs.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Yeni Hizmet Ekle</h3>
            <div className="add-service">
                <select onChange={(e) => setSelectedService(e.target.value)} value={selectedService}>
                    <option value="">Hizmet Seç</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} />
                <button className="add-btn" onClick={addService}>Ekle</button>
            </div>

            <h3>Randevu Takvimi</h3>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                events={appointments}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay",
                }}
                height="auto"
                slotMinTime="09:00:00"
                slotMaxTime="24:00:00"
            />

        </div>
    );
};

export default BarberProfilePage;
