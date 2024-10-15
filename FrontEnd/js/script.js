/*

Affichage des projets

*/

// Fonction pour récupérer les projets sur l'API avec fetch
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    console.error(error.message);
    alert("Erreur HTTP, impossible de récupérer les projets. Veuillez réessayer plus tard");
  }
}

// Fonction pour afficher les projets à la galerie
async function addWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    gallery.innerHTML += `<figure>
      <img src="${works[i].imageUrl}" alt="${works[i].title}">
			<figcaption>${works[i].title}</figcaption>
    </figure>`;
  }
}

// Création du bouton par défaut "tous"
fetchWorks().then(function (works) {
  // Affiche tous les projets par défaut
  addWorks(works);
  // Création du bouton
  const buttonsContainer = document.querySelector(".buttonsContainer");
  const allFilterButton = document.createElement("button");
  allFilterButton.innerText = "Tous";
  buttonsContainer.appendChild(allFilterButton);
  allFilterButton.focus();
  // Affichage au clic
  allFilterButton.addEventListener("click", function () {
    addWorks(works);
  });
});

// Création des boutons qui filtrent par catégories
// Création d'un objet Set qui prend toutes les catégories sans doublons
fetchWorks().then(function (works) {
  const buttonsContainer = document.querySelector(".buttonsContainer");
  const categories = new Set();
  for (let i = 0; i < works.length; i++) {
    categories.add(works[i].category.name);
  }
  // Création d'un bouton pour chaque catégorie
  for (const category of categories) {
    const filterButton = document.createElement("button");
    filterButton.innerText = category;
    // Affichage au clic
    filterButton.addEventListener("click", function () {
      // Filtre les projets pour n'avoir que les projets qui correspondent à leur catégorie
      const filteredWorks = works.filter(function (work) {
        return work.category.name === category;
      });
      addWorks(filteredWorks);
    });
    buttonsContainer.appendChild(filterButton);
  }
});

// Déconnexion

const logOut = document.getElementById("logOut");
logOut.addEventListener("click", function () {
  if (localStorage.getItem("logToken")) {
    localStorage.removeItem("logToken");
  }
});

//  Affichage des éléments présents en mode edit

const editModeElements = document.querySelectorAll(".editMode");
editModeElements.forEach(function (element) {
  if (localStorage.getItem("logToken")) {
    element.classList.toggle("hide");
  }
});

// Gestion de l'ouverture de la fermeture de la modal d'édition

const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modalContainer");
const closeModalButton = document.querySelector(".closeButton");
const openModalButton = document.querySelector(".modify");
// Ouverture
openModalButton.addEventListener("click", function () {
  document.querySelector(".modal").classList.remove("hide");
});
// Fermeture sur le bouton
closeModalButton.addEventListener("click", function () {
  document.querySelector(".modal").classList.add("hide");
});
// Fermeture en dehors de la modal
modal.addEventListener("click", function (event) {
  const modalContainer = document.querySelector(".modalContainer");
  if (!modalContainer.contains(event.target)) {
    modal.classList.add("hide");
  }
});
