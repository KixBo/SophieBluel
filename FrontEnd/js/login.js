// Soumission du formulaire de connexion

const loginForm = document.querySelector(".logIn form");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Objet dont les propriétés sont les valeurs saisies dans le formulaire
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Stocke le token d'authentification dans le localstorage
      const responseJson = await response.json();
      window.localStorage.setItem("logToken", responseJson.token);
      // Redirection
      window.location.href = "index.html";
    } else {
      alert("Email ou mot de passe incorrect. Veuillez réessayer.");
    }
  } catch (error) {
    console.error(error.message);
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
});
