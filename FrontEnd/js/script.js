/* Fonction pour récupérer les projets sur l'API avec fetch */
async function fetchWorks() {
  /* Requête */
  const response = await fetch("http://localhost:5678/api/works");
  /* Convertit la réponse en objet json */
  const fetchWorks = await response.json();
  /* Retourne les données json des projets */
  return fetchWorks;
}

/* Fonction pour ajouter les projets à la gallerie */
async function addWorks() {
  /* Appelle la fonction fetchWorks pour récupérer les données des projets au format json */
  const works = await fetchWorks();
  /* Selectionne l'élément HTML qui possède la classe "gallery" */
  const gallery = document.querySelector(".gallery");
  /* Boucle sur chaque projet des données récupérer et l'ajoute à la gallerie avec innerHTML */
  for (let i = 0; i < works.length; i++) {
    gallery.innerHTML += `<figure>
      <img src="${works[i].imageUrl}" alt="${works[i].title}">
			<figcaption>${works[i].title}</figcaption>
    </figure>`;
  }
}

/* Appelle la fonction addWorks pour afficher les projets */
addWorks();
