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
    
    // Header & Footer
    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
    document.getElementById('main-footer').innerHTML = `
        <div class="container">
            <p><strong>${siteConfig.header.nom} ${siteConfig.header.suffixe}</strong></p>
            <p>${siteConfig.footer.adresse}</p>
            <p>NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        </div>`;

    // Liens
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('fab-call-btn').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    
    // Réseaux Sociaux
    document.getElementById('link-fb').href = siteConfig.social.facebook;
    document.getElementById('link-tk').href = siteConfig.social.tiktok;
    document.getElementById('link-ig').href = siteConfig.social.instagram;
    document.getElementById('link-map').href = siteConfig.social.maps;

    // Playlists
    document.getElementById('play-yt').href = siteConfig.playlists.youtube;
    document.getElementById('play-sp').href = siteConfig.playlists.spotify;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // 1. Pourquoi nous choisir (Flip Cards)
    const featGrid = document.getElementById('features-grid');
    featGrid.innerHTML = data.features.map(f => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front">
                <i class="fas ${f.icon}"></i>
                <h4>${f.titre}</h4>
            </div>
            <div class="flip-back">
                <p>${f.description}</p>
            </div>
        </div>
    `).join('');

    // 2. Véhicules
    const carGrid = document.getElementById('cars-grid');
    carGrid.innerHTML = data.voitures.map(v => `
        <div class="car-card">
            <img src="${v.photos[0]}" style="width:100%; height:200px; object-fit:cover;">
            <div class="car-info">
                <span class="car-price-tag">${v.prix}</span>
                <h3>${v.nom}</h3>
                <div class="car-specs">
                    <span><i class="fas fa-gas-pump"></i> ${v.carburant}</span>
                    <span><i class="fas fa-users"></i> ${v.places} places</span>
                </div>
                <p class="car-desc-text">${v.description}</p>
                <button class="nav-special" style="width:100%; border:none; padding:12px; cursor:pointer;" onclick="prefill('${v.nom}')">Réserver</button>
            </div>
        </div>
    `).join('');

    // 3. Radios
    const radioGrid = document.getElementById('radios-grid');
    radioGrid.innerHTML = data.radios.map(r => `
        <div class="radio-card">
            <img src="${r.logo}" style="width:50px; border-radius:10px;">
            <p><b>${r.nom}</b></p>
            <audio controls src="${r.url}" style="width:100%; height:30px; margin-top:10px;"></audio>
        </div>
    `).join('');

    // 4. Conditions
    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div>
            <div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>
        </div>
    `).join('');
}

function prefill(car) {
    document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const text = `Nom: ${document.getElementById('lname').value}%0AMessage: ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${text}`, '_blank');
}
