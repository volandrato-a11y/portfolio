let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await initSite();
});

async function initSite() {
    try {
        const resConfig = await fetch('config.json');
        siteConfig = await resConfig.json();

        // Thème
        document.documentElement.style.setProperty('--primary', siteConfig.theme.primary);
        document.documentElement.style.setProperty('--accent', siteConfig.theme.accent);
        
        // Header
        // Dans la fonction async function initSite()

document.getElementById('brand-name').innerHTML = `
    <img src="${siteConfig.header.logo_url}" alt="Logo" style="height: 40px; vertical-align: middle; margin-right: 10px;">
    ${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>
`;
// Dans la fonction async function initSite() ...
document.getElementById('footer-info').innerHTML = `
    <p><b>${siteConfig.header.nom}</b><br>${siteConfig.footer.adresse}</p>
    <p style="margin-top:5px;">
        <i class="fas fa-phone"></i> ${siteConfig.footer.telephone}
    </p>
    <p style="font-size:0.8rem; margin-top:5px; color:#777;">
        NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}
    </p>
`;

// Cherchez ce bloc dans la fonction initSite et remplacez-le :

        document.getElementById('social-links').innerHTML = `
            <a href="${siteConfig.social_links.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="${siteConfig.social_links.tiktok}" target="_blank"><i class="fab fa-tiktok"></i></a>
            <a href="${siteConfig.social_links.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="${siteConfig.social_links.maps}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
        `;

        // Liens
        document.getElementById('fab-call').href = `tel:${siteConfig.footer.telephone.replace(/\s/g, '')}`;
        document.getElementById('hero-whatsapp').href = `https://wa.me/${siteConfig.footer.whatsapp}`;

        // Chargement des modules
        await loadHome();
        await loadCards();
        await loadCars();
        await loadFun();
        await loadContact();

    } catch (e) { console.error("Erreur init:", e); }
}

async function loadHome() {
    const res = await fetch('home.json');
    const data = await res.json();
    document.getElementById('hero-banner').style.backgroundImage = `url('${data.hero.image}')`;
    document.getElementById('hero-title').innerText = data.hero.titre;
    document.getElementById('hero-slogan').innerText = data.hero.slogan;
    document.getElementById('hero-desc').innerText = data.hero.description;
}

// Correction des Cartes Tournantes
// Remplacez toute la fonction loadCards par ceci :
async function loadCards() {
    const res = await fetch('data_cards.json');
    const data = await res.json();
    
    // MODIFICATION ICI : On utilise la structure flip-card pour "Pourquoi nous choisir"
    document.getElementById('features-grid').innerHTML = data.features.map(f => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
                <div class="flip-front">
                    <i class="fas ${f.icon}"></i>
                    <h3>${f.titre}</h3>
                </div>
                <div class="flip-back">
                    <p>${f.description}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Les conditions restent aussi en mode "flip"
    document.getElementById('conditions-grid').innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
                <div class="flip-front">
                    <i class="fas ${c.icon}"></i>
                    <h4>${c.titre}</h4>
                </div>
                <div class="flip-back">
                    <p>${c.reponse}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Mise à jour Véhicules (Galerie défilante)
async function loadCars() {
    const res = await fetch('cars.json');
    const data = await res.json();
    
    document.getElementById('cars-grid').innerHTML = data.liste.map(car => `
        <div class="car-card">
            <div class="car-gallery">
                ${car.photos.map(photo => `<img src="${photo}" loading="lazy">`).join('')}
            </div>
            <div class="car-info">
                <h3>${car.nom}</h3>
                <p class="car-price">${car.prix}</p>
                <div class="car-tags">
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.carburant}</span>
                    <span><i class="fas fa-users"></i> ${car.places}</span>
                </div>
                <p class="car-desc">${car.description}</p>
                <div class="car-actions">
                    <button class="btn-reserve" onclick="prefill('${car.nom}')">Réserver</button>
                    <a href="tel:${siteConfig.footer.telephone}" class="btn-call-small"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Mise à jour Divertissement (Radios + Playlists)
async function loadFun() {
    const res = await fetch('fun.json');
    const data = await res.json();
    
    let contentHtml = '';

    // 1. Les Radios
    contentHtml += data.radios.map(r => `
        <div class="radio-card">
            <h4>${r.nom}</h4>
            <div class="radio-logo-container">
                <img src="${r.logo}" alt="${r.nom}">
            </div>
            <audio class="audio-player" controls src="${r.url}"></audio>
        </div>
    `).join('');

    // 2. Les Playlists (si elles existent dans le JSON)
    if(data.playlists) {
        contentHtml += data.playlists.map(p => `
             <div class="radio-card">
                <h4>${p.nom}</h4>
                <div class="radio-logo-container">
                    <img src="${p.logo}" alt="${p.nom}">
                </div>
                <a href="${p.link}" target="_blank" class="btn-primary" style="width:100%; justify-content:center;">
                    <i class="fas fa-play"></i> Écouter
                </a>
            </div>
        `).join('');
    }

    document.getElementById('radios-grid').innerHTML = contentHtml;
}

async function loadContact() {
    const res = await fetch('contact.json');
    const data = await res.json();
    const form = document.getElementById('dynamic-form');
    
    form.innerHTML = data.formulaire.map(f => {
        let inputHtml = '';
        if(f.type === 'select') {
            inputHtml = `<select id="${f.id}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
        } else if(f.type === 'textarea') {
            inputHtml = `<textarea id="${f.id}" rows="4" placeholder="${f.placeholder}"></textarea>`;
        } else {
            inputHtml = `<input type="${f.type}" id="${f.id}" placeholder="${f.placeholder}">`;
        }
        return `<div class="form-group"><label>${f.label}</label>${inputHtml}</div>`;
    }).join('') + `<button type="submit" class="btn-submit">Envoyer sur WhatsApp <i class="fab fa-whatsapp"></i></button>`;
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('nav-menu').classList.remove('active');
    window.scrollTo(0,0);
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

function prefill(car) {
    openTab('contact');
    setTimeout(() => {
        const msgField = document.getElementById('message');
        if(msgField) {
            msgField.value = `Bonjour, je suis intéressé par la location de la ${car}.`;
            msgField.scrollIntoView();
        }
    }, 300);
}

function sendWhatsApp(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('#dynamic-form input, #dynamic-form select, #dynamic-form textarea');
    let msg = "";
    inputs.forEach(input => {
        if(input.value) msg += `*${input.previousElementSibling.innerText}*: ${input.value}%0A`;
    });
    
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${msg}`, '_blank');

}

