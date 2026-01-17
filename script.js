let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadData();
});

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('nav-menu').classList.remove('active');
    window.scrollTo(0,0);
}

async function loadConfig() {
    const res = await fetch('config.json');
    siteConfig = await res.json();
    
    const root = document.documentElement;
    root.style.setProperty('--primary', siteConfig.theme.primary);
    root.style.setProperty('--accent', siteConfig.theme.accent);
    document.querySelector('.hero').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${siteConfig.theme.hero_bg}')`;

    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>SERVICES</span>`;
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    
    // Playlists
    document.getElementById('play-yt').href = siteConfig.playlists.youtube;
    document.getElementById('play-sp').href = siteConfig.playlists.spotify;
    document.getElementById('play-dz').href = siteConfig.playlists.deezer;

    // Social
    document.getElementById('link-fb').href = siteConfig.social.facebook;
    document.getElementById('link-tk').href = siteConfig.social.tiktok;
    document.getElementById('link-ig').href = siteConfig.social.instagram;
    document.getElementById('link-map').href = siteConfig.social.maps;

    document.getElementById('main-footer').innerHTML = `
        <p>${siteConfig.footer.adresse}</p>
        <p>WhatsApp: ${siteConfig.footer.whatsapp} | NIF: ${siteConfig.footer.nif}</p>
    `;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Features
    const featGrid = document.getElementById('features-grid');
    featGrid.innerHTML = "";
    data.features.forEach(f => {
        featGrid.innerHTML += `<div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4></div>
            <div class="flip-back"><p>${f.description}</p></div>
        </div>`;
    });

    // Voitures
    const carGrid = document.getElementById('cars-grid');
    carGrid.innerHTML = "";
    data.voitures.forEach(car => {
        carGrid.innerHTML += `<div class="car-card">
            <div class="car-price-tag">${car.prix}</div>
            <div class="slider"><img src="${car.photos[0]}"></div>
            <div class="car-info">
                <h3>${car.nom}</h3>
                <p>${car.places} Places - ${car.carburant}</p>
                <button class="nav-special" style="width:100%; border:none; padding:12px; cursor:pointer; margin-top:10px" onclick="prefillReservation('${car.nom}')">Réserver</button>
            </div>
        </div>`;
    });

    // Radios
    const radioGrid = document.getElementById('radios-grid');
    radioGrid.innerHTML = "";
    data.radios.forEach(r => {
        radioGrid.innerHTML += `<div class="radio-card">
            <img src="${r.logo}" style="width:40px; border-radius:8px">
            <p><b>${r.nom}</b></p>
            <audio controls src="${r.url}" style="width:100%; height:30px; margin-top:10px"></audio>
        </div>`;
    });

    // Conditions
    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = "";
    data.conditions.forEach(c => {
        condGrid.innerHTML += `<div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div>
            <div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>
        </div>`;
    });
}

function prefillReservation(car) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const msg = `*RESERVATION SITE*%0A*Nom:* ${document.getElementById('lname').value}%0A*Motif:* ${document.getElementById('subject').value}%0A*Message:* ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${msg}`, '_blank');
}
