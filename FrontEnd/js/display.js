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
