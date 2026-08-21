# 🌱 PastaWatts — L'Assistant de Cuisson Passive & Éco-Responsable

**PastaWatts** est une application web ultra-légère conçue pour optimiser la cuisson des pâtes, du riz et des céréales sur plaque à induction en utilisant les lois de la thermodynamique et de la biochimie alimentaire. 

L'objectif : **diviser par deux la consommation d'énergie en cuisine tout en garantissant une qualité nutritionnelle maximale (Index Glycémique bas).**

---

## 🔬 La Science derrière PastaWatts

La cuisson conventionnelle (laisser le feu allumé à 100°C pendant 10 minutes) est un non-sens énergétique et nutritionnel. 

### 1. Le verrouillage des protéines (Gluten)
Pour que des pâtes conservent un **Index Glycémique (IG) bas**, les protéines (le gluten) doivent coaguler pour former une barrière physique solide autour de l'amidon. Cette polymérisation se produit dès que l'eau atteint **80°C à 85°C**. 
En jetant les pâtes à 100°C puis en coupant immédiatement le feu sous un couvercle fermé, le gluten se fige instantanément. Grâce à l'inertie thermique calculée par l'application, l'eau reste au-dessus de 80°C pendant toute la durée du repos, maintenant l'amidon prisonnier. Les pâtes restent fermes, ne collent pas, et se comportent comme des sucres lents dans l'organisme.

### 2. L'optimisation ionique (Le Sel)
Le sel de cuisine n'est pas qu'un exhausteur de goût. Les ions $Na^+$ et $Cl^-$ forcent les liaisons hydrophobes du gluten à se resserrer. À basse température, une concentration précise de **10g de sel par litre d'eau** agit comme un substitut partiel à la chaleur pour aider le réseau protéique à se structurer.

### 3. La méthode par absorption pour les grains
Pour le riz et les pseudo-céréales (quinoa, boulgour), l'application applique la méthode par absorption complète. Le grain absorbe 100 % de l'eau. Cela permet non seulement d'économiser l'énergie, mais aussi de **conserver l'intégralité des vitamines hydrosolubles (groupe B) et des minéraux**, qui finissent habituellement à l'égout lors d'une cuisson conventionnelle.

---

## 📊 Fonctionnalités de l'Application

*   **Ratios précis et corrigés** : Calcule le volume d'eau minimal nécessaire pour maintenir l'inertie thermique sans gaspillage (ex: 0,90L pour 60g de pâtes).
*   **Prise en compte de la forme** : Ajuste le temps de repos selon la géométrie des pâtes (les pâtes épaisses comme les Penne conservent mieux la chaleur que les spaghettis fins).
*   **Compensation du contenant** : Ajoute automatiquement du temps de repos si vous utilisez une casserole légère en aluminium qui perd vite ses calories.
*   **Compteur Éco en temps réel** : Affiche l'énergie économisée (Wh), l'argent économisé (Euros) et l'empreinte carbone évitée (g de CO₂).
*   **Minuteur intégré** : Alerte sonore et visuelle native pour stopper l'hydratation de l'amidon au moment exact.

---

## 🛠️ Structure du Projet

Le projet est développé en technologies web natives (sans framework) pour garantir une vitesse de chargement instantanée sur smartphone :

*   `index.html` : Structure de l'interface et des menus dynamiques.
*   `style.css` : Design moderne, épuré et adapté aux mobiles (Responsive).
*   `app.js` : Moteur de calcul biochimique et logique de la minuterie.

---


## 🌱 Impact Écologique

En éteignant votre plaque à induction dès le début de la cuisson, vous économisez environ **150 à 300 Wh par repas**. À l'échelle d'un foyer sur une année, cela représente une baisse significative de la consommation d'électricité et plusieurs kilogrammes de CO₂ évités.

*PastaWatts : Cuisinez intelligemment, économisez simplement.*
