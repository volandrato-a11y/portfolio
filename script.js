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
    
    // Header Logo & Nom
    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
    
    // Liens & Playlists
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    document.getElementById('play-yt').href = siteConfig.playlists.youtube;
    document.getElementById('play-sp').href = siteConfig.playlists.spotify;
    document.getElementById('play-dz').href = siteConfig.playlists.deezer;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Voitures
    const carGrid = document.getElementById('cars-grid');
    carGrid.innerHTML = data.voitures.map(car => `
        <div class="car-card">
            <div class="car-price-tag">${car.prix}</div>
            <img src="${car.photos[0]}" style="width:100%; border-radius:15px 15px 0 0">
            <div class="car-info">
                <h3>${car.nom}</h3>
                <p>${car.places} Places - ${car.carburant}</p>
                <button class="nav-special" onclick="prefillReservation('${car.nom}')">Réserver</button>
            </div>
        </div>`).join('');

    // Radios
    const radioGrid = document.getElementById('radios-grid');
    radioGrid.innerHTML = data.radios.map(r => `
        <div class="radio-card">
            <img src="${r.logo}" style="width:45px; border-radius:8px">
            <p><b>${r.nom}</b></p>
            <audio controls src="${r.url}" style="width:100%; height:30px;"></audio>
        </div>`).join('');

    // Conditions (6 conditions)
    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div>
            <div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>
        </div>`).join('');
}

function prefillReservation(car) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const msg = `*RESERVATION SITE*%0A*Nom:* ${document.getElementById('lname').value}%0A*Message:* ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${msg}`, '_blank');
}
