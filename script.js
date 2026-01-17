let siteConfig = {};

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadData();
});

function toggleMenu() { document.getElementById('nav-menu').classList.toggle('open'); }

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('nav-menu').classList.remove('open');
    window.scrollTo(0,0);
}

async function loadConfig() {
    try {
        const res = await fetch('config.json');
        siteConfig = await res.json();

        // Header
        document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
        document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
        document.getElementById('floating-call').href = `tel:${siteConfig.header.telephone}`;
        
        const waNum = siteConfig.footer.whatsapp.replace(/\s+/g, '');
        document.getElementById('hero-wa').href = `https://wa.me/${waNum}`;

        // Footer
        document.getElementById('main-footer').innerHTML = `
            <div class="social-links">
                <a href="${siteConfig.footer.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>
                <a href="${siteConfig.footer.google_maps}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
            </div>
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p class="legal">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        `;
    } catch (e) { console.error("Erreur config:", e); }
}

async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();

        // Pourquoi nous (Flip Cards)
        const featGrid = document.querySelector('.feat-grid');
        data.features.forEach(f => {
            const card = document.createElement('div');
            card.className = 'feat-card';
            card.onclick = () => card.classList.toggle('flipped');
            card.innerHTML = `
                <div class="feat-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4></div>
                <div class="feat-back"><h4>${f.titre}</h4><p>${f.description}</p></div>
            `;
            featGrid.appendChild(card);
        });

        // Voitures
        const carGrid = document.getElementById('cars-grid');
        data.voitures.forEach(car => {
            carGrid.innerHTML += `
                <div class="car-card">
                    <div class="slider">${car.photos.map(p => `<img src="${p}">`).join('')}</div>
                    <div style="padding:20px">
                        <h3>${car.nom}</h3>
                        <p style="font-size:0.85rem; color:#666;">💺 ${car.places} places | ⚙️ ${car.transmission}</p>
                        <div class="car-btns">
                            <button class="nav-special" style="border:none; cursor:pointer" onclick="openTab('contact')">Réserver</button>
                            <a href="tel:${siteConfig.header.telephone}" class="btn-car-call">📞 Appeler</a>
                        </div>
                    </div>
                </div>`;
        });

        // Radios
        const radioGrid = document.getElementById('radio-grid');
        data.radios.forEach(r => {
            radioGrid.innerHTML += `<div class="radio-card" style="padding:20px; text-align:center"><img src="${r.logo}" height="60"><br><h4>${r.nom}</h4><audio controls src="${r.url}" style="width:100%"></audio></div>`;
        });

        // Conditions
        const condList = document.getElementById('conditions-list');
        data.conditions.forEach((c, i) => {
            condList.innerHTML += `<div class="condition-item"><h3>${i+1}- ${c.titre}</h3><ul>${c.details.map(d => `<li>${d}</li>`).join('')}</ul></div>`;
        });

    } catch (e) { console.error("Erreur data:", e); }
}

function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const subj = document.getElementById('subject').value;
    const msg = document.getElementById('message').value;
    const waNum = siteConfig.footer.whatsapp.replace(/\s+/g, '');
    window.open(`https://wa.me/${waNum}?text=Nom: ${name}%0AObjet: ${subj}%0A${msg}`, '_blank');
}