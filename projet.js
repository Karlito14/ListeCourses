const inputNewItem = document.querySelector('#nouvel-item');
const formulaire = document.querySelector('form');
// Recupérer la liste ul
const listeUl = document.querySelector('#liste');
// Récupérer la référence du template
const templateItem = document.querySelector('#template-item');
const maListe = [];

const replaceWithInput = (paragraphe) => {
    const inputNom = document.createElement('input');
    inputNom.type = "text";
    inputNom.className = paragraphe.className;
    inputNom.value = paragraphe.textContent;
    paragraphe.replaceWith(inputNom);

    inputNom.focus();

    inputNom.addEventListener('blur', () => {
        paragraphe.textContent = inputNom.value;
        inputNom.replaceWith(paragraphe)
    });
}

const getItem = () => {
    // Je récupère la liste stocké dans le local storage
    const listeJSON = localStorage.getItem('liste');
    
    if (listeJSON !== null) {
        // Je convertis la liste en tableau
        const listeObjet = JSON.parse(listeJSON);
        for (let i = 0; i < listeObjet.length; i++) {
            // J'insère chaque objet dans mon tableau liste
            maListe.push(listeObjet[i]);
            const elementLi = templateItem.content.cloneNode(true);
            const elementQuantite = elementLi.querySelector('.quantite');
            const selectOptions = elementLi.querySelector('.unite');
            const elementNom = elementLi.querySelector('.nom-item');

            // Je donne les valeurs de mon objet à l'emplacement qu'il convient
            elementNom.textContent = listeObjet[i].nom;
            elementQuantite.textContent = listeObjet[i].quantite;
            selectOptions.value = listeObjet[i].unite;
            listeUl.append(elementLi);

            elementNom.addEventListener('focus', () => {
                const inputNom = document.createElement('input');
                inputNom.type = "text";
                inputNom.className = elementNom.className;
                inputNom.value = elementNom.textContent;
                elementNom.replaceWith(inputNom);
                inputNom.focus();

                inputNom.addEventListener('blur', () => {
                    elementNom.textContent = inputNom.value;
                    inputNom.replaceWith(elementNom)
                });
            });

            
            
        }
    }
}
getItem();

const addNewItem = () => {
    // Cloner l'élément li du template
    const elementLi = templateItem.content.cloneNode(true);

    // construction d'un objet
    const objetItem = {
        nom : null,
        quantite : 1,
        unite : 'u.',
    }

    // Recupère la valeur du nouvel item
    objetItem.nom = inputNewItem.value; 

    // Supprimer les espaces avant et après de l'item
    objetItem.nom = objetItem.nom.trim();

    // Supprimer les espaces superficiels au milieu de la string
    while(objetItem.nom.indexOf("  ") !== -1){
        objetItem.nom = objetItem.nom.replace("  ", " ");
    }

    // Insertion intelligente
    // Division de ma string en tableau
    const tableauSplit = objetItem.nom.split(' ');
    // Récupération du premier mot et conversion en nombre si c'est possible
    const premierMot = +tableauSplit[0];
    // Test si c'est un nombre 
    if(Number.isInteger(premierMot)){
        const elementQuantite = elementLi.querySelector('.quantite');
        objetItem.quantite = premierMot;
        elementQuantite.textContent = objetItem.quantite ;
        // Je retire le 1er élément du tableau
        tableauSplit.shift();
        
        // test si le 2ème mot est une unité
        const selectOptions = elementLi.querySelector('.unite');
        for (let i = 1 ; i < selectOptions.length; i++) {
            const valueOptions = selectOptions[i].value;
            // Je vérifie si le deuxième est une unité
            if(tableauSplit[0].includes(valueOptions)) {
                objetItem.unite = tableauSplit[0];
                tableauSplit.shift();
                selectOptions.value = objetItem.unite;
                break;
            }
        }
    }

    // Je concatène tous les élements du tableau 
    objetItem.nom = tableauSplit.join(' ');

    // Mettre la 1ere lettre en majuscule
    const majuscule = objetItem.nom[0].toUpperCase();
    objetItem.nom = majuscule + objetItem.nom.slice(1);

    // stockage de ma liste dans mon local storage
    maListe.push(objetItem);
    localStorage.setItem('liste', JSON.stringify(maListe));
    
    // Récupérer le noeud paragraphe dans le li
    const elementNom = elementLi.querySelector('.nom-item');

    // Insérer la valeur du input dans le noeud paragraphe
    elementNom.textContent = objetItem.nom;
    
    // Rattacher l'élément li au noeud ul
    listeUl.appendChild(elementLi);

    elementNom.addEventListener('focus', () => {
        const inputNom = document.createElement('input');
        inputNom.type = "text";
        inputNom.className = elementNom.className;
        inputNom.value = elementNom.textContent;
        elementNom.replaceWith(inputNom);
        inputNom.focus();

        inputNom.addEventListener('blur', () => {
            elementNom.textContent = inputNom.value;
            inputNom.replaceWith(elementNom)
        });
    });
    
    // Vider le input une fois le item rajouté
    inputNewItem.value = "";
    
    // Focus sur le input
    inputNewItem.focus()
}

// Vérifier à chaque saisie que le input respecte le pattern
inputNewItem.addEventListener('input', () => {
    inputNewItem.setCustomValidity('');
    inputNewItem.checkValidity();
})

// Affichage du message d'erreur personnalisé
inputNewItem.addEventListener('invalid', () => {
    if(inputNewItem.value === '' ){
        inputNewItem.setCustomValidity("Vous devez indiquer les informations de l'item, exemple : 250 g de chocolat");
    } else if(!/[A-Za-z]{2}/.test(inputNewItem.value)){
        inputNewItem.setCustomValidity("Le nom de l'item doit faire 2 lettres minimum");
    } else {
        inputNewItem.setCustomValidity("Les caractères spéciaux, les accents et autres lettres spécifiques ne sont pas autorisés");
    }
});

formulaire.addEventListener('submit', (event) => {
    // Empecher le rechargement de la page lors de la soumission du formulaire
    event.preventDefault();
    // appel de la fonction pour ajouter le nouvel item
    addNewItem();
})


