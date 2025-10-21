#  Documentation — US-11 : Tests et validation

##  Objectif
Cette User Story avait pour but de **valider le bon fonctionnement de l’ensemble de l’API**.  
Les tests ont porté sur les opérations CRUD, les endpoints personnalisés liés à TMDb,  
ainsi que sur la **cohérence des codes d’erreur** et la **gestion de l’authentification par token JWT**.

---

##  Méthode
Les tests ont été effectués manuellement avec **Thunder Client**.  
Chaque route a été testée dans différents scénarios :
- Données valides et invalides  
- Requêtes avec et sans authentification  
- Ressources existantes ou inexistantes  

Cela a permis d’observer le comportement réel du système face à plusieurs cas d’utilisation.

---

##  Résultats
Les tests CRUD sur les entités `movies` et `actors` se sont révélés concluants :  
toutes les opérations (création, lecture, mise à jour, suppression) fonctionnent avec les bons statuts HTTP.  

Les endpoints personnalisés TMDb (`/tmdb/popular` et `/tmdb/secure-popular`) répondent correctement :  
- Les données sont bien synchronisées avec l’API externe.  
- L’accès sécurisé exige un **token JWT** valide et renvoie une **401 Unauthorized** en cas d’absence ou d’erreur.  

Les erreurs 400, 404 et 500 sont renvoyées de manière claire et cohérente selon les situations testées.

---

##  Conclusion
L’ensemble des tests confirme la **stabilité et la fiabilité** du système.  
Les endpoints CRUD et TMDb fonctionnent comme prévu, les erreurs sont bien gérées  
et la sécurité JWT protège efficacement les routes sensibles.  


