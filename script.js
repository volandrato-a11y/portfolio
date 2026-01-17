let siteConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadData();
});

function toggleMenu() { document.getElementById('nav-menu').classList.toggle('open'); }
function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

async function loadConfig() {
    try {
        const res = await fetch('config.json');
        siteConfig = await res.json();
        document.getElementById('brand-name').innerHTML = `${siteConfig.header.nom} <span>${siteConfig.header.suffixe}</span>`;
        document.getElementById('hero-call').href = `tel:${siteConfig.header.telephone}`;
        document.getElementById('floating-call').href = `tel:${siteConfig.header.telephone}`;
        document.getElementById('hero-wa').href = `https://wa.me/${siteConfig.footer.whatsapp.replace(/\s+/g, '')}`;

        document.getElementById('main-footer').innerHTML = `
            <p>${siteConfig.footer.adresse}</p>
            <p>📞 ${siteConfig.footer.telephone} | WhatsApp: ${siteConfig.footer.whatsapp}</p>
            <p style="font-size:0.7rem; margin-top:10px">NIF: ${siteConfig.footer.nif} | STAT: ${siteConfig.footer.stat}</p>
        `;
    } catch (e) { console.error(e); }
}

async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();

        const featGrid = document.getElementById('features-grid');
        data.features.forEach(f => {
            featGrid.innerHTML += `<div style="background:white; padding:20px; border-radius:15px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.05)">
                <i class="fas ${f.icon}" style="font-size:30px; color:var(--primary); margin-bottom:10px"></i>
                <h4>${f.titre}</h4><p style="font-size:0.85rem; color:#666">${f.description}</p>
            </div>`;
        });

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
                            <span class="tag">⚙️ ${car.transmission}</span>
                            <span class="tag">⛽ ${car.carburant}</span>
                        </div>
                        <p class="car-desc">${car.description}</p>
                        <div class="car-btns">
                            <button class="nav-special" style="border:none; cursor:pointer" onclick="openTab('contact')">Réserver</button>
                            <a href="tel:${siteConfig.header.telephone}" class="btn-car-call">📞 Appeler</a>
                        </div>
                    </div>
                </div>`;
        });

        const condList = document.getElementById('conditions-list');
        data.conditions.forEach((c, i) => {
            condList.innerHTML += `<div style="background:white; padding:20px; border-radius:15px; margin-bottom:15px">
                <h3 style="color:var(--primary)">${i+1}- ${c.titre}</h3>
                <ul style="padding-left:20px">${c.details.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>`;
        });
    } catch (e) { console.error(e); }
}

function sendWhatsApp() {
    const text = `*RÉSERVATION SITE*%0A` +
                 `*Client:* ${document.getElementById('lname').value} ${document.getElementById('fname').value}%0A` +
                 `*Email:* ${document.getElementById('email').value}%0A` +
                 `*Adresse:* ${document.getElementById('address').value}%0A` +
                 `*Message:* ${document.getElementById('message').value}`;
    window.open(`https://wa.me/${siteConfig.footer.whatsapp.replace(/\s+/g, '')}?text=${text}`, '_blank');
}