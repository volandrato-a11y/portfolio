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
    document.getElementById('main-footer').innerHTML = `<p>${siteConfig.footer.adresse}</p><p>📞 ${siteConfig.footer.telephone}</p>`;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // 1. Pourquoi nous (Flip Cards)
    const featGrid = document.getElementById('features-grid');
    data.features.forEach(f => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.onclick = () => card.classList.toggle('flipped');
        card.innerHTML = `
            <div class="flip-front"><i class="fas ${f.icon}"></i><h4>${f.titre}</h4><p style="font-size:0.7rem;color:#999">Cliquez pour voir</p></div>
            <div class="flip-back"><p>${f.description}</p></div>
        `;
        featGrid.appendChild(card);
    });

    // 2. Voitures
    const carGrid = document.getElementById('cars-grid');
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
                        <button class="nav-special" style="border:none; cursor:pointer" onclick="openTab('contact')">Réserver</button>
                    </div>
                </div>
            </div>`;
    });

    // 3. Conditions (Flip Cards aussi !)
    const condGrid = document.getElementById('conditions-list');
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
    const text = `*RESERVATION*%0AClient: ${document.getElementById('lname').value} ${document.getElementById('fname').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp.replace(/\s/g, '')}?text=${text}`, '_blank');
}
