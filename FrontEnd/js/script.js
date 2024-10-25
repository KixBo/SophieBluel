// Affichage des projets

fetchWorks().then(function (works) {
  displayWorks(works);
  setupFilterButtons(works);
  displayWorksModal(works);
});

// Fonction pour récupérer les projets sur l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}

// Fonction pour afficher les projets à la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    gallery.innerHTML += `<figure>
      <img src="${works[i].imageUrl}" alt="${works[i].title}">
			<figcaption>${works[i].title}</figcaption>
    </figure>`;
  }
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
    displayWorks(works);
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
      displayWorks(filteredWorks);
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

// Fonction pour afficher les projets dans la modale
function displayWorksModal(works) {
  const galleryModal1 = document.querySelector(".photosContainer");
  galleryModal1.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    galleryModal1.innerHTML += `<div class="photoContainer"><img src="${works[i].imageUrl}" alt="${works[i].title}">
  <button class="deleteButton" data-id="${works[i].id}"><i class="fa-solid fa-trash-can"></i></button></div>`;
  }
  // Fonctionnalité des boutons de suppression
  const deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const id = event.currentTarget.dataset.id;
      deleteWorks(id);
    });
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
      const updatedWorks = await fetchWorks();
      displayWorks(updatedWorks);
      displayWorksModal(updatedWorks);
      alert("Projet supprimé avec succès.");
    } else {
      alert("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}

// Gestion de la modale 2 (ajout de projets)

// Ajout dynamique des catégories
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    const categoriesInput = document.getElementById("category");
    for (const category of categories) {
      categoriesInput.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    }
  } catch {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
}
getCategories();

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
      alert("Projet ajouté avec succès.");
      const updatedWorks = await fetchWorks();
      displayWorks(updatedWorks);
      displayWorksModal(updatedWorks);
      modal2.classList.add("hide");
    } else {
      alert("Une erreur est survenu lors de l'ajout. Veuillez réessayer.");
    }
  } catch (error) {
    alert("Un problème est survenu. Veuillez réessayer plus tard.");
  }
});
