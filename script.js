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
    document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
    document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp}`;
    
    document.getElementById('main-footer').innerHTML = `
        <div class="container">
            <p><strong>${siteConfig.header.nom} ${siteConfig.header.suffixe}</strong></p>
            <p>${siteConfig.footer.adresse}</p>
            <p>NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        </div>`;
}

async function loadData() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Pourquoi nous
    document.getElementById('features-grid').innerHTML = data.features.map(f => `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-front"><i class="fas ${f.icon}" style="font-size:2rem; color:var(--primary)"></i><h4>${f.titre}</h4></div>
            <div class="flip-back"><p>${f.description}</p></div>
        </div>`).join('');

    // Voitures avec Carburant & Description
    document.getElementById('cars-grid').innerHTML = data.voitures.map(v => `
        <div class="car-card">
            <img src="${v.photos[0]}" style="width:100%; height:200px; object-fit:cover;">
            <div class="car-info">
                <span class="car-price-tag">${v.prix}</span>
                <h3 style="margin-top:10px;">${v.nom}</h3>
                <div class="car-specs">
                    <span><i class="fas fa-gas-pump"></i> ${v.carburant}</span>
                    <span><i class="fas fa-users"></i> ${v.places} places</span>
                </div>
                <p style="font-size:0.85rem; color:#666;">${v.description}</p>
                <button class="nav-special" style="width:100%; border:none; padding:10px; margin-top:10px; cursor:pointer;" onclick="prefillReservation('${v.nom}')">Réserver</button>
            </div>
        </div>`).join('');
}

function prefillReservation(car) {
    document.getElementById('message').value = "Bonjour, je souhaite réserver : " + car;
    openTab('contact');
}

function sendWhatsApp() {
    const msg = `Nom: ${document.getElementById('lname').value} | Message: ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}
