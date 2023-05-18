const inputNewItem = document.querySelector('#nouvel-item');
const formulaire = document.querySelector('form');
const buttonExporter = document.querySelector('#exporter');
// Recupérer la liste ul
const listeUl = document.querySelector('#liste');
// Récupérer la référence du template
const templateItem = document.querySelector('#template-item');
const maListe = [];

// création d'un indicateur unique
const indicateur = document.createElement('li');
indicateur.classList.add('indicateur');
indicateur.addEventListener('dragover', (event) => {
    event.preventDefault();
});
indicateur.addEventListener('drop', drop);
let itemEnDeplacement;
let positionInitiale;

const indexDeLiDansListe = (element) => {
    const li = element.closest('li');
    const enfants = Array.from(listeUl.children);
    return enfants.indexOf(li);
}

const sauvegarde = () => {
    localStorage.setItem('liste', JSON.stringify(maListe));
}

const deleteItem = (event) => {
    const elementSupprimer = event.currentTarget;
    const index = indexDeLiDansListe(elementSupprimer);
    maListe.splice(index, 1);
    sauvegarde();
    const li = listeUl.children[index];
    li.addEventListener('transitionend', (event) => {
        if(event.propertyName === 'height'){
            li.remove();
        }
    })
    li.classList.add('suppression')
}

// function pour remplacer le paragraphe en input
const replaceWithInput = (event) => {
    const elementParagraphe = event.target;
    const inputNom = document.createElement('input');
    if(elementParagraphe.className === "quantite") {
        inputNom.type = "number";
        inputNom.setAttribute('min', 1);
        inputNom.setAttribute('max', 999);
    } else {
        inputNom.type = "text";
    }
    inputNom.className = elementParagraphe.className;
    inputNom.value = elementParagraphe.textContent;
    elementParagraphe.replaceWith(inputNom);
    inputNom.focus();

    function gestionblur(event) {
        const element = event.target;
        const index = indexDeLiDansListe(element);
        
        if(element.className === 'nom-item'){
            maListe[index].nom = element.value; 
            elementParagraphe.textContent = element.value;   
        } else {
            if (element.value < 1) {
                maListe[index].quantite = 1;    
                elementParagraphe.textContent = 1;
            } else if (element.value > 999) {
                maListe[index].quantite = 999;
                elementParagraphe.textContent = 999;
            } else {
                maListe[index].quantite = +element.value;
                elementParagraphe.textContent = +inputNom.value;
            };
        }
        sauvegarde();
        inputNom.replaceWith(elementParagraphe);
    };

    inputNom.addEventListener('blur', gestionblur);

    inputNom.addEventListener('keyup', (event) => {
        if(event.code === 'Enter' || event.code === 'NumpadEnter') {
            inputNom.removeEventListener('blur', gestionblur);
            gestionblur(event);   
        };
    });
};

const mooveItem = (event) => {
    const elementPoignee = event.target;
    const itemLi = elementPoignee.closest('li');
    itemLi.setAttribute('draggable', 'true');
    itemLi.classList.add('drag-start');
    itemEnDeplacement = itemLi;
    listeUl.classList.add('drag-en-cours');
    positionInitiale = indexDeLiDansListe(itemEnDeplacement);
};

const dragEnd = (event) => {
    const elementPoignee = event.target;
    const itemLi = elementPoignee.closest('li');
    itemLi.removeAttribute('draggable');
    itemLi.classList.remove('drag-start');
    listeUl.classList.remove('drag-en-cours');
    
    const positionIndicateur = indexDeLiDansListe(indicateur);
    if(positionIndicateur >= 0) {
        indicateur.remove();
    };
};

const dragOver = (event) => {
    event.preventDefault();
    
    const li = event.currentTarget;
    
    const milieu = li.offsetHeight / 2;
    const positionCurseur = event.offsetY;

    if(li === itemEnDeplacement || (li === itemEnDeplacement.previousElementSibling && positionCurseur > milieu) || (li === itemEnDeplacement.nextElementSibling && positionCurseur <= milieu)) {
        indicateur.remove();
    } else {
        if(positionCurseur <= milieu) {
            if(li.previousElementSibling !== indicateur) {
                li.before(indicateur);
            }
        } else {
            if(li.nextElementSibling !== indicateur) {
                li.after(indicateur);
            }
        }
    }
};

