let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadData();
});

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const icon = document.querySelector('#burger-btn i');
    menu.classList.toggle('active');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const menu = document.getElementById('nav-menu');
    if (menu.classList.contains('active')) toggleMenu();
    window.scrollTo(0,0);
}

async function loadConfig() {
    const res = await fetch('config.json');
    siteConfig = await res.json();
    
    // Application du thème
    const root = document.documentElement;
    root.style.setProperty('--primary', siteConfig.theme.primary);
    root.style.setProperty('--accent', siteConfig.theme.accent);
    const hero = document.querySelector('.hero');
    if(hero) hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${siteConfig.theme.hero_bg}')`;

    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
    if(document.getElementById('hero-call')) document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    if(document.getElementById('hero-wa')) document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp.replace(/\s+/g, '')}`;

    document.getElementById('main-footer').innerHTML = `
        <div class="container">
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p style="font-size:0.7rem; opacity:0.5; margin-top:10px;">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        </div>
    `;
}

function prefillReservation(carName) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = `Je souhaite réserver le véhicule : ${carName}`;
    openTab('contact');
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    const featGrid = document.getElementById('features-grid');
    featGrid.innerHTML = "";
    data.features.forEach(f => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.onclick = () => card.classList.toggle('flipped');
        card.innerHTML = `<div class="flip-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4></div><div class="flip-back"><p>${f.description}</p></div>`;
        featGrid.appendChild(card);
    });

    const carGrid = document.getElementById('cars-grid');
    carGrid.innerHTML = "";
    data.voitures.forEach(car => {
        carGrid.innerHTML += `
            <div class="car-card">
                <div class="car-price-tag">${car.prix}</div>
                <div class="slider">${car.photos.map(p => `<img src="${p}">`).join('')}</div>
                <div class="car-info">
                    <h3>${car.nom}</h3>
                    <div class="car-tags"><span class="tag">💺 ${car.places} places</span><span class="tag">⛽ ${car.carburant}</span></div>
                    <p class="car-desc">${car.description}</p>
                    <button class="nav-special" style="width:100%; border:none; cursor:pointer; padding:12px;" onclick="prefillReservation('${car.nom}')">Réserver</button>
                </div>
            </div>`;
    });

    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = "";
    data.conditions.forEach(c => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.onclick = () => card.classList.toggle('flipped');
        card.innerHTML = `<div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div><div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>`;
        condGrid.appendChild(card);
    });
}

function sendWhatsApp() {
    const text = `*MESSAGE DU SITE*%0A*Client:* ${document.getElementById('lname').value} ${document.getElementById('fname').value}%0A*Email:* ${document.getElementById('email').value}%0A*Motif:* ${document.getElementById('subject').value}%0A*Message:* ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp.replace(/\s+/g, '')}?text=${text}`, '_blank');
}
