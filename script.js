// Variable globale pour stocker la config
let siteConfig = {};

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadData();
});

function toggleMenu() { 
    document.getElementById('nav-menu').classList.toggle('open'); 
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('nav-menu').classList.remove('open');
    window.scrollTo(0,0);
}

async function loadConfig() {
    try {
        const res = await fetch('config.json');
        siteConfig = await res.json(); // On stocke dans la variable globale

        // Header
        document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
        document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
        
        // Nettoyage du numéro pour le lien WhatsApp (enlever les espaces)
        const waNumber = siteConfig.footer.whatsapp.replace(/\s+/g, '');
        document.getElementById('hero-wa').href = `https://wa.me/${waNumber}`;

        // Footer
        document.getElementById('main-footer').innerHTML = `
            <div class="social-links">
                <a href="${siteConfig.footer.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>
                <a href="${siteConfig.footer.google_maps}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
            </div>
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | <i class="fab fa-whatsapp"></i> WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p class="legal">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        `;
    } catch (e) { console.error("Erreur config:", e); }
}

async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();

        // Voitures
        const carGrid = document.getElementById('cars-grid');
        data.voitures.forEach(car => {
            carGrid.innerHTML += `
                <div class="car-card">
                    <div class="slider">${car.photos.map(p => `<img src="${p}" alt="${car.nom}">`).join('')}</div>
                    <div style="padding:20px">
                        <h3>${car.nom}</h3>
                        <p style="font-size:0.9rem; color:#666;">
                            <i class="fas fa-users"></i> ${car.places} places | 
                            <i class="fas fa-cog"></i> ${car.transmission}
                        </p>
                        <p>${car.description}</p>
                        <button class="nav-special" style="width:100%; border:none; padding:10px; cursor:pointer" onclick="openTab('contact')">Réserver</button>
                    </div>
                </div>`;
        });

        // Radios
        const radioGrid = document.getElementById('radio-grid');
        data.radios.forEach(r => {
            radioGrid.innerHTML += `
                <div class="radio-card" style="padding:20px; text-align:center">
                    <img src="${r.logo}" height="60" style="margin-bottom:10px; border-radius:10px">
                    <h4>${r.nom}</h4>
                    <audio controls src="${r.url}" style="width:100%"></audio>
                </div>`;
        });

        // Conditions
        const condList = document.getElementById('conditions-list');
        data.conditions.forEach((c, index) => {
            condList.innerHTML += `
                <div class="condition-item">
                    <h3>${index + 1}- ${c.titre}</h3>
                    <ul>${c.details.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>`;
        });
    } catch (e) { console.error("Erreur data:", e); }
}

function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const subj = document.getElementById('subject').value;
    const msg = document.getElementById('message').value;
    
    // On utilise le numéro de la config s'il est chargé, sinon le tien par défaut
    const num = siteConfig.footer ? siteConfig.footer.whatsapp.replace(/\s+/g, '') : "261388552432";
    
    const url = `https://wa.me/${num}?text=${encodeURIComponent("Nom: " + name + "\nObjet: " + subj + "\n" + msg)}`;
    window.open(url, '_blank');
}