function drop (event) {
    // mettre à jour les données de mon tableau maLliste
    const positionIndicateur = indexDeLiDansListe(indicateur);
    
    // si mon indicateur apparait
    if(positionIndicateur >= 0){
        // je supprime mon item en déplacement de mon tableau
        const item = maListe.splice(positionInitiale, 1)[0];
        // puis je le rajoute à sa nouvelle position
        if(positionIndicateur > positionInitiale) {
            maListe.splice(positionIndicateur - 1, 0, item);
        } else {
            maListe.splice(positionIndicateur, 0, item);
        }
        //sauvegarde();

        // Animation de deplacement de l'item
        itemEnDeplacement.addEventListener('transitionend', (event) => {
            const phaseItem = itemEnDeplacement.dataset.phase;
            if(event.propertyName === 'transform') {
                switch (phaseItem) {
                    case 'decollage' :
                        const hauteurItem = itemEnDeplacement.offsetHeight;
                        const styleItem = window.getComputedStyle(itemEnDeplacement);
                        const margeTopItem = Number.parseInt(styleItem.marginTop);
                        const hauteurTotale = hauteurItem + margeTopItem;

                        let nombreItems;
                        if(positionIndicateur - positionInitiale > 0) {
                            nombreItems = positionIndicateur - positionInitiale - 1;
                        } else {
                            nombreItems = positionIndicateur - positionInitiale;
                        }
                        
                        itemEnDeplacement.style.transform +=  `translateY(${hauteurTotale * nombreItems}px)`;
                        itemEnDeplacement.dataset.phase = 'deplacement';
                        break;
                    case 'deplacement' : 
                        break;
                    default :
                        break;
                }
            }
        });

        itemEnDeplacement.dataset.phase = 'decollage';
        itemEnDeplacement.style.position = "relative";
        itemEnDeplacement.style.zIndex = "1";
        itemEnDeplacement.style.transform = "scale(1.05)";
        itemEnDeplacement.style.boxShadow = "0 0 24px rgba(32,32,32,0.8)";
    }
    
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
            const fragmentDoc = templateItem.content.cloneNode(true);
            const elementQuantite = fragmentDoc.querySelector('.quantite');
            const selectOptions = fragmentDoc.querySelector('.unite');
            const elementNom = fragmentDoc.querySelector('.nom-item');

            // Récupérer l'élément poubelle
            const elementSupprimer = fragmentDoc.querySelector('.supprimer');
            elementSupprimer.addEventListener('click', deleteItem);

            // récupérer l'élément poignée pour déplace un item
            const elementPoignee = fragmentDoc.querySelector('.poignee');
            const elementLi = fragmentDoc.querySelector('li');
            elementPoignee.addEventListener('mousedown', mooveItem);
            elementPoignee.addEventListener('mouseup', dragEnd);
            elementLi.addEventListener('dragend', dragEnd);

            // Gérer l'affichage d'un indicateur lors du déplacement d'un item
            elementLi.addEventListener('dragover', dragOver);
            elementLi.addEventListener('drop', drop);

            // Je donne les valeurs de mon objet à l'emplacement qu'il convient
            elementNom.textContent = listeObjet[i].nom;
            elementQuantite.textContent = listeObjet[i].quantite;
            selectOptions.value = listeObjet[i].unite;
            listeUl.append(fragmentDoc);

            // Modifier la quantité de l'item
            elementQuantite.addEventListener('focus', replaceWithInput)

            // Modifier le nom de l'item
            elementNom.addEventListener('focus', replaceWithInput);  
            
            // Modifier l'unité de l'item
            selectOptions.addEventListener('change', (event)=> {
                const index = indexDeLiDansListe(selectOptions);
                maListe[index].unite = selectOptions.value;
                sauvegarde();
            });
        }
    }
}
getItem();

const addNewItem = () => {
    // Cloner l'élément li du template
    const fragmentDoc = templateItem.content.cloneNode(true);
    
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

    // Récupérer l'élément poubelle
    const elementSupprimer = fragmentDoc.querySelector('.supprimer');
    elementSupprimer.addEventListener('click', deleteItem);

    // récupérer l'élément poignée pour déplace un item
    const elementPoignee = fragmentDoc.querySelector('.poignee');
    const elementLi = fragmentDoc.querySelector('li');
    elementPoignee.addEventListener('mousedown', mooveItem);
    elementPoignee.addEventListener('mouseup', dragEnd);
    elementLi.addEventListener('dragend', dragEnd);
    elementLi.addEventListener('drop', drop);

    // Insertion intelligente
    // Division de ma string en tableau
    const tableauSplit = objetItem.nom.split(' ');
    // Récupération du premier mot et conversion en nombre si c'est possible
    const premierMot = +tableauSplit[0];
    const elementQuantite = fragmentDoc.querySelector('.quantite');
    const selectOptions = fragmentDoc.querySelector('.unite');
    // Test si c'est un nombre 
    if(Number.isInteger(premierMot)){
        objetItem.quantite = premierMot;
        elementQuantite.textContent = objetItem.quantite ;
        // Je retire le 1er élément du tableau
        tableauSplit.shift();
        
        // test si le 2ème mot est une unité
        for (let i = 1 ; i < selectOptions.length; i++) {
            const valueOptions = selectOptions[i].value;
            // Je vérifie si le deuxième est une unité
            if(tableauSplit.includes(valueOptions)) {
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
    sauvegarde();
    
    // Récupérer le noeud paragraphe dans le li
    const elementNom = fragmentDoc.querySelector('.nom-item');

    // Insérer la valeur du nom dans le noeud paragraphe
    elementNom.textContent = objetItem.nom;
    
    // Rattacher l'élément li au noeud ul
    listeUl.appendChild(fragmentDoc);

    // Modifier le paragraphe en input pour changer sa valeur
    elementNom.addEventListener('focus', replaceWithInput);
    elementQuantite.addEventListener('focus', replaceWithInput);
    selectOptions.addEventListener('change', (event)=> {
        const index = indexDeLiDansListe(selectOptions);
        maListe[index].unite = selectOptions.value;
        sauvegarde();
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
});

// Exporter ma liste de courses
buttonExporter.addEventListener('click', () => {
    let resultat = "";
    for(let i = 0; i < maListe.length; i++) {
        const chaine = `- ${maListe[i].nom} (${maListe[i].quantite} ${maListe[i].unite})%0D%0A`;
        resultat += chaine;
    };
    // construction de l'url pour le mailto
    let url = "mailto:leiroz26@hotmail.com";
    url += "?subject=Liste de courses";
    url += "&body=" + resultat;
    
    window.location = url;
});

