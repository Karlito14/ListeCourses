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

formulaire.addEventListener('submit', (event) => {
    // Empecher le rechargement de la page lors de la soumission du formulaire
    event.preventDefault();
    // appel de la fonction pour ajouter le nouvel item
    addNewItem();
})


