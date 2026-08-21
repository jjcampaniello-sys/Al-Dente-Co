const configPates = {
    fines: { ratio: 1.5, sel: 10, offset: 2, wh: 150 },      
    epaisses: { ratio: 1.5, sel: 10, offset: 3, wh: 165 },   
    completes: { ratio: 1.5, sel: 10, offset: 5, wh: 180 }
};

const configGrains = {
    riz_blanc: { ratio: 1.5, sel: 5, ebullition: 2, repos: 12, wh: 150, prep: "Rincer 3 fois à l'eau froide.", methode: "Riz + eau froide ensemble. Couvercle." },
    riz_complet: { ratio: 2.5, sel: 5, ebullition: 5, repos: 25, wh: 300, prep: "Rincer abondamment à l'eau.", methode: "Riz + eau froide ensemble. Couvercle." },
    quinoa: { ratio: 2.0, sel: 5, ebullition: 0, repos: 15, wh: 120, prep: "Rincer longuement (saponine).", methode: "Porter l'eau seule à ébullition." },
    boulgour: { ratio: 1.8, sel: 5, ebullition: 0, repos: 12, wh: 110, prep: "Aucun conditionnement.", methode: "Porter l'eau seule à ébullition." },
    ble_grain: { ratio: 2.5, sel: 7, ebullition: 3, repos: 20, wh: 220, prep: "Aucun conditionnement.", methode: "Blé + eau froide ensemble. Couvercle." }
};

let sec = 0, active = false, inter = null, wakeLock = null;

function toggleInputs() {
    const cat = document.getElementById('category').value;
    document.getElementById('pates-options').style.display = (cat === 'pates') ? 'flex' : 'none';
    document.getElementById('grains-options').style.display = (cat !== 'pates') ? 'block' : 'none';
    active = false; clearInterval(inter); releaseWakeLock();
    document.getElementById('btn').innerText = "Lancer la cuisson passive";
    document.getElementById('btn').style.background = "var(--green)";
    calculer();
}

function calculer() {
    const cat = document.getElementById('category').value;
    const poids = parseFloat(document.getElementById('poids').value) || 0;
    const cass = document.getElementById('casserole').value;
    const alt = parseInt(document.getElementById('altitude').value);
    const tarifKwh = parseFloat(document.getElementById('tarifKwh').value) || 0.25;
    const stepList = document.getElementById('prepSteps');
    
    let volEau = 0; let poidsSel = 0; let tMinutes = 0; let whSaved = 0;
    let extraBoil = alt === 1000 ? 1 : (alt === 2000 ? 2 : 0); // Temps de chauffe actif requis en altitude
    stepList.innerHTML = ""; 

    if (cat === 'pates') {
        const forme = document.getElementById('formePates').value;
        const tPaquet = parseInt(document.getElementById('tempsPaquet').value) || 0;
        const item = configPates[forme];

        volEau = (poids / 100) * item.ratio; 
        poidsSel = Math.round(volEau * item.sel);
        tMinutes = tPaquet + item.offset + (cass === 'legere' ? 1 : 0) - extraBoil;
        whSaved = Math.round(item.wh * (poids / 200)) - (extraBoil * 15); // Correction éco si feu maintenu

        stepList.innerHTML += `<li>Eau : ${volEau.toFixed(2)}L | Sel : ${poidsSel}g. Chauffer à ébullition.</li>`;
        if (extraBoil > 0) {
            stepList.innerHTML += `<li>Jeter les pâtes. ⚠️ Altitude : <strong>Laisser le feu actif ${extraBoil} min</strong> à couvert.</li>`;
        } else {
            stepList.innerHTML += `<li>Jeter les pâtes, remuer 30s sous couvercle.</li>`;
        }
        stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong> immédiatement (Couvercle fermé).</li>`;
    } else {
        const grain = document.getElementById('typeGrain').value;
        const item = configGrains[grain];

        volEau = (poids / 100) * item.ratio; 
        poidsSel = Math.round(volEau * item.sel);
        let totalEbullition = item.ebullition + extraBoil;
        tMinutes = item.repos + (cass === 'legere' ? 1 : 0);
        whSaved = Math.round(item.wh * (poids / 200)) - (extraBoil * 15);

        stepList.innerHTML += `<li><strong>Prép :</strong> ${item.prep}</li>`;
        stepList.innerHTML += `<li>${item.methode} (Eau : ${volEau.toFixed(2)}L, Sel : ${poidsSel}g).</li>`;
        if (totalEbullition > 0) {
            stepList.innerHTML += `<li>Laisser bouillir sur l'induction pendant <strong>${totalEbullition} min</strong> sous couvercle.</li>`;
        } else {
            stepList.innerHTML += `<li>À l'ébullition, jeter le grain.</li>`;
        }
        stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong>. Laisser le grain absorber l'eau.</li>`;
    }

    document.getElementById('eau').innerText = volEau.toFixed(2);
    document.getElementById('sel').innerText = poidsSel;
    document.getElementById('ecoWh').innerText = Math.max(0, whSaved);
    document.getElementById('ecoEur').innerText = (Math.max(0, whSaved) * (tarifKwh / 1000)).toFixed(2);

    if (!active) { sec = tMinutes * 60; showTime(); }
}

function showTime() {
    document.getElementById('disp').innerText = `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
}

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
}
function releaseWakeLock() {
    if (wakeLock !== null) { wakeLock.release(); wakeLock = null; }
}

function toggle() {
    const b = document.getElementById('btn');
    if (active) {
        clearInterval(inter); active = false; b.innerText = "Reprendre"; b.style.background = "var(--green)"; releaseWakeLock();
    } else {
        active = true; b.innerText = "PAUSE"; b.style.background = "var(--red)"; requestWakeLock();
        inter = setInterval(() => {
            sec--; showTime();
            if (sec <= 0) {
                clearInterval(inter); active = false; b.innerText = "Terminé !"; b.style.background = "#34495e";
                releaseWakeLock(); declencherAlerteVocale();
            }
        }, 1000);
    }
}

function declencherAlerteVocale() {
    const cat = document.getElementById('category').value;
    let nom = "votre préparation";
    if (cat === 'pates') nom = "les pâtes";
    else {
        const grain = document.getElementById('typeGrain').value;
        if(grain.startsWith('riz')) nom = "le riz";
        else nom = "les céréales";
    }

    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}

    setTimeout(() => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(`Attention, la cuisson passive pour ${nom} est terminée. Veuillez égoutter ou servir.`);
            msg.lang = 'fr-FR'; window.speechSynthesis.speak(msg);
        } else { alert(`⏰ Cuisson terminée pour ${nom} !`); }
        calculer();
    }, 400);
}

window.onload = calculer;


