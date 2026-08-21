
let endTimestamp = null, audioCtx = null;
const configPates = {
    fines:     { ratio: 1.0, sel: 5, offset: 2, wh: 150 },      
    epaisses:  { ratio: 1.0, sel: 5, offset: 3, wh: 165 },   
    completes: { ratio: 1.0, sel: 5, offset: 5, wh: 180 }
};

const configGrains = {
    riz_blanc:    { ratio: 0.18, sel: 4, ebullition: 2,  repos: 12, wh: 150, prep: "Rincer 3 fois à l'eau froide pour enlever l'amidon libre.", methode: "Mettre le riz et l'eau froide ensemble. Porter à ébullition avec couvercle." },
    riz_complet:  { ratio: 0.30, sel: 4, ebullition: 5,  repos: 40, wh: 300, prep: "Rincer abondamment à l'eau courante.", methode: "Mettre le riz et l'eau froide ensemble. Porter à ébullition soutenue avec couvercle." },
    quinoa:       { ratio: 0.28, sel: 3, ebullition: 12, repos: 5,  wh: 120, prep: "Rincer longuement pour éliminer la saponine amère.", methode: "Porter l'eau seule à ébullition (100°C). Jeter le quinoa." },
    boulgour:     { ratio: 0.20, sel: 3, ebullition: 10, repos: 6, wh: 110, prep: "Aucun conditionnement requis.", methode: "Porter l'eau seule à ébullition (100°C). Jeter le boulgour, feu doux." },
    ble_grain:    { ratio: 0.35, sel: 4, ebullition: 45, repos: 15, wh: 220, prep: "Aucun conditionnement requis. Un trempage de 8h améliore le résultat.", methode: "Mettre le blé et l'eau froide ensemble. Porter à ébullition avec couvercle." }
};

let sec = 0, active = false, inter = null, wakeLock = null;

function toggleInputs() {
    const cat = document.getElementById('category').value;
    document.getElementById('pates-options').style.display = (cat === 'pates') ? 'block' : 'none';
    document.getElementById('grains-options').style.display = (cat !== 'pates') ? 'block' : 'none';
    
    active = false;
    clearInterval(inter);
    releaseWakeLock();
    document.getElementById('btn').innerText = "Lancer la cuisson passive";
    document.getElementById('btn').style.background = "var(--green)";
    
    calculer();
}

