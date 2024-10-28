// Tableau pour stocker les projets
let works = [];

// Récupération des projets depuis l'API et affichage
fetchWorks().then(function (fetchedWorks) {
  works = fetchedWorks;
  displayWorksGallery(works);
  setupFilterButtons(works);
  displayWorksModal(works);
});

// Fonction pour récupérer les projets sur l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}

// Fonction pour afficher tous les projets à la galerie
function displayWorksGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach(displaySingleWork);
}

// Fonction pour afficher un projet individuel
function displaySingleWork(work) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
  `;
  gallery.appendChild(figure);
}

// Fonction pour créer les boutons de filtres
function setupFilterButtons(works) {
  const buttonsContainer = document.querySelector(".buttonsContainer");
  // Création du bouton par défaut
  const defaultFilterButton = document.createElement("button");
  defaultFilterButton.innerText = "Tous";
  buttonsContainer.appendChild(defaultFilterButton);
  defaultFilterButton.focus();
  // Fonctionnalité au clic
  defaultFilterButton.addEventListener("click", function () {
    displayWorksGallery(works);
  });
  // Création d'un bouton pour chaque catégorie
  const categories = new Set();
  for (let i = 0; i < works.length; i++) {
    categories.add(works[i].category.name);
  }
  for (const category of categories) {
    const filterButton = document.createElement("button");
    filterButton.innerText = category;
    // Fonctionnalité au clic
    filterButton.addEventListener("click", function () {
      // Filtre les projets pour n'avoir que les projets qui correspondent à leur catégorie
      const filteredWorks = works.filter(function (work) {
        return work.category.name === category;
      });
      displayWorksGallery(filteredWorks);
    });
    buttonsContainer.appendChild(filterButton);
  }
}

// Gestion de la déconnexion
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

// Gestion des modales d'éditions

const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const modal1Container = document.getElementById("modal1Container");
const modal2Container = document.getElementById("modal2Container");
const closeModalButton = document.querySelectorAll(".closeButton");
const openModalButton = document.querySelector(".modify");
const openModal2Button = document.querySelector(".openModal2");
const previousButton = document.querySelector(".previousButton");
// Ouverture modale1
openModalButton.addEventListener("click", function () {
  modal1.classList.remove("hide");
});
// Ouverture modale2
openModal2Button.addEventListener("click", function () {
  modal1.classList.add("hide");
  modal2.classList.remove("hide");
});
// Retour à la modale1
previousButton.addEventListener("click", function () {
  modal1.classList.remove("hide");
  modal2.classList.add("hide");
});
// Fermeture sur le bouton
closeModalButton.forEach(function (button) {
  button.addEventListener("click", function () {
    modal1.classList.add("hide");
    modal2.classList.add("hide");
  });
});
// Fermeture en dehors de la modale
modal1.addEventListener("click", function (event) {
  if (!modal1Container.contains(event.target)) {
    modal1.classList.add("hide");
  }
});
modal2.addEventListener("click", function (event) {
  if (!modal2Container.contains(event.target)) {
    modal2.classList.add("hide");
  }
});

// Gestion de la modale 1 (suppression de projets)

// Fonction pour afficher tous les projets dans la modale
function displayWorksModal(works) {
  const galleryModal1 = document.querySelector(".photosContainer");
  galleryModal1.innerHTML = "";
  works.forEach((work) => displaySingleWorkModal(work));
}

// Fonction pour afficher un seul projet dans la modale
function displaySingleWorkModal(work) {
  const galleryModal1 = document.querySelector(".photosContainer");
  const div = document.createElement("div");
  div.classList.add("photoContainer");
  div.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <button class="deleteButton" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>`;
  galleryModal1.appendChild(div);
  // Ajout de l'événement de suppression au bouton
  div.querySelector(".deleteButton").addEventListener("click", async function () {
    await deleteWorks(work.id);
  });
}

// Fonction pour supprimer les projets via l'API
async function deleteWorks(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("logToken")}`,
      },
    });
    if (response.ok) {
      works = works.filter(function (work) {
        return work.id !== id;
      });
      displayWorksGallery(works);
      displayWorksModal(works);
      modal1.classList.add("hide");
      alert("Projet supprimé avec succès.");
    } else {
      alert("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}

// Gestion de la modale 2 (ajout de projets)

// Prévisualisation de la photo dans le formulare d'ajout
const photoInput = document.getElementById("photoInput");
photoInput.addEventListener("change", function (event) {
  const photo = event.target.files[0];
  if (photo) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const previewPhoto = document.getElementById("previewPhoto");
      previewPhoto.src = event.target.result;
      previewPhoto.classList.remove("hide");
    };
    reader.readAsDataURL(photo);
  }
});

// Fonction pour récupération les catégories depuis l'API
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}

// Fonction pour afficher les catégories dans le formulaire
async function displayFormCategories() {
  const categories = await fetchCategories();
  const categoriesInput = document.getElementById("category");
  categoriesInput.innerHTML = "";
  for (const category of categories) {
    categoriesInput.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  }
}
displayFormCategories();

// Gestion de l'ajout des projets

const addWorksForm = document.querySelector(".addWorksForm");
// Change la couleur du bouton de validation quand tous les input sont remplis
addWorksForm.addEventListener("input", function () {
  const workPhoto = document.getElementById("photoInput").files[0];
  const workTitle = document.getElementById("title").value;
  const workCategory = document.getElementById("category").value;
  const validateButton = document.querySelector(".buttonValidateModal2");
  if (workPhoto && workTitle && workCategory) {
    validateButton.classList.add("green");
  } else {
    validateButton.classList.remove("green");
  }
});
// Soumission du formulaire d'ajout
addWorksForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const workPhoto = document.getElementById("photoInput").files[0];
  const workTitle = document.getElementById("title").value;
  const workCategory = parseInt(document.getElementById("category").value);
  if (!workPhoto || !workTitle || !workCategory) {
    alert("Attention, tous les champs sont requis !");
    return;
  }
  const formData = new FormData();
  formData.append("title", workTitle);
  formData.append("image", workPhoto);
  formData.append("category", workCategory);
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("logToken")}` },
      body: formData,
    });
    if (response.ok) {
      const newWork = await response.json();
      works.push(newWork);
      displayWorksGallery(works);
      displayWorksModal(works);
      modal2.classList.add("hide");
      alert("Projet ajouté avec succès.");
    } else {
      alert("Une erreur est survenue lors de l'ajout. Veuillez réessayer.");
    }
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
});
