import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../css/randevu.css';

const RandevuPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const barberId = location.state?.barberId || null;
    const barberName = location.state?.barberName || "Bilinmeyen Kuaför";

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [workingHours, setWorkingHours] = useState({});
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    setName(user.name);
                    setPhone(user.phone);
                }
            } catch (err) {
                console.error('Kullanıcı bilgileri alınırken hata oluştu:', err.message);
            }
        };

        const fetchServices = async () => {
            if (!barberId) return;
            try {
                const response = await axios.get(`http://localhost:5002/barber/${barberId}/services`);
                setServices(response.data);
            } catch (err) {
                console.error('Hizmetler alınırken hata oluştu:', err.message);
            }
        };

        const fetchAppointments = async () => {
            if (!barberId) return;
            try {
                const response = await axios.get(`http://localhost:5002/barber/${barberId}/appointments`);
                const formattedAppointments = response.data.map(appointment => {
                    const [day, month, year] = appointment.date.split('.');
                    const startDate = new Date(`${year}-${month}-${day}T${appointment.time}:00`);
                    const endDate = new Date(startDate);
                    endDate.setMinutes(startDate.getMinutes() + 60);

                    return {
                        title: "Dolu",
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        backgroundColor: "red",
                        textColor: "white",
                    };
                });
                setAppointments(formattedAppointments);
            } catch (error) {
                console.error("Randevular alınırken hata oluştu:", error);
            }
        };

        const fetchWorkingHours = async () => {
            if (!barberId) return;
            try {
                const response = await axios.get(`http://localhost:5002/barber/${barberId}/working-hours`);
                setWorkingHours(response.data.workingHours);
            } catch (err) {
                console.error('Çalışma saatleri alınırken hata oluştu:', err.message);
            }
        };

        fetchUserData();
        fetchServices();
        fetchAppointments();
        fetchWorkingHours();
    }, [barberId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!barberId || selectedServices.length === 0 || selectedServices.includes("")) {
            alert("Lütfen bir hizmet seçin!");
            return;
        }

        const randevuData = {
            name,
            phone,
            barber_id: barberId,
            date,
            time,
            services: selectedServices
        };

        try {
            const response = await axios.post('http://localhost:5002/randevu-page', randevuData);
            if (response && response.data) {
                alert('Randevunuz başarıyla alındı.');
                setTimeout(() => navigate('/barbers-page'), 2000);
            } else {
                alert('Randevu alırken bir hata oluştu.');
            }
        } catch (err) {
            console.error("Randevu alınırken hata oluştu:", err.response?.data || err.message);
            alert('Randevu saati dolu veya hata oluştu.');
        }
    };

    if (!barberId) {
        return <div className="loading">Kuaför bilgileri yükleniyor...</div>;
    }

    const today = new Date().toISOString().split("T")[0];

    const getDayName = (date) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = new Date(date).getDay();
        return days[dayIndex];
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        const dayName = getDayName(selectedDate);

        const workingHoursForDay = workingHours.find(hour => hour.day_of_week === dayName);
        if (workingHoursForDay) {
            setAvailableTimes(generateAvailableTimes(workingHoursForDay));
        } else {
            setAvailableTimes([]);
        }
    };

    const generateAvailableTimes = (workingHours) => {
        let times = [];
        const startTime = new Date(workingHours.start_time);
        const endTime = new Date(workingHours.end_time);

        while (startTime < endTime) {
            times.push(startTime.toISOString().slice(11, 16));
            startTime.setMinutes(startTime.getMinutes() + 60);
        }

        return times;
    };

    const handleServiceChange = (e) => {
        const value = e.target.value;
        if (value !== "") {
            setSelectedServices((prevSelectedServices) => {
                if (prevSelectedServices.includes(value)) {
                    return prevSelectedServices.filter(service => service !== value);
                }
                return [...prevSelectedServices, value];
            });
        }
    };

    const handleRemoveService = (service) => {
        setSelectedServices(selectedServices.filter(s => s !== service));
    };
    const goBack = () => {
        navigate(`/barbers-page`);
    };

    return (
        <div>                        <button className="back-button" onClick={goBack}>Geri Dön</button>

            <div className="randevu-page-container">

                <div className="calendar-container">
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
                        slotLabelFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                        editable={false}
                        selectable={true}
                    />
                </div>

                <div className="form-container">
                    <h1>{barberName} için Randevu Al</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Ad Soyad:</label>
                        <input type="text" value={name} readOnly />

                        <label>Telefon:</label>
                        <input type="text" value={phone} readOnly />

                        <label>Hizmetler:</label>
                        <select multiple value={selectedServices} onChange={handleServiceChange}>
                            {services.map((service) => (
                                <option key={service.id} value={service.service_name}>
                                    {service.service_name} - {service.price}&#8378;
                                </option>
                            ))}
                        </select>

                        <div className="selected-services">
                            {selectedServices.map(service => (
                                <div key={service} className="selected-service">
                                    {service}
                                    <button type="button" onClick={() => handleRemoveService(service)}>X</button>
                                </div>
                            ))}
                        </div>

                        <label>Tarih:</label>
                        <input
                            type="date"
                            value={date}
                            min={today}
                            onChange={handleDateChange}
                        />

                        <label>Saat:</label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            disabled={!availableTimes.length}
                        >
                            <option value="">Saat seçin</option>
                            {availableTimes.map((availableTime, index) => (
                                <option key={index} value={availableTime}>
                                    {availableTime}
                                </option>
                            ))}
                        </select>

                        <button type="submit">Randevu Al</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RandevuPage;
