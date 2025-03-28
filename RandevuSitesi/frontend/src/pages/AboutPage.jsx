import React, { useState } from 'react';
import "../css/about.css";

const AboutPage = () => {
    const [hovered, setHovered] = useState(true);

    return (
        <div className="about-section">
            <div
                className={`section ${hovered ? 'active' : ''}`}
                onMouseEnter={() => setHovered(false)}
                onMouseLeave={() => setHovered(true)}
            >
                <div className="text-container">
                    <div className="left-text">
                        <h2>Hedeflerimiz</h2>
                        <p>
                        Kuaförüm Eve Gelsin olarak, erkekler için kuaför hizmetlerini daha erişilebilir, konforlu ve hızlı hale getirmeyi amaçlıyoruz. Günümüzün yoğun temposunda zaman yönetimi büyük bir önem taşıyor. Bu nedenle, müşterilerimizin berbere gitmek için zaman kaybetmeden, diledikleri yerde profesyonel saç kesimi ve sakal tıraşı hizmeti alabilmelerini sağlamak öncelikli hedefimizdir.

Aynı zamanda, kuaförler için esnek ve kazançlı bir çalışma modeli sunmayı amaçlıyoruz. Kuaförlerin kendi çalışma saatlerini belirleyerek, müşteri taleplerine göre hizmet verebilmesi, işlerini daha verimli hale getirmelerine yardımcı olur. Böylece hem müşteriler hem de kuaförler için kazançlı ve memnuniyet odaklı bir sistem oluşturuyoruz.

Hizmet kalitemizi en üst seviyeye çıkarmak için güvenilirlik ve müşteri memnuniyeti odaklı bir yapı kuruyoruz. Kullanıcı yorumları, puanlama sistemleri ve profesyonel kuaför seçim kriterleri ile kaliteli hizmet sunulmasını sağlıyoruz.

Gelecekte, hizmet ağımızı genişleterek daha fazla şehirde faaliyet göstermeyi, teknolojik altyapımızı geliştirerek kullanıcı deneyimini en üst seviyeye çıkarmayı hedefliyoruz. Kuaförüm Eve Gelsin olarak, erkek bakımına yeni bir boyut kazandırarak, zamandan tasarruf etmenizi ve konforlu bir deneyim yaşamanızı sağlamak için çalışıyoruz.                        </p>
                    </div>
                    <div className="right-text">
                        <h2>Hakkımızda</h2>
                        <p>
                        Kuaförüm Eve Gelsin, erkekler için profesyonel kuaför hizmetlerini ev veya iş yerinde almayı mümkün kılan yenilikçi bir platformdur. Günümüzün yoğun temposunda berbere gitmek için zaman bulmak zor olabilir. Biz de bu sorunu çözerek, saç kesimi ve sakal tıraşı gibi kişisel bakım hizmetlerini müşterilerimizin diledikleri yere getirmeyi amaçlıyoruz.

Platformumuz, alanında uzman kuaförleri müşterilerle buluşturarak hızlı, güvenilir ve kaliteli hizmet sunmayı hedefler. Kullanıcılar, sistemimiz üzerinden randevu alarak istedikleri gün ve saat için profesyonel kuaförlerden hizmet talep edebilir. Aynı zamanda kuaförler de kendi çalışma saatlerini belirleyerek daha esnek bir şekilde hizmet sunabilirler.

Güvenlik ve kalite bizim için en önemli unsurlar arasında yer alır. Bu nedenle, müşteri yorumları ve değerlendirme sistemleri sayesinde kullanıcılar, en iyi hizmeti sunan kuaförleri kolayca seçebilir. Ayrıca, tüm kuaförlerimiz belirli standartlara uygun olarak seçilir ve doğrulama süreçlerinden geçer.

Gelecekte hizmet ağımızı genişleterek daha fazla şehirde faaliyet göstermeyi ve teknolojik altyapımızı sürekli geliştirerek kullanıcı deneyimini iyileştirmeyi amaçlıyoruz. Kuaförüm Eve Gelsin, erkek bakımına yeni bir boyut kazandırarak, müşterilerine zamandan tasarruf ettiren, güvenilir ve kaliteli bir hizmet sunmaya devam edecektir.                        </p>
                    </div>
                </div>
                <div className={`image ${hovered ? 'slide' : ''}`} />
            </div>
        </div>
    );
};

export default AboutPage;
