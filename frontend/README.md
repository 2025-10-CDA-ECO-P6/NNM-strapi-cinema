# CineVerse — Front-end (Vitrine)

## Objectif du front-end  

Le front-end du projet **CineVerse** a pour objectif de proposer une **interface vitrine** permettant de visualiser et de parcourir les **films** et **acteurs** gérés par le back-end Strapi.

Cette interface permet :
- de **présenter le catalogue** des films importés depuis TMDb,
- d’**afficher dynamiquement** les informations issues de l’API Strapi,
- de **valoriser l’expérience utilisateur** à travers un design responsive et épuré.

---
## Charte Graphique 
![Charte Graphique](../docs/charte_graphique/Charte_graphique.jpg)

## Charte Colorimétrique  
1. Noir profond : #0C0C0C  
2. Jaune cinéma : #FFD43B  
3. Gris clair : #B0B0B0  
4. Blanc cassé : #F5F5F5  
5. Rouge foncé : #A4161A  

## Charte Typographique 
Titre : Poppins Bold  
Texte : Roboto Regular  

---

## Architecture du projet  
```bash
frontend/
├── src/
│   ├── assets/            → Images, polices, icônes
│   ├── components/        → Composants UI (cartes, header, footer)
│   ├── pages/             → Pages principales (films, acteurs)
│   ├── scripts/           → JS (API, interactions)
│   ├── styles/            → Feuilles de style globales et modulaires
│   │   ├── main.css       → Fichier principal importé dans index.html
│   │   ├── variables.css  → Couleurs, typographies, etc.
│   │   └── components/    → CSS spécifiques (header.css, footer.css, etc.)
│   └── index.html         → Page d’entrée principale
```