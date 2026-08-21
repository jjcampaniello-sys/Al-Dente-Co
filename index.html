<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoCuisson Pro - L'Assistant Passif</title>
    <style>
        :root { --bg: #f5f7fa; --card: #ffffff; --text: #2c3e50; --green: #27ae60; --red: #e74c3c; }
        body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 20px; display: flex; justify-content: center; }
        .container { max-width: 480px; width: 100%; background: var(--card); padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        h1 { text-align: center; color: var(--green); margin-bottom: 20px; font-size: 24px; }
        .group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 6px; font-size: 14px; }
        select, input { width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 15px; }
        .box { background: #f8fafc; border-left: 4px solid var(--green); padding: 15px; border-radius: 4px; margin-top: 15px; }
        .eco-badge { background: #e8f8f5; color: var(--green); padding: 10px; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 10px; text-align: center; border: 1px solid #a3e4d7; }
        .timer { font-size: 54px; font-weight: bold; text-align: center; margin: 15px 0; font-variant-numeric: tabular-nums; }
        button { width: 100%; padding: 14px; background: var(--green); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
        button:hover { filter: brightness(0.9); }
    </style>
</head>
<body>

<div class="container">
    <h1>🌱 EcoCuisson Pro</h1>
    
    <div class="group">
        <label for="aliment">Aliment :</label>
        <select id="aliment" onchange="calculer()">
            <option value="pates_blanches">Pâtes Blanches</option>
            <option value="pates_completes">Pâtes Complètes</option>
            <option value="riz_blanc">Riz Blanc / Basmati</option>
            <option value="riz_complet">Riz Complet</option>
        </select>
    </div>

    <div class="group" id="p_time">
        <label for="tempsPaquet">Temps paquet (min) :</label>
        <input type="number" id="tempsPaquet" value="9" min="1" oninput="calculer()">
    </div>

    <div class="group">
        <label for="poids">Masse de l'aliment (g) :</label>
        <input type="number" id="poids" value="200" min="10" oninput="calculer()">
    </div>

    <div class="group">
        <label for="casserole">Type de casserole (Inertie) :</label>
        <select id="casserole" onchange="calculer()">
            <option value="lourde">Fonte / Inox Épais (Garde bien le chaud)</option>
            <option value="legere">Alu fin / Inox Léger (+1 min de repos requis)</option>
        </select>
    </div>

    <div class="box">
        <strong>💧 Eau :</strong> <span id="eau">3.00</span> L | 
        <strong>🧂 Sel :</strong> <span id="sel">30</span> g
        <div style="margin-top: 8px; font-size: 13px; color: #64748b;" id="prep"></div>
        
        <div class="eco-badge">
            📉 Économie : ~<span id="ecoWh">0</span> Wh soit <span id="ecoEur">0.00</span>€ (<span id="ecoCo2">0</span>g CO₂)
        </div>
    </div>

    <div class="timer" id="disp">00:00</div>
    <button id="btn" onclick="toggle()">Démarrer la cuisson passive</button>
</div>

<script>
const data = {
    pates_blanches: { ratio: 15, sel: 10, prep: "Jeter à 100°C avec le sel, remuer 30s, mettre le COUVERCLE et COUPER le feu.", t: (p) => p + 3, wh: 165 },
    pates_completes: { ratio: 15, sel: 10, prep: "Jeter à 100°C avec le sel, remuer 30s, mettre le COUVERCLE et COUPER le feu.", t: (p) => p + 5, wh: 180 },
    riz_blanc: { ratio: 1.5, sel: 5, prep: "Rincer 3 fois. Eau froide + Riz au départ. Porter à ébullition 2 min avec couvercle, puis COUPER le feu.", t: () => 12, wh: 150 },
    riz_complet: { ratio: 2.0, sel: 5, prep: "Rincer. Eau froide + Riz au départ. Porter à ébullition 5 min avec couvercle, puis COUPER le feu.", t: () => 25, wh: 300 }
};

let sec = 0, active = false, inter = null;

function calculer() {
    const type = document.getElementById('aliment').value;
    const poids = parseFloat(document.getElementById('poids').value) || 0;
    const tPaquet = parseInt(document.getElementById('tempsPaquet').value) || 0;
    const cass = document.getElementById('casserole').value;
    const item = data[type];

    document.getElementById('p_time').style.display = type.startsWith('pates') ? 'block' : 'none';

    let volEau = type.startsWith('pates') ? (poids/100)*item.ratio : (poids/100)*(item.ratio*0.1);
    let tMinutes = item.t(tPaquet) + (cass === 'legere' ? 1 : 0);

    document.getElementById('eau').innerText = volEau.toFixed(2);
    document.getElementById('sel').innerText = Math.round(volEau * item.sel);
    document.getElementById('prep').innerText = item.prep;

    // Calculs éco basés sur des moyennes standard d'une plaque à induction (Tarif moyen UE)
    let whSaved = Math.round(item.wh * (poids / 200));
    document.getElementById('ecoWh').innerText = whSaved;
    document.getElementById('ecoEur').innerText = (whSaved * 0.00025).toFixed(3); // Base de 0.25€ le kWh
    document.getElementById('ecoCo2').innerText = Math.round(whSaved * 0.05); // Base moyenne européenne de 50g CO2 / kWh

    if (!active) { sec = tMinutes * 60; showTime(); }
}

function showTime() {
    document.getElementById('disp').innerText = `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
}

function toggle() {
    const b = document.getElementById('btn');
    if (active) {
        clearInterval(inter); active = false; b.innerText = "Reprendre"; b.style.background = "var(--green)";
    } else {
        active = true; b.innerText = "PAUSE"; b.style.background = "var(--red)";
        inter = setInterval(() => {
            sec--; showTime();
            if (sec <= 0) {
                clearInterval(inter); active = false; b.innerText = "Terminé !"; b.style.background = "#34495e";
                new (window.AudioContext || window.webkitAudioContext)().createOscillator().connect(window.AudioContext ? new AudioContext().destination : {}); 
                alert("⏰ Cuisson passive terminée ! Égouttez vite pour préserver les nutriments.");
                calculer();
            }
        }, 1000);
    }
}
window.onload = calculer;
</script>
</body>
</html>
