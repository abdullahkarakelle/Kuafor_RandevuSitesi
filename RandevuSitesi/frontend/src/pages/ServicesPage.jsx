import React from "react";
import "../css/services.css";
import sacBakim from "../assets/sacbakim.jpg";
import sacKesim from "../assets/sackesim.jpg";
import sakalBakim from "../assets/sakalbakim.jpg";
import sakalBoyama from "../assets/sakalboyama.jpg";
import sakalKesim from "../assets/sakalkesim.jpg";
import yuzBakim from "../assets/ciltbakim.jpg";
import ciltBakim from "../assets/yuzbakim.jpg";
import sacBoyama from "../assets/sacboyama.jpg";
import perma from "../assets/perma.jpg";

const services = [
    { id: 1, name: "Saç Bakımı", image: sacBakim, description: "Saç sağlığınızı artıran profesyonel bakım hizmetleri." },
    { id: 2, name: "Saç Kesimi", image: sacKesim, description: "Modern saç kesimleri, istediğiniz tarzda." },
    { id: 3, name: "Sakal Bakımı", image: sakalBakim, description: "Bakımlı ve sağlıklı sakallar için özel bakım." },
    { id: 4, name: "Sakal Kesimi", image: sakalKesim, description: "Şekillendirme ve kesim hizmetleri." },
    { id: 5, name: "Yüz Bakımı", image: yuzBakim, description: "Cildiniz için en iyi yüz bakımı hizmetleri." },
    { id: 6, name: "Cilt Bakımı", image: ciltBakim, description: "Cildinizi canlandıran profesyonel cilt bakım hizmetleri." },
    { id: 7, name: "Saç Boyama", image: sacBoyama, description: "Göz alıcı renk seçenekleri ile saç boyama." },
    { id: 8, name: "Perma", image: perma, description: "Doğal ve hacimli dalgalar için perma hizmetleri." },
    { id: 9, name: "Sakal Boyama", image: sakalBoyama, description: "Göz alıcı renk seçenekleri ile sakal boyama." },

];

const ServicesPage = () => {
    return (
        <div className="services-page">
            <h1>Hizmetlerimiz</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div key={service.id} className="service-card">
                        <img src={service.image} alt={service.name} />
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ServicesPage;
