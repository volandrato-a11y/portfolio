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
    
    // Theme & Hero
    document.documentElement.style.setProperty('--primary', siteConfig.theme.primary);
    document.getElementById('hero-banner').style.backgroundImage = `url('${siteConfig.theme.hero_bg}')`;
    
    // Header & Footer
    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
    document.getElementById('main-footer').innerHTML = `
        <div class="container">
            <p><b>${siteConfig.header.nom} ${siteConfig.header.suffixe}</b></p>
            <p>${siteConfig.footer.adresse}</p>
            <p>NIF: ${siteConfig.footer.nif} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
        </div>`;

    // Liens réseaux et appels
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('fab-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    document.getElementById('link-fb').href = siteConfig.social.facebook;
    document.getElementById('link-tk').href = siteConfig.social.tiktok;
    document.getElementById('link-ig').href = siteConfig.social.instagram;
    document.getElementById('link-map').href = siteConfig.social.maps;
    
    // Playlists
    document.getElementById('play-yt').href = siteConfig.playlists.youtube;
    document.getElementById('play-sp').href = siteConfig.playlists.spotify;
    document.getElementById('play-dz').href = siteConfig.playlists.deezer;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Pourquoi nous choisir
    document.getElementById('features-grid').innerHTML = data.features.map(f => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4></div>
            <div class="flip-back"><p>${f.description}</p></div>
        </div>`).join('');

    // Véhicules
    document.getElementById('cars-grid').innerHTML = data.voitures.map(v => `
        <div class="car-card">
            <img src="${v.photos[0]}" style="width:100%; height:200px; object-fit:cover;">
            <div class="car-info">
                <span class="car-price-tag">${v.prix}</span>
                <h3 style="margin-top:10px;">${v.nom}</h3>
                <div class="car-specs">
                    <span><i class="fas fa-gas-pump"></i> ${v.carburant}</span>
                    <span><i class="fas fa-users"></i> ${v.places} places</span>
                    <span><i class="fas fa-cog"></i> ${v.transmission}</span>
                </div>
                <p style="font-size:0.85rem; color:#666; margin-bottom:15px;">${v.description}</p>
                <button class="nav-special" style="width:100%; border:none; padding:12px; cursor:pointer;" onclick="prefill('${v.nom}')">Réserver ce véhicule</button>
            </div>
        </div>`).join('');

    // Radios
    document.getElementById('radios-grid').innerHTML = data.radios.map(r => `
        <div class="radio-card">
            <img src="${r.logo}" style="width:45px; border-radius:8px; margin-bottom:5px;">
            <p><b>${r.nom}</b></p>
            <audio controls src="${r.url}" style="width:100%; height:30px; margin-top:10px;"></audio>
        </div>`).join('');

    // Conditions
    document.getElementById('conditions-list').innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div>
            <div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>
        </div>`).join('');
}

function prefill(car) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const nom = document.getElementById('lname').value;
    const msg = document.getElementById('message').value;
    const finalMsg = `*Réservation Rija Niaina*%0A*Client:* ${nom}%0A*Message:* ${msg}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${finalMsg}`, '_blank');
}
