document.addEventListener('DOMContentLoaded', ()=> {
        const footerElement = document.getElementsByClassName('cv-footer')[0];

        const footerElementContent = `
            <div class="cv-footer__top">
                  <div class="cv-footer__col cv-footer__col--nav">
      <img src="./src/assets/CineVerse_black.svg" alt="CineVerse" class="cv-footer__logo--small">

      <div class="cv-footer__col cv-footer__col--deco">
        <span class="cv-footer__deco-line"></span>
      </div>

      <div class="cv-footer__nav">
        <p class="cv-footer__nav-label"><strong>Navigation :</strong></p>
        <ul class="cv-footer__nav-list">
          <li><a class="is-active" href="#">Accueil</a></li>
          <li><a href="#">Catalogue</a></li>
          <li><a href="#">Artistes</a></li>
          <li><a href="#">À propos</a></li>
        </ul>
      </div>
    </div>

    <div class="cv-footer__col cv-footer__col--right">
      <p class="cv-footer__tagline">Découvrez, explorez et partagez<br>votre amour du 7ᵉ art.</p>

      <div class="cv-footer__socials" aria-label="Réseaux sociaux">
        <a href="#" aria-label="X / Twitter"><i class="fab fa-x-twitter"></i></a>
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      </div>

      <a href="#" class="cv-footer__contact">
        <span class="cv-footer__contact-slash">\\</span>Contact
      </a>
    </div>
  </div>

  <!--  Mentions -->
  <div class="cv-footer__legal">
    <nav class="cv-footer__legal-links">
      <a href="#">Mentions légales</a>
      <span class="sep">|</span>
      <a href="#">Politique de confidentialité</a>
      <span class="sep">|</span>
      <a href="#">Conditions d’utilisation</a>
      <span class="sep">|</span>
      <a href="#">Accessibilité</a>
    </nav>
  </div>

  <!-- Copyright -->
  <div class="cv-footer__bottom">
    <p class="cv-footer__copy">© 2025 <strong>CineVerse</strong> — Projet alternants - Simplon</p>
  </div>
            </div>
        `;

    if(footerElement) {
        footerElement.innerHTML = footerElementContent;
    }
})