function calculer() {
    const cat = document.getElementById('category').value;
    const poids = Math.max(0, parseFloat(document.getElementById('poids').value) || 0);
    const cass = document.getElementById('casserole').value;
    const alt = parseInt(document.getElementById('altitude').value);
    const tarifKwh = parseFloat(document.getElementById('tarifKwh').value) || 0.25;
    const stepList = document.getElementById('prepSteps');

    let volEau = 0; let poidsSel = 0; let tMinutes = 0; let whSaved = 0;
    let extraBoil = alt === 1000 ? 1 : (alt === 2000 ? 2 : 0);
    stepList.innerHTML = "";

    if (cat === 'pates') {
        const forme = document.getElementById('formePates').value;
        const tPaquet = parseInt(document.getElementById('tempsPaquet').value) || 0;
        const item = configPates[forme];

        volEau = (poids / 100) * item.ratio;
        poidsSel = Math.round(volEau * item.sel);
        tMinutes = Math.max(0, tPaquet + item.offset + (cass === 'legere' ? 1 : 0) - extraBoil);
        whSaved = Math.round(item.wh * (poids / 200)) - (extraBoil * 15);

        stepList.innerHTML += `<li>Mettre ${volEau.toFixed(2)}L d'eau et ${poidsSel}g de sel dans la casserole.</li>`;
        stepList.innerHTML += `<li>Porter à ébullition franche (100°C).</li>`;
        if (extraBoil > 0) {
            stepList.innerHTML += `<li>Jeter les pâtes. ⚠️ Altitude : <strong>Laisser bouillir activement ${extraBoil} minute(s)</strong> avant de couper le feu.</li>`;
        } else {
            stepList.innerHTML += `<li>Jeter les pâtes, remuer 30 secondes pour bloquer l'amidon en surface.</li>`;
        }
        stepList.innerHTML += `<li>Mettez impérativement un <strong>COUVERCLE hermétique</strong> et <strong>COUPEZ LE FEU</strong>.</li>`;
    } else {
        const grain = cat === 'riz'
            ? document.getElementById('typeRiz').value
            : document.getElementById('typeCereale').value;
        const item = configGrains[grain];

        volEau = (poids / 100) * item.ratio;
        poidsSel = Math.round(volEau * item.sel);
        let totalEbullition = item.ebullition + extraBoil;
        tMinutes = item.repos + (cass === 'legere' ? 1 : 0);
        whSaved = Math.round(item.wh * (poids / 200)) - (extraBoil * 15);

        stepList.innerHTML += `<li><strong>Préparation :</strong> ${item.prep}</li>`;
        stepList.innerHTML += `<li>${item.methode} (Eau : ${volEau.toFixed(2)}L, Sel : ${poidsSel}g).</li>`;
        if (totalEbullition > 0) {
            stepList.innerHTML += `<li>Laisser bouillir sur l'induction pendant exactement <strong>${totalEbullition} minutes</strong> sous couvercle.</li>`;
        } else {
            stepList.innerHTML += `<li>Dès l'ébullition de l'eau atteinte, jeter le grain.</li>`;
        }
        stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong>, gardez le couvercle fermé. Le grain va absorber l'eau.</li>`;
    }

    document.getElementById('eau').innerText = volEau.toFixed(2);
    document.getElementById('sel').innerText = poidsSel;
    document.getElementById('ecoWh').innerText = Math.max(0, whSaved);
    document.getElementById('ecoEur').innerText = (Math.max(0, whSaved) * (tarifKwh / 1000)).toFixed(2);

    if (!active) {
        sec = tMinutes * 60;
        showTime();
    }
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
function toggleInputs() {
    const cat = document.getElementById('category').value;
    document.getElementById('pates-options').style.display = (cat === 'pates') ? 'block' : 'none';
    document.getElementById('riz-options').style.display = (cat === 'riz') ? 'block' : 'none';
    document.getElementById('cereales-options').style.display = (cat === 'cereales') ? 'block' : 'none';

    active = false;
    clearInterval(inter);
    releaseWakeLock();
    document.getElementById('btn').innerText = "Lancer la cuisson passive";
    document.getElementById('btn').style.background = "var(--green)";
    calculer();
}
function showTime() {
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = (sec%60).toString().padStart(2,'0');
    document.getElementById('disp').innerText = `${m}:${s}`;
}

function tick() {
    const remaining = Math.round((endTimestamp - Date.now()) / 1000);
    sec = Math.max(0, remaining);
    showTime();
    if (remaining <= 0) {
        clearInterval(inter); active = false;
        const b = document.getElementById('btn');
        b.innerText = "Terminé !"; b.style.background = "#34495e";
        releaseWakeLock();
        localStorage.removeItem('pastawatts_end');
        declencherAlerteVocale();
    }
}

function toggle() {
    const b = document.getElementById('btn');
    if (active) {
        clearInterval(inter); active = false;
        b.innerText = "Reprendre la cuisson"; b.style.background = "var(--green)";
        releaseWakeLock();
        localStorage.removeItem('pastawatts_end');
    } else {
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
        }
        active = true; b.innerText = "PAUSE (Cuisson en cours...)"; b.style.background = "var(--red)";
        requestWakeLock();
        endTimestamp = Date.now() + sec * 1000;
        localStorage.setItem('pastawatts_end', endTimestamp);
        inter = setInterval(tick, 1000);
    }
}


function declencherAlerteVocale() {
    const cat = document.getElementById('category').value;
    let nomAliment = "votre préparation";
    if (cat === 'pates') nomAliment = "les pâtes";
    else if (cat === 'riz') nomAliment = "le riz";
    else nomAliment = "les céréales";

    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}

    setTimeout(() => {
        if ('speechSynthesis' in window) {
            const message = new SpeechSynthesisUtterance(`Attention, la cuisson passive pour ${nomAliment} est terminée. Veuillez égoutter ou servir immédiatement.`);
            message.lang = 'fr-FR'; window.speechSynthesis.speak(message);
        } else {
            alert(`⏰ Cuisson passive terminée pour ${nomAliment} !`);
        }
        calculer();
    }, 500);
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && active && wakeLock === null) {
        requestWakeLock();
    }
});

window.onload = () => {
    calculer();
    const savedEnd = localStorage.getItem('pastawatts_end');
    if (savedEnd) {
        endTimestamp = parseInt(savedEnd, 10);
        const remaining = Math.round((endTimestamp - Date.now()) / 1000);
        if (remaining > 0) {
            sec = remaining; showTime();
            active = true;
            const b = document.getElementById('btn');
            b.innerText = "PAUSE (Cuisson en cours...)"; b.style.background = "var(--red)";
            requestWakeLock();
            inter = setInterval(tick, 1000);
        } else {
            localStorage.removeItem('pastawatts_end');
        }
    }
};

