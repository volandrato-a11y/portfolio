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

    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>SERVICES</span>`;
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    
    // Playlists
    document.getElementById('play-yt').href = siteConfig.playlists.youtube;
    document.getElementById('play-sp').href = siteConfig.playlists.spotify;
    document.getElementById('play-dz').href = siteConfig.playlists.deezer;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Voitures
    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = "";
    data.voitures.forEach(v => {
        carsGrid.innerHTML += `
        <div class="car-card">
            <img src="${v.photos[0]}" alt="${v.nom}">
            <div class="car-info">
                <h3>${v.nom}</h3>
                <p class="price">${v.prix}</p>
                <div class="specs">
                    <span><i class="fas fa-users"></i> ${v.places}</span>
                    <span><i class="fas fa-cog"></i> ${v.transmission}</span>
                </div>
                <button class="btn-res" onclick="prefillReservation('${v.nom}')">Réserver</button>
            </div>
        </div>`;
    });

    // Radios
    const radioGrid = document.getElementById('radios-grid');
    radioGrid.innerHTML = "";
    data.radios.forEach(r => {
        radioGrid.innerHTML += `
        <div class="radio-card" style="background:#fff; padding:10px; border-radius:10px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.1)">
            <img src="${r.logo}" style="width:50px; height:50px; border-radius:50%">
            <p style="margin:5px 0; font-weight:600">${r.nom}</p>
            <audio controls src="${r.url}" style="width:100%; height:30px"></audio>
        </div>`;
    });

    // Conditions
    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = "";
    data.conditions.forEach(c => {
        condGrid.innerHTML += `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
                <div class="flip-front">
                    <i class="fas ${c.icon}"></i>
                    <h4>${c.titre}</h4>
                </div>
                <div class="flip-back">
                    <h4>${c.titre}</h4>
                    <p>${c.reponse}</p>
                </div>
            </div>
        </div>`;
    });
}

function prefillReservation(car) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const name = document.getElementById('lname').value;
    const msg = document.getElementById('message').value;
    const text = `Bonjour, je suis ${name}. ${msg}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${encodeURIComponent(text)}`);
}
