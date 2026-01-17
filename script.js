let config = {};

document.addEventListener('DOMContentLoaded', async () => {
    await initSite();
});

async function initSite() {
    // 1. Charger la configuration globale
    const resConfig = await fetch('config.json');
    config = await resConfig.json();

    // Appliquer le thème
    const root = document.documentElement;
    root.style.setProperty('--primary', config.theme.primary);
    root.style.setProperty('--accent', config.theme.accent);
    root.style.setProperty('--text-color', config.theme.text_main);
    root.style.setProperty('--border-color', config.theme.border_color);

    // Image de fond globale (Fallback si vide)
    if (config.theme.site_bg) {
        document.body.style.backgroundImage = `url('${config.theme.site_bg}')`;
    }

    // Header & Footer
    document.getElementById('brand-name').innerHTML = `${config.header.nom} <span>${config.header.suffixe}</span>`;
    document.getElementById('main-footer').innerHTML = `
        <p><b>${config.header.nom}</b> - ${config.footer.adresse}</p>
        <p>NIF: ${config.footer.nif} | Tel: ${config.footer.telephone}</p>
    `;
    document.getElementById('fab-call').href = `tel:${config.footer.telephone.replace(/\s/g, '')}`;

    // Charger les contenus des pages
    loadHomePage();
    loadCarsPage();
    loadFunPage();
    loadContactPage();
}

async function loadHomePage() {
    const res = await fetch('home.json');
    const data = await res.json();
    document.getElementById('hero-banner').style.backgroundImage = `url('${data.hero.image}')`;
    document.getElementById('hero-title').innerText = data.hero.titre;
    document.getElementById('hero-slogan').innerText = data.hero.slogan;
    document.getElementById('hero-desc').innerText = data.hero.description;
}

async function loadCarsPage() {
    const res = await fetch('cars.json');
    const data = await res.json();
    const grid = document.getElementById('cars-grid');
    grid.innerHTML = data.liste.map(car => `
        <div class="car-card">
            <img src="${car.photos[0]}" class="car-img">
            <div class="car-info">
                <h3>${car.nom}</h3>
                <p style="color:var(--primary); font-weight:bold;">${car.prix}</p>
                <div class="car-specs">
                    <span class="spec-item">${car.places} places</span>
                    <span class="spec-item">${car.transmission}</span>
                    <span class="spec-item">${car.carburant}</span>
                </div>
                <p style="font-size:0.9rem; margin-bottom:15px;">${car.description}</p>
                <button class="btn-submit" onclick="prefill('${car.nom}')">Réserver</button>
            </div>
        </div>
    `).join('');
}

async function loadFunPage() {
    const res = await fetch('fun.json');
    const data = await res.json();
    document.getElementById('fun-title').innerText = data.style.title || "Divertissement";
    const grid = document.getElementById('radios-grid');
    grid.innerHTML = data.radios.map(r => `
        <div class="car-card" style="padding:20px; text-align:center;">
            <img src="${r.logo}" style="width:60px; height:60px; object-fit:contain; margin-bottom:10px;">
            <h4>${r.nom}</h4>
            <audio controls src="${r.url}" style="width:100%; margin-top:15px;"></audio>
        </div>
    `).join('');
}

async function loadContactPage() {
    const res = await fetch('contact.json');
    const data = await res.json();
    document.getElementById('contact-title').innerText = data.appearance.title || "Contact";
    const form = document.getElementById('dynamic-form');
    
    form.innerHTML = data.formulaire.map(f => {
        if(f.type === 'select') {
            return `<label>${f.label}</label><select id="${f.id}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
        } else if(f.type === 'textarea') {
            return `<label>${f.label}</label><textarea id="${f.id}" rows="4" placeholder="${f.placeholder}"></textarea>`;
        }
        return `<label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.placeholder}">`;
    }).join('') + `<button type="submit" class="btn-submit">Envoyer sur WhatsApp</button>`;
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function prefill(carName) {
    openTab('contact');
    setTimeout(() => {
        document.getElementById('message').value = `Bonjour, je souhaite réserver la ${carName}.`;
    }, 100);
}

function sendWhatsApp(e) {
    e.preventDefault();
    const msg = document.getElementById('message').value;
    const url = `https://wa.me/${config.footer.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}