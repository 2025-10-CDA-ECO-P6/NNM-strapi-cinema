# User Journeys - Projet **CineVerse**

## Objectif
Cartographier les user journeys clés du projet CineVerse afin de garantir une navigation fluide, une expérience utilisateur cohérente et une interaction intuitive entre les différents profils d’utilisateurs identifiés.  

Ces parcours se basent sur les 3 personas du projet :  
1. Jane Doe — Responsable Catalogue (interne, back-office Strapi)  
2. Jon Doe — Cinéphile (utilisateur externe du site vitrine)  
3. Karim Bensalem — Développeur Full-Stack (équipe technique)  

## 👤 Persona 1 : Jane Doe — Responsable Catalogue CineVerse  
> **Objectif :** Mettre à jour le catalogue et assurer la cohérence des contenus.  

### Parcours : Mise à jour d’une fiche film dans Strapi  
1. Se connecte au back-office Strapi  
→ Émotion : Concentrée  
→ Irritant : Chargement lent  

2. Accède à la liste des films  
→ Émotion : À l’aise  
→ Irritant : Recherche peu claire  

3. Sélectionne un film à modifier  
→ Émotion : Attentive  
→ Irritant : Interface dense  

4. Modifie les champs (titre, résumé, casting)  
→ Émotion : Confortable  
→ Irritant : Validation manuelle lente  

5. Enregistre les modifications  
→ Émotion : Satisfaite  
→ Irritant : Confirmation peu visible  

6. Vérifie sur le site front  
→ Émotion : Fière  
→ Irritant : Délai de synchronisation API  

---

## 👤 Persona 1 : Jon Doe — Cinéphile
> **Objectif :** Découvrir, consulter et rechercher des films ou acteurs.

### Parcours 1 : Consultation d’un film

1. Arrive sur la page d’accueil (films populaires)  
→ Émotion : Curieux  
→ Irritant : Trop d’infos visibles  

2. Clique sur une affiche  
→ Émotion : Enthousiaste  
→ Irritant : Lenteur de chargement  

3. Consulte la fiche du film  
→ Émotion : Satisfait  
→ Irritant : Casting incomplet  

4. Explore la section “Acteurs associés”  
→ Émotion : Intéressé  
→ Irritant : Images manquantes  

5. Clique sur un acteur  
→ Émotion : Engagé  
→ Irritant : Pas de bouton retour  

6. Retour à la page d’accueil  
→ Émotion : Fluide  
→ Irritant : Rechargement en haut de page  

### Parcours 2 : Recherche d’un acteur

1. Ouvre la barre de recherche
→ Émotion : Motivé  
→ Irritant : Champ mal positionné  

2. Tape le nom d’un acteur  
→ Émotion : Concentré  
→ Irritant : Pas d’autocomplétion  

3. Consulte les résultats  
→ Émotion : Intéressé  
→ Irritant : Données incomplètes  

4. Sélectionne un acteur  
→ Émotion : Enthousiaste  
→ Irritant : Mauvais mapping des résultats  

5. Consulte la filmographie  
→ Émotion : Curieux  
→ Irritant : Liens non cliquables  

6. Clique sur un film associé  
→ Émotion : Engagé  
→ Irritant : Navigation de retour confuse  

---

## 👤 Persona 1 : Karim Bensalem — Développeur Full-Stack

> **Objectif :** Maintenir la stabilité technique du CMS, des endpoints et du CI/CD.

### Parcours 1 : Création et test d’un endpoint API

1. Récupère la dernière version du projet  
→ Émotion : Confiant  
→ Irritant : Conflits de merge  

2. Implémente un nouvel endpoint TMDb  
→ Émotion : Concentré  
→ Irritant : Docs incomplètes  

3. Teste la route dans Postman  
→ Émotion : Satisfait  
→ Irritant : JWT expiré  

4. Lance les tests automatiques  
→ Émotion : Confiant  
→ Irritant : Temps d’exécution long  

5. Vérifie les logs Strapi  
→ Émotion : Curieux  
→ Irritant : Trop verbeux  

6. Présente la démo à l’équipe  
→ Émotion : Fier  
→ Irritant : Environnement non synchro  

---

## Synthèse  
### Jane Doe - Responsable Catalogue CineVerse  
Connexion → Liste → Édition → Save → Vérif  

### Jon Doe - Responsable Catalogue CineVerse  
Accueil → Film → Casting → Acteur → Retour  

## Karim Bensalem - Développeur Full-Stack  
Git Pull → Endpoint → Test → CI/CD → Logs → Démo  
