import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import '../css/homepage.css';
import AboutPage from './AboutPage';
import ServicesPage from './ServicesPage';
import musteri1 from '../assets/res1.jpg';
import musteri2 from '../assets/res2.jpg';
import musteri3 from '../assets/res3.jpg';

const HomePage = () => {     
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    

    return (
        <div className="home-page">
            <section className="hero-section">
                <h1>Evde Kuaför Hizmetleri</h1>
                <p>Profesyonel kuaförler, evinizin konforunda.</p>
                <Link to="/customer-login-page" className="cta-button">Hemen Randevu Al</Link>
            </section>
        

            <section id="services-section" className="dynamic-section">
                <ServicesPage />
            </section>

            <section id="about-section" className="dynamic-section">
                <AboutPage />
            </section>

            <section className="testimonials">
                <h2>Müşteri Yorumları</h2>
                <div className="testimonial-wrapper">
                    <div className="testimonial-cards">
                        <div className="testimonial-card">
                        <img src={musteri1} alt="Müşteri 1" className="testimonial-image" />
                        <p>"Evde kuaför hizmeti almak, yoğun iş tempomda hayatımı inanılmaz kolaylaştırdı. Kuaför, tam zamanında geldi ve saç kesimim mükemmel oldu. Profesyonel bir hizmet arıyorsanız kesinlikle tavsiye ederim!"</p>
                            <h4>- Kadir Alkan</h4>
                        </div>
                        <div className="testimonial-card">
                        <img src={musteri2} alt="Müşteri 2" className="testimonial-image" />
                        <p>"Evde kuaför hizmeti almak benim için büyük bir rahatlık oldu. Kuaförün hijyen kurallarına dikkat etmesi ve güler yüzlü olması gerçekten çok hoşuma gitti. Saç kesimi ve bakımı mükemmeldi!"</p>
                            <h4>- Mehmet Kaya</h4>
                        </div>
                        <div className="testimonial-card">
                        <img src={musteri3} alt="Müşteri 3" className="testimonial-image" />
                        <p>"Evde saç bakımı hiç bu kadar konforlu olmamıştı! Kuaförün profesyonelliği ve kullandığı kaliteli ürünler sayesinde saçlarım canlandı. Uzun zamandır böyle memnun kalmamıştım. Teşekkürler!"</p>
                            <h4>- Ali Çetin</h4>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq">
                <h2 className="faq-h2">Sıkça Sorulan Sorular</h2>
                {["Saç boyama hizmeti ne kadar sürer?", "Evde hizmet alırken nelere dikkat etmeliyim?", "Hizmetiniz hangi şehirlerde mevcut?", "Saç kesimi için nasıl bir hazırlık yapmalıyım?"].map((question, index) => (
                    <div className="faq-item" key={index}>
                        <div className="question" onClick={() => toggleAnswer(index)}>
                            <span>{activeIndex === index ? '-' : '+'} </span>{question}
                        </div>
                        {activeIndex === index && (
                            <div className="answer">
                                <p> {
                                    index === 0 ? 'Saç boyama işlemi genellikle 1-2 saat sürer, ancak kullanılan tekniklere göre değişiklik gösterebilir.' :
                                    index === 1 ? 'Evde hizmet alırken rahat bir ortam sağlamak, kuaförün ihtiyaç duyacağı alanı hazırlamak önemlidir.' :
                                    index === 2 ? 'Evde kuaför hizmetimiz İstanbul, Ankara ve İzmir gibi büyük şehirlerde mevcuttur.' :
                                    'Saç kesimi öncesinde saçınızı temiz tutmanız ve rahat bir ortam sağlamanız yeterlidir.'
                                }</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default HomePage;