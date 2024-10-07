// Fonction pour récupérer les projets sur l'API avec fetch
async function fetchWorks() {
  // Requête
  const response = await fetch("http://localhost:5678/api/works");
  // Convertit la réponse en objet json
  const jsonWorks = await response.json();
  // Retourne les données json des projets
  return jsonWorks;
}

// Fonction pour ajouter les projets à la gallerie
async function addWorks(works) {
  // Selectionne l'élément HTML qui possède la classe "gallery"
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  // Boucle sur chaque projet des données récupérer et l'ajoute à la gallerie avec innerHTML
  for (let i = 0; i < works.length; i++) {
    gallery.innerHTML += `<figure>
      <img src="${works[i].imageUrl}" alt="${works[i].title}">
			<figcaption>${works[i].title}</figcaption>
    </figure>`;
  }
}

// Fonction pour ajouter les boutons et leur donner un événement au clic
async function addButtons() {
  // Appelle la fonction fetWorks pour récupérer les projets
  const works = await fetchWorks();
  // Récupère la div .buttonsContainer pour lui ajouter les boutons par la suite
  const buttonsContainer = document.querySelector(".buttonsContainer");
  // Création du bouton "Tous"
  const allFilterButton = document.createElement("button");
  allFilterButton.innerText = "Tous";
  // Ajout d'un événement au clic qui appelle la fonction addWorks avec tous les projets en paramètre
  allFilterButton.addEventListener("click", function () {
    addWorks(works);
  });
  // Ajoute le bouton "tous" au HTML
  buttonsContainer.appendChild(allFilterButton);

  // Création d'un objet Set qui prend toute les catégories sans doublons
  const categories = new Set();
  for (let i = 0; i < works.length; i++) {
    categories.add(works[i].category.name);
  }
  // Création d'un bouton pour chaque catégorie
  for (const category of categories) {
    const filterButton = document.createElement("button");
    filterButton.innerText = category;
    // Ajout d'un événement au clic pour chaque bouton qui filtre les projets et les affiche
    filterButton.addEventListener("click", function () {
      // Filtre les projets pour n'avoir que les projets qui correspondent à leur catégorie avec .filter
      const filteredWorks = works.filter(function (work) {
        return work.category.name === category;
      });
      // Appelle la fonction addWorks avec les projets filtrés en paramètre
      addWorks(filteredWorks);
    });
    // Ajoute les boutons au HTML
    buttonsContainer.appendChild(filterButton);
  }
  // Appelle de la fonction addWorks avec tout les projets en paramètre pour qu'ils soient affichés quand on arrive sur la page
  addWorks(works);
}

// Appelle de la fonction addButtons pour afficher dynamiquement les boutons de filtres et les projets
addButtons();
