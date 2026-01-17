let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadData();
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

        document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
        document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
        document.getElementById('floating-call').href = `tel:${siteConfig.header.telephone}`;
        
        const waNum = siteConfig.footer.whatsapp.replace(/\s+/g, '');
        document.getElementById('hero-wa').href = `https://wa.me/${waNum}`;

        document.getElementById('main-footer').innerHTML = `
            <div class="social-links">
                <a href="${siteConfig.footer.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>
                <a href="${siteConfig.footer.google_maps}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
            </div>
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p class="legal">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        `;
    } catch (e) { console.error(e); }
}

async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();

        // 1. Pourquoi nous
        const featGrid = document.getElementById('features-grid');
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

        // 2. Voitures (Correction de l'affichage description & carburant)
        const carGrid = document.getElementById('cars-grid');
        data.voitures.forEach(car => {
            carGrid.innerHTML += `
                <div class="car-card">
                    <div class="slider">${car.photos.map(p => `<img src="${p}">`).join('')}</div>
                    <div class="car-info">
                        <h3>${car.nom}</h3>
                        <div class="car-tags">
                            <span class="tag">💺 ${car.places} Places</span>
                            <span class="tag">⚙️ ${car.transmission}</span>
                            <span class="tag">⛽ ${car.carburant}</span>
                        </div>
                        <p class="car-desc">${car.description}</p>
                        <div class="car-btns">
                            <button class="nav-special" style="border:none; cursor:pointer;" onclick="openTab('contact')">Réserver</button>
                            <a href="tel:${siteConfig.header.telephone}" class="btn-car-call">📞 Appeler</a>
                        </div>
                    </div>
                </div>`;
        });

        // 3. Radios
        const radioGrid = document.getElementById('radio-grid');
        data.radios.forEach(r => {
            radioGrid.innerHTML += `<div class="radio-card" style="padding:20px; text-align:center"><img src="${r.logo}" height="60"><br><h4>${r.nom}</h4><audio controls src="${r.url}" style="width:100%"></audio></div>`;
        });

        // 4. Conditions
        const condList = document.getElementById('conditions-list');
        data.conditions.forEach((c, i) => {
            condList.innerHTML += `<div class="condition-item"><h3>${i+1}- ${c.titre}</h3><ul>${c.details.map(d => `<li>${d}</li>`).join('')}</ul></div>`;
        });
    } catch (e) { console.error(e); }
}

function sendWhatsApp() {
    const lname = document.getElementById('lname').value;
    const fname = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const subj = document.getElementById('subject').value;
    const msg = document.getElementById('message').value;
    
    const waNum = siteConfig.footer.whatsapp.replace(/\s+/g, '');
    
    // Construction du message WhatsApp propre
    const finalMsg = `*NOUVELLE RÉSERVATION*%0A` +
                     `----------------------------%0A` +
                     `*Nom:* ${lname}%0A` +
                     `*Prénom:* ${fname}%0A` +
                     `*Email:* ${email}%0A` +
                     `*Adresse:* ${address}%0A` +
                     `*Objet:* ${subj}%0A%0A` +
                     `*Message:*%0A${msg}`;
                     
    window.open(`https://wa.me/${waNum}?text=${finalMsg}`, '_blank');
}
