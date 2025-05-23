import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/BarberWorkingHours.css'; 

const BarberWorkingHours = () => {
    const { barberId } = useParams();
    const navigate = useNavigate(); 
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [workingHours, setWorkingHours] = useState({});

    const minTime = "08:00";
    const maxTime = "23:00";

    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/barber/${barberId}/working-hours`);
                if (response.data.success) {
                    const fetchedHours = response.data.workingHours.reduce((acc, hour) => {
                        const startTime = new Date(hour.start_time);
                        const endTime = new Date(hour.end_time);
                        if (startTime.getFullYear() > 1970) {
                            acc[hour.day_of_week] = {
                                start: startTime.toISOString().substring(11, 16),
                                end: endTime.toISOString().substring(11, 16),
                            };
                        }
                        return acc;
                    }, {});

                    setWorkingHours(fetchedHours);
                } else {
                    console.error("Çalışma saatleri alınırken hata oluştu.");
                }
            } catch (error) {
                console.error("Çalışma saatleri alınırken hata oluştu:", error);
            }
        };

        fetchWorkingHours();
    }, [barberId]);

    const handleChange = (day, type, value) => {
        const newWorkingHours = { ...workingHours, [day]: { ...workingHours[day], [type]: value } };

        const startTime = newWorkingHours[day]?.start;
        const endTime = newWorkingHours[day]?.end;

        if (startTime && (startTime < minTime || startTime > maxTime)) {
            alert("Başlangıç saati 08:00 ile 23:00 arasında olmalıdır.");
            return;
        }

        if (endTime && (endTime < minTime || endTime > maxTime)) {
            alert("Bitiş saati 08:00 ile 23:00 arasında olmalıdır.");
            return;
        }

        if (startTime && endTime && startTime >= endTime) {
            alert("Bitiş saati başlangıç saatinden önce olamaz.");
            return; 
        }

        setWorkingHours(newWorkingHours);
    };

    const saveWorkingHours = async () => {
        try {
            for (const day of daysOfWeek) {
                const startTime = workingHours[day]?.start ? `${workingHours[day].start}:00` : "08:00:00";
                const endTime = workingHours[day]?.end ? `${workingHours[day].end}:00` : "18:00:00";
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const dayOfMonth = String(today.getDate()).padStart(2, '0');
                const startDate = new Date(`${year}-${month}-${dayOfMonth}T${startTime}Z`);
                const endDate = new Date(`${year}-${month}-${dayOfMonth}T${endTime}Z`);

                const data = {
                    day_of_week: day,
                    startTime: startDate.toISOString(),
                    endTime: endDate.toISOString(),
                };

                const response = await axios.put(`http://localhost:5002/barber/${barberId}/working-hours`, data);
                if (!response.data.success) {
                    throw new Error(response.data.message);
                }
            }
            alert("Çalışma saatleri başarıyla kaydedildi!");
        } catch (error) {
            console.error("Çalışma saatleri güncellenirken hata oluştu:", error.message || error);
            alert(error.message || "Bir hata oluştu!");
        }
    };

    const goBack = () => {
        navigate(`/barber/${barberId}`); 
    };

    return (
        <div className="container">
            <h3>Çalışma Saatlerini Ayarla</h3>
            <table>
                <thead>
                    <tr>
                        <th>Gün</th>
                        <th>Başlangıç</th>
                        <th>Bitiş</th>
                    </tr>
                </thead>
                <tbody>
                    {daysOfWeek.map((day) => (
                        <tr key={day}>
                            <td>{day}</td>
                            <td>
                                <select
                                    value={workingHours[day]?.start || "08:00"}
                                    onChange={(e) => handleChange(day, "start", e.target.value)}
                                >
                                    {Array.from({ length: 16 }, (_, i) => {
                                        const time = (i + 8 < 10 ? "0" : "") + (i + 8) + ":00"; 
                                        return <option key={time} value={time}>{time}</option>;
                                    })}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={workingHours[day]?.end || "18:00"}
                                    onChange={(e) => handleChange(day, "end", e.target.value)}
                                >
                                    {Array.from({ length: 16 }, (_, i) => {
                                        const time = (i + 8 < 10 ? "0" : "") + (i + 8) + ":00"; 
                                        return <option key={time} value={time}>{time}</option>;
                                    })}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={saveWorkingHours}>Kaydet</button>
            <button className="back-button" onClick={goBack}>Geri Dön</button>
        </div>
    );
};

export default BarberWorkingHours;
