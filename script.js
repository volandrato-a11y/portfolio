let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await initSite();
});

async function initSite() {
    const resConfig = await fetch('config.json');
    siteConfig = await resConfig.json();

    // Appliquer le Thème & Fond
    document.documentElement.style.setProperty('--primary', siteConfig.theme.primary);
    if (siteConfig.theme.site_bg) document.body.style.backgroundImage = `url('${siteConfig.theme.site_bg}')`;

    // Header
    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;

    // Footer & Stat
    document.getElementById('footer-info').innerHTML = `
        <p><b>${siteConfig.header.nom}</b> - ${siteConfig.footer.adresse}</p>
        <p>NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        <p>Tél: ${siteConfig.footer.telephone}</p>
    `;

    // Réseaux Sociaux
    document.getElementById('social-links').innerHTML = `
        <a href="${siteConfig.social_links.facebook}"><i class="fab fa-facebook"></i></a>
        <a href="${siteConfig.social_links.tiktok}"><i class="fab fa-tiktok"></i></a>
        <a href="${siteConfig.social_links.instagram}"><i class="fab fa-instagram"></i></a>
        <a href="${siteConfig.social_links.maps}"><i class="fas fa-map-marker-alt"></i></a>
    `;

    // Bouton Flottant
    const fab = document.getElementById('fab-call');
    fab.href = `tel:${siteConfig.footer.telephone.replace(/\s/g, '')}`;
    fab.style.display = "flex";

    // WhatsApp Hero
    document.getElementById('hero-whatsapp').href = `https://wa.me/${siteConfig.footer.whatsapp}`;

    // Charger les autres fichiers
    loadHome();
    loadCards();
    loadCars();
    loadFun();
    loadContact();
}

async function loadHome() {
    const res = await fetch('home.json');
    const data = await res.json();
    document.getElementById('hero-banner').style.backgroundImage = `url('${data.hero.image}')`;
    document.getElementById('hero-title').innerText = data.hero.titre;
    document.getElementById('hero-slogan').innerText = data.hero.slogan;
    document.getElementById('hero-desc').innerText = data.hero.description;
}

async function loadCards() {
    const res = await fetch('data_cards.json');
    const data = await res.json();
    
    // Pourquoi nous choisir (Accueil)
    document.getElementById('features-grid').innerHTML = data.features.map(f => `
        <div class="feature-card">
            <i class="fas ${f.icon}"></i>
            <h3>${f.titre}</h3>
            <p>${f.description}</p>
        </div>
    `).join('');

    // Conditions (Cartes tournantes)
    document.getElementById('conditions-grid').innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front">
                <i class="fas ${c.icon}"></i>
                <h4>${c.titre}</h4>
            </div>
            <div class="flip-back">
                <h4>${c.titre}</h4>
                <p>${c.reponse}</p>
            </div>
        </div>
    `).join('');
}

async function loadCars() {
    const res = await fetch('cars.json');
    const data = await res.json();
    document.getElementById('cars-grid').innerHTML = data.liste.map(car => `
        <div class="car-card">
            <img src="${car.photos[0]}" class="car-img" style="width:100%; height:200px; object-fit:cover;">
            <div class="car-info" style="padding:20px;">
                <h3>${car.nom}</h3>
                <p style="color:var(--primary); font-weight:bold; font-size:1.2rem;">${car.prix}</p>
                <div style="margin:10px 0; font-size:0.8rem; opacity:0.7;">
                    ${car.places} places | ${car.transmission} | ${car.carburant}
                </div>
                <p style="font-size:0.9rem; margin-bottom:15px;">${car.description}</p>
                <div style="display:flex; gap:10px;">
                    <button class="btn-primary" onclick="prefill('${car.nom}')" style="padding:10px 15px; font-size:0.9rem;">Réserver</button>
                    <a href="tel:${siteConfig.footer.telephone}" class="btn-whatsapp" style="padding:10px 15px; font-size:0.9rem; background:#333;"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// ... Les autres fonctions loadFun et loadContact restent identiques au précédent ...

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function prefill(car) {
    openTab('contact');
    setTimeout(() => { document.getElementById('message').value = "Je souhaite réserver la " + car; }, 100);
}

function sendWhatsApp(e) {
    e.preventDefault();
    const msg = document.getElementById('message').value;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}