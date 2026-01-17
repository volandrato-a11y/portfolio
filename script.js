let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await initSite();
});

async function initSite() {
    try {
        const resConfig = await fetch('config.json');
        siteConfig = await resConfig.json();

        // Application du thème et fond global
        document.documentElement.style.setProperty('--primary', siteConfig.theme.primary);
        if (siteConfig.theme.site_bg) {
            document.body.style.backgroundImage = `url('${siteConfig.theme.site_bg}')`;
        }

        // Header & Branding
        document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;

        // Footer & Statut
        document.getElementById('footer-info').innerHTML = `
            <p><b>${siteConfig.header.nom}</b> - ${siteConfig.footer.adresse}</p>
            <p>NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
            <p>Tél: ${siteConfig.footer.telephone}</p>
        `;

        // Réseaux Sociaux
        document.getElementById('social-links').innerHTML = `
            <a href="${siteConfig.social_links.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="${siteConfig.social_links.tiktok}" target="_blank"><i class="fab fa-tiktok"></i></a>
            <a href="${siteConfig.social_links.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="${siteConfig.social_links.maps}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
        `;

        // Bouton Flottant & WhatsApp
        document.getElementById('fab-call').href = `tel:${siteConfig.footer.telephone.replace(/\s/g, '')}`;
        document.getElementById('hero-whatsapp').href = `https://wa.me/${siteConfig.footer.whatsapp}`;

        // Chargement des contenus
        loadHome();
        loadCards();
        loadCars();
        loadFun();
        loadContact();
    } catch (e) { console.error("Erreur d'initialisation:", e); }
}

async function loadHome() {
    const res = await fetch('home.json');
    const data = await res.json();
    document.getElementById('hero-banner').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${data.hero.image}')`;
    document.getElementById('hero-title').innerText = data.hero.titre;
    document.getElementById('hero-slogan').innerText = data.hero.slogan;
    document.getElementById('hero-desc').innerText = data.hero.description;
}

async function loadCards() {
    const res = await fetch('data_cards.json');
    const data = await res.json();
    
    // Pourquoi nous choisir
    document.getElementById('features-grid').innerHTML = data.features.map(f => `
        <div class="feature-card">
            <i class="fas ${f.icon}"></i>
            <h3>${f.titre}</h3>
            <p>${f.description}</p>
        </div>
    `).join('');

    // Conditions (Cartes Tournantes)
    document.getElementById('conditions-grid').innerHTML = data.conditions.map(c => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front">
                <i class="fas ${c.icon}"></i>
                <h4>${c.titre}</h4>
            </div>
            <div class="flip-back">
                <h4>${c.titre}</h4>
                <p style="color:white !important;">${c.reponse}</p>
            </div>
        </div>
    `).join('');
}

async function loadCars() {
    const res = await fetch('cars.json');
    const data = await res.json();
    document.getElementById('cars-grid').innerHTML = data.liste.map(car => `
        <div class="car-card">
            <img src="${car.photos[0]}" class="car-img">
            <div class="car-info">
                <h3>${car.nom}</h3>
                <p class="car-price">${car.prix}</p>
                <div class="car-tags">
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-users"></i> ${car.places} places</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.carburant}</span>
                </div>
                <p class="car-desc">${car.description}</p>
                <div class="car-actions">
                    <button class="btn-primary" onclick="prefill('${car.nom}')">Réserver</button>
                    <a href="tel:${siteConfig.footer.telephone}" class="btn-call-small"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadFun() {
    const res = await fetch('fun.json');
    const data = await res.json();
    document.getElementById('radios-grid').innerHTML = data.radios.map(r => `
        <div class="radio-card">
            <img src="${r.logo}">
            <h4>${r.nom}</h4>
            <audio controls src="${r.url}"></audio>
        </div>
    `).join('');
}

async function loadContact() {
    const res = await fetch('contact.json');
    const data = await res.json();
    const form = document.getElementById('dynamic-form');
    form.innerHTML = data.formulaire.map(f => {
        if(f.type === 'select') {
            return `<div class="form-group"><label>${f.label}</label><select id="${f.id}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`;
        } else if(f.type === 'textarea') {
            return `<div class="form-group"><label>${f.label}</label><textarea id="${f.id}" rows="3" placeholder="${f.placeholder}"></textarea></div>`;
        }
        return `<div class="form-group"><label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.placeholder}"></div>`;
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
        document.getElementById('message').value = "Bonjour, je souhaite réserver le véhicule : " + car;
    }, 100);
}

function sendWhatsApp(e) {
    e.preventDefault();
    const msg = document.getElementById('message').value || "Bonjour, je souhaite un renseignement.";
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}