document.addEventListener('DOMContentLoaded', () => {
  const headerElement = document.querySelector('.header');
  if (!headerElement) return;

  headerElement.innerHTML = `
    <div class="header-container">
      <a href="./index.html" class="logo">
        <img src="./src/assets/CineVerse.svg" alt="Logo CineVerse">
      </a>

      <nav class="navbar">
        <ul class="nav-links">
          <li><a href="./index.html">Accueil</a></li>
          <li><a href="./catalogue.html">Catalogue</a></li>
          <li><a href="./artistes.html">Artistes</a></li>
          <li><a href="./apropos.html">À propos</a></li>
        </ul>
      </nav>

      <div class="search-wrapper">
        <button class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        <input type="text" class="search-input" placeholder="Rechercher un film, un artiste...">
      </div>

      <div class="user-section desktop-user">
        <button id="login-btn" class="user-btn">Se connecter</button>
        <div id="user-info" class="user-info" style="display:none;">
          <span id="user-greeting"></span>
          <button id="logout-btn" class="logout-btn">Se déconnecter</button>
        </div>
      </div>

      <div class="burger"><span></span><span></span><span></span></div>
    </div>

    <div class="mobile-menu">
      <div class="mobile-search">
        <button class="search-btn"><i class="fas fa-search"></i></button>
        <input type="text" placeholder="Rechercher...">
      </div>
      <ul>
        <li><a href="./index.html">Accueil</a></li>
        <li><a href="./catalogue.html">Catalogue</a></li>
        <li><a href="./artistes.html">Artistes</a></li>
        <li><a href="./apropos.html">À propos</a></li>
      </ul>

      <!-- ✅ Bloc utilisateur ajouté pour le menu mobile -->
      <div class="user-section mobile-user">
        <button id="login-btn-mobile" class="user-btn">Se connecter</button>
        <div id="user-info-mobile" class="user-info" style="display:none;">
          <span id="user-greeting-mobile"></span>
          <button id="logout-btn-mobile" class="logout-btn">Se déconnecter</button>
        </div>
      </div>
    </div>

    <hr class="borderheader">
  `;

  setTimeout(() => {
    // === Menu burger ===
    const burger = headerElement.querySelector('.burger');
    const mobileMenu = headerElement.querySelector('.mobile-menu');
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });
    }

    // === Lien actif ===
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    headerElement.querySelectorAll(".nav-links a, .mobile-menu a").forEach(link => {
      if (link.getAttribute("href").includes(currentPage)) {
        link.classList.add("active");
      }
    });

    // === Barre de recherche desktop ===
    const searchInput = headerElement.querySelector('.search-input');
    const searchButton = headerElement.querySelector('.search-btn');
    if (searchInput && searchButton) {
      const goToSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;
        window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
      };
      searchButton.addEventListener('click', goToSearch);
      searchInput.addEventListener('keydown', (e) => e.key === 'Enter' && goToSearch());
    }

    // === Gestion utilisateur (desktop + mobile) ===
    const setups = [
      {
        login: headerElement.querySelector('#login-btn'),
        info: headerElement.querySelector('#user-info'),
        greeting: headerElement.querySelector('#user-greeting'),
        logout: headerElement.querySelector('#logout-btn')
      },
      {
        login: headerElement.querySelector('#login-btn-mobile'),
        info: headerElement.querySelector('#user-info-mobile'),
        greeting: headerElement.querySelector('#user-greeting-mobile'),
        logout: headerElement.querySelector('#logout-btn-mobile')
      }
    ];

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    let username = localStorage.getItem('username');

    if (!username) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        username = storedUser?.username || storedUser?.email || storedUser?.name;
      } catch (_) {}
    }

    setups.forEach(set => {
      if (!set.login || !set.info || !set.greeting || !set.logout) return;

      if (token && username) {
        set.login.style.display = 'none';
        set.info.style.display = 'flex';
        set.greeting.textContent = `Bonjour, ${username} 👋`;
      } else {
        set.login.style.display = 'inline-block';
        set.info.style.display = 'none';
        set.login.addEventListener('click', () => {
          window.location.href = './auth.html';
        });
      }

      set.logout.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        window.location.reload();
      });
    });
  }, 50);
});
