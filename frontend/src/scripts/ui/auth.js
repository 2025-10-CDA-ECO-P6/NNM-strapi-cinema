document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  const API_URL = "http://localhost:1337/api/auth"; 

  // 🔁 Bascule entre les formulaires
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms("register");
  });

  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms("login");
  });

  function toggleForms(type) {
    if (type === "register") {
      loginForm.classList.remove("active");
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
      setTimeout(() => registerForm.classList.add("active"), 100);
    } else {
      registerForm.classList.remove("active");
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      setTimeout(() => loginForm.classList.add("active"), 100);
    }
  }

  // 🧾 Inscription réelle (POST /api/auth/local/register)
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    try {
      const response = await fetch(`${API_URL}/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Compte créé avec succès !");
        toggleForms("login");
      } else {
        alert(`❌ Erreur : ${data.error?.message || "Échec de l'inscription"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur de connexion au serveur");
    }
  });

  // 🔑 Connexion réelle (POST /api/auth/local)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
      const response = await fetch(`${API_URL}/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.jwt) {
        // ✅ Stocke le token et l’utilisateur
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirection vers l’accueil
        window.location.href = "index.html";
      } else {
        alert(`❌ ${data.error?.message || "Identifiants incorrects"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur de connexion au serveur");
    }
  });
});
