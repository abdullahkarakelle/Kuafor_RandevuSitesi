import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/appointments.css';
import { useNavigate } from 'react-router-dom';


const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const navigate  = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []); 

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user || !user.phone) return;

            try {
                const response = await axios.get(`http://localhost:5002/appointments-page?phone=${user.phone}`);
                let appointmentsData = response.data;

                appointmentsData = appointmentsData.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Geçmiş randevuları pasif yap
                const currentDate = new Date();
                appointmentsData = appointmentsData.map(appointment => ({
                    ...appointment,
                    isPast: new Date(appointment.date) < currentDate // Geçmişteki randevular için 'isPast' true olacak
                }));

                setAppointments(appointmentsData);
            } catch (err) {
                alert('Randevular alınırken bir hata oluştu.');
                console.error("Veri alınırken hata oluştu:", err);
            }
        };

        // User yüklendikten sonra randevular yükleniyor
        if (user) {
            fetchAppointments();
        }
    }, [user]); // Sadece user state değiştiğinde çalışacak.

    const handleDeleteAppointment = (appointmentId) => {
        // Tarihi gelmemiş randevuyu silme işlemi
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));

        axios.delete(`http://localhost:5002/appointments-page/${appointmentId}`)
        .then(() => {
            alert('Randevu başarıyla silindi.');
        })
        .catch((err) => {
            alert('Randevu silinirken hata oluştu.');
            console.error("Randevu silme hatası:", err);
        });
    }    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const goBack = () => {
        navigate(`/barbers-page`); 
    };

    return (
        <div>
            <button className="back-button" onClick={goBack}>Geri Dön</button>
            <h1>Randevular</h1>
            <table>
                <thead>
                    <tr>
                        <th>İsim</th>
                        <th>Telefon</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Hizmet</th>
                        <th>Sil</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} style={{ opacity: appointment.isPast ? 0.5 : 1 }}>
                            <td>{appointment.name}</td>
                            <td>{appointment.phone}</td>
                            <td>{formatDate(appointment.date)}</td>
                            <td>{formatTime(appointment.time)}</td>
                            <td>
                                {Array.isArray(appointment.services)
                                    ? appointment.services.join(", ")
                                    : (appointment.services ? appointment.services : "Hizmet bilgisi yok")}
                            </td>
                            <td>
                                {/* Tarihi gelmemiş randevular için silme butonu */}
                                {!appointment.isPast && (
                                    <button onClick={() => handleDeleteAppointment(appointment.id)}>
                                        Sil
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsPage;
