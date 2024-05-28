document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("employee-form");
    const tableBody = document.getElementById("employee-table").querySelector("tbody");
    const modal = document.getElementById("myModal");
    const editModal = document.getElementById("editModal");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const closeModalButtons = document.querySelectorAll(".modal .close, .modal .close-modal");
    const editForm = document.getElementById("editForm");

    // Charger les données sauvegardées lors du chargement de la page
    loadSavedData();

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Pour éviter le rechargement de la page

        // Récupération des valeurs du formulaire
        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const telephone = document.getElementById("telephone").value;
        const departement = document.getElementById("departement").value;
        const id = Date.now(); // Identifiant unique basé sur l'horodatage actuel

        // Création d'une nouvelle ligne dans le tableau
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-id", id); // Définir l'identifiant unique comme attribut de données
        newRow.innerHTML = `
            <td>${nom}</td>
            <td>${prenom}</td>
            <td>${telephone}</td>
            <td>${departement}</td>
            <td>
                <button class="edit">Modifier</button>
                <button class="delete">Supprimer</button>
            </td>
        `;

        // Ajout de la nouvelle ligne au tableau
        tableBody.appendChild(newRow);

        // Sauvegarder les données dans le stockage local
        saveDataToLocalStorage(id, nom, prenom, telephone, departement);

        // Effacer les valeurs du formulaire après soumission
        form.reset();
    });

    // Ajouter un gestionnaire d'événements pour les boutons de suppression et de modification
    tableBody.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete")) {
            // Afficher le modal de confirmation de suppression
            modal.style.display = "block";

            // Récupérer la ligne parente du bouton de suppression
            const row = event.target.closest("tr");

            // Gestionnaire d'événement pour le bouton "Oui" du modal
            confirmDeleteButton.addEventListener("click", function() {
                // Supprimer la ligne du tableau
                row.remove();
                // Fermer le modal
                modal.style.display = "none";
                // Mettre à jour les données sauvegardées
                updateSavedData();
            });
        } else if (event.target.classList.contains("edit")) {
            // Récupérer les données de l'employé à partir de la ligne du tableau
            const row = event.target.closest("tr");
            const id = row.getAttribute("data-id"); // Obtenir l'identifiant unique
            const cells = row.querySelectorAll("td");
            const nom = cells[0].textContent;
            const prenom = cells[1].textContent;
            const telephone = cells[2].textContent;
            const departement = cells[3].textContent;

            // Remplir le formulaire de modification avec les données de l'employé
            document.getElementById("edit-nom").value = nom;
            document.getElementById("edit-prenom").value = prenom;
            document.getElementById("edit-telephone").value = telephone;
            document.getElementById("edit-departement").value = departement;
            document.getElementById("edit-id").value = id; // Stocker l'identifiant unique dans un champ d'entrée masqué

            // Afficher le modal de modification
            editModal.style.display = "block";
        }
    });

    // Gestionnaire d'événement pour les boutons de fermeture du modal
    closeModalButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            modal.style.display = "none"; // Fermer le modal de suppression
            editModal.style.display = "none"; // Fermer le modal de modification
        });
    });

    // Gestionnaire d'événement pour le formulaire de modification
    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Récupérer les nouvelles valeurs du formulaire de modification
        const newNom = document.getElementById("edit-nom").value;
        const newPrenom = document.getElementById("edit-prenom").value;
        const newTelephone = document.getElementById("edit-telephone").value;
        const newDepartement = document.getElementById("edit-departement").value;
        const id = document.getElementById("edit-id").value; // Obtenir l'identifiant unique

        // Trouver la ligne correspondante en fonction de l'identifiant unique
        const editedRow = tableBody.querySelector(`tr[data-id="${id}"]`);

        if (editedRow) {
            // Mettre à jour les données de l'employé dans le tableau
            editedRow.innerHTML = `
                <td>${newNom}</td>
                <td>${newPrenom}</td>
                <td>${newTelephone}</td>
                <td>${newDepartement}</td>
                <td>
                    <button class="edit">Modifier</button>
                    <button class="delete">Supprimer</button>
                </td>
            `;
            editedRow.setAttribute("data-id", id); // Assurer que l'identifiant unique est toujours défini

            // Cacher le modal de modification
            editModal.style.display = "none";

            // Mettre à jour les données sauvegardées
            updateSavedData();
        } else {
            console.error("Ligne modifiée non trouvée");
        }
    });

    // Charger les données sauvegardées depuis le stockage local
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem("employeeData"));
        if (savedData) {
            savedData.forEach(function(data) {
                const newRow = document.createElement("tr");
                newRow.setAttribute("data-id", data.id); // Définir l'identifiant unique
                newRow.innerHTML = `
                    <td>${data.nom}</td>
                    <td>${data.prenom}</td>
                    <td>${data.telephone}</td>
                    <td>${data.departement}</td>
                    <td>
                        <button class="edit">Modifier</button>
                        <button class="delete">Supprimer</button>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });
        }
    }

    // Sauvegarder les données dans le stockage local
    function saveDataToLocalStorage(id, nom, prenom, telephone, departement) {
        const savedData = JSON.parse(localStorage.getItem("employeeData")) || [];
        savedData.push({ id, nom, prenom, telephone, departement });
        localStorage.setItem("employeeData", JSON.stringify(savedData));
    }

    // Mettre à jour les données sauvegardées dans le stockage local après la suppression ou la modification
    function updateSavedData() {
        const rows = tableBody
        .querySelectorAll("tr");
        const savedData = [];
        rows.forEach(function(row) {
            const columns = row.querySelectorAll("td");
            savedData.push({
                id: row.getAttribute("data-id"), // Inclure l'identifiant unique
                nom: columns[0].textContent,
                prenom: columns[1].textContent,
                telephone: columns[2].textContent,
                departement: columns[3].textContent
            });
        });
        localStorage.setItem("employeeData", JSON.stringify(savedData));
    }
});

// Activation de la pagination
document.addEventListener("DOMContentLoaded", function() {
    const pagination = document.querySelector('.pagination');
    const precedentLink = pagination.querySelector('.precedent');
    const suivantLink = pagination.querySelector('.suivant');
    const spanPage = pagination.querySelector('span');

    let currentPage = 1; // Initialise la page actuelle à 1

    precedentLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            spanPage.textContent = currentPage;
            // Ici, vous pouvez mettre à jour le contenu de la table pour afficher les données de la page précédente
        }
    });

    suivantLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage++;
        spanPage.textContent = currentPage;
        // Ici, vous pouvez mettre à jour le contenu de la table pour afficher les données de la page suivante
    });
});
