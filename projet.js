const inputNewItem = document.querySelector('#nouvel-item');
const formulaire = document.querySelector('form');
// Recupérer la liste ul
const listeUl = document.querySelector('#liste');
// Récupérer la référence du template
const templateItem = document.querySelector('#template-item')


const addNewItem = () => {
    // Cloner l'élément li du template
    const elementLi = templateItem.content.cloneNode(true);

    // Recupère la valeur du nouvel item
    let valueItem = inputNewItem.value; 

    // Supprimer les espaces avant et après de l'item
    valueItem = valueItem.trim();

    // Supprimer les espaces superficiels au milieu de la string
    while(valueItem.indexOf("  ") !== -1){
        valueItem = valueItem.replace("  ", " ");
    }

    // Insertion intelligente
    // Division de ma string en tableau
    const tableauSplit = valueItem.split(' ');
    // Récupération du premier mot et conversion en nombre si c'est possible
    const premierMot = +tableauSplit[0];
    // Test si c'est un nombre si c'est le cas 
    if(Number.isInteger(premierMot)){
        const elementQuantite = elementLi.querySelector('.quantite');
        elementQuantite.textContent = premierMot;
        // Je retire le 1er élément du tableau
        tableauSplit.shift();

        // test si le 2ème mot est une unité
        const selectOptions = elementLi.querySelector('.unite');
        for (let i = 1 ; i < selectOptions.length; i++) {
            const valueOptions = selectOptions[i].value;
            // Je vérifie si le deuxième est une unité
            if(tableauSplit[0].includes(valueOptions)) {
                const unite = tableauSplit[0];
                tableauSplit.shift();
                selectOptions.value = unite;
            }
        }

    }

    // Je concatène tous les élements du tableau 
    valueItem = tableauSplit.join(' ');

    // Mettre la 1ere lettre en majuscule
    const majuscule = valueItem[0].toUpperCase();
    valueItem = majuscule + valueItem.slice(1);
    
    // Récupérer le noeud paragraphe dans le li
    const elementNom = elementLi.querySelector('.nom-item');
    
    // Insérer la valeur du input dans le noeud paragraphe
    elementNom.textContent = valueItem;
    
    // Rattacher l'élément li au noeud ul
    listeUl.appendChild(elementLi);
    
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


