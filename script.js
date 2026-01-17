let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadData();
});

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

async function loadConfig() {
    const res = await fetch('config.json');
    siteConfig = await res.json();
    document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
    
    // Liens dynamiques Hero
    if(document.getElementById('hero-call')) document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    if(document.getElementById('hero-wa')) document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp.replace(/\s/g, '')}`;

    // Restauration du footer
    document.getElementById('main-footer').innerHTML = `
        <div class="container">
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p style="font-size:0.7rem; margin-top:10px; opacity:0.5;">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        </div>
    `;
}

// Fonction de redirection à partir du bouton Réserver
function prefillReservation(carName) {
    document.getElementById('subject').value = "Reservation";
    document.getElementById('message').value = `Je souhaite réserver le véhicule : ${carName}`;
    openTab('contact');
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // 1. Pourquoi nous
    const featGrid = document.getElementById('features-grid');
    featGrid.innerHTML = "";
    data.features.forEach(f => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.onclick = () => card.classList.toggle('flipped');
        card.innerHTML = `
            <div class="flip-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4></div>
            <div class="flip-back"><p>${f.description}</p></div>
        `;
        featGrid.appendChild(card);
    });

    // 2. Voitures
    const carGrid = document.getElementById('cars-grid');
    carGrid.innerHTML = "";
    data.voitures.forEach(car => {
        carGrid.innerHTML += `
            <div class="car-card">
                <div class="car-price-tag">${car.prix}</div>
                <div class="slider">${car.photos.map(p => `<img src="${p}">`).join('')}</div>
                <div class="car-info">
                    <h3>${car.nom}</h3>
                    <div class="car-tags">
                        <span class="tag">💺 ${car.places} places</span>
                        <span class="tag">⛽ ${car.carburant}</span>
                    </div>
                    <p class="car-desc">${car.description}</p>
                    <div class="car-btns">
                        <button class="nav-special" style="border:none; cursor:pointer; padding:10px;" onclick="prefillReservation('${car.nom}')">Réserver</button>
                    </div>
                </div>
            </div>`;
    });

    // 3. Conditions (Chargement corrigé)
    const condGrid = document.getElementById('conditions-list');
    condGrid.innerHTML = "";
    data.conditions.forEach(c => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.onclick = () => card.classList.toggle('flipped');
        card.innerHTML = `
            <div class="flip-front"><i class="fas ${c.icon}"></i><h4>${c.titre}</h4></div>
            <div class="flip-back"><h4>${c.titre}</h4><p>${c.reponse}</p></div>
        `;
        condGrid.appendChild(card);
    });
}

function sendWhatsApp() {
    const text = `*MESSAGE DU SITE*%0A` +
                 `*Client:* ${document.getElementById('lname').value} ${document.getElementById('fname').value}%0A` +
                 `*Email:* ${document.getElementById('email').value}%0A` +
                 `*Motif:* ${document.getElementById('subject').value}%0A` +
                 `*Message:* ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp.replace(/\s/g, '')}?text=${text}`, '_blank');
}
