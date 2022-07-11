//On récupère l'id du canape correspondant dans le lien
const idProduct = new URL(window.location.href).searchParams.get("id");

//On contacte l'API en précisant qu'on est dans le context Id
fetch("http://localhost:3000/api/products/" + idProduct) 
  .then(function (response) {
    return response.json();
  })

  //On Crée donc notre fonction canape
  .then((canape) => {

    //On récupère dans des constantes tous les éléments HTML qu'on va modifier 
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const itemImg = document.getElementsByClassName("item__img");
    let price = document.getElementById("price");
    

    //On remplace dans le code HTML
    description.innerHTML = canape.description;
    title.innerHTML = canape.name;
    price.innerHTML = canape.price;

    //On initialise une variable text qui contiendra les informations de nos images
    let text = "";
    text = text +`<img src="${canape.imageUrl}"alt ="${canape.altTxt}"></img>`;

    //On précise bien l'index [0] car c'est un selecteur class et non Id donc stocké dans un Array
    itemImg[0].innerHTML = text;
   

    //On initalise la constante qu'on utilisera pour stocker les couleurs de nos canapés
    const colors = canape.colors;
    let textColors = " ";

    //On crée une boucle pour aller chercher chaque couleur disponible dans l'API
    colors.forEach((colors,index) =>
    textColors = textColors + `<option value="${colors}">${colors}</option>`);

    //On remplace les couleurs dans le menu <option> du HTML
    const colorSelect = document.getElementById("colors");
      colorSelect.innerHTML = textColors
    
  })  
  .catch(function(error) {
    console.error(error)
  }) 


/****************************************************************************************************************************************** */
function findItem (Array,value){
  let condition = false

  for(elem of Array){
    if (elem.id == value){
      return condition = true
    }
  }
  return condition
};

function findColor (Array,value,id){
  let condition = false

  for(elem of Array){
    if (elem.color == value && elem.id == id){
      return condition = true
    }
  }
  return condition
};


/****************************************************************************************************************************************** */
let addToCart = document.getElementById("addToCart");

//On définie la fonction d'ajout au panier qui répond au 'click' utilisateur sur le bouton 'Ajouter au panier'
addToCart.addEventListener('click',function () {

  let name = document.getElementById('title').textContent;

  let canape = {
    id : idProduct,
    color: colors.value,
    quantity: parseInt(quantity.value),
    name : name,
  };
  
//console.log(canape)

  //Condition, si la quantité est comprise entre 1 et 100 on ajoute le produit au panier ou alors on incrémente la quantité
  if (quantity.value >= 1 && quantity.value <= 100){

    //On définit le format de l'objet qu'on souhaite avoir dans le panier
    

    //si il y'a déjà un panier dans le local storage
    if(localStorage.getItem('panier')){
      panierStorage = JSON.parse(localStorage.getItem('panier'));
      
      if (findItem(panierStorage,canape.id)){

        if (findColor(panierStorage,canape.color,canape.id)){

          panierStorage.forEach(element => {

            if (element.id == canape.id && element.color == canape.color){
              element.quantity += canape.quantity
              localStorage.setItem('panier',JSON.stringify(panierStorage));
             // console.log('canape meme couleur dans le panier')
            }
          })
        
        }else{
          panierStorage.push(canape);
          localStorage.setItem('panier',JSON.stringify(panierStorage));
          // console.log('meme id pas meme couleur')
        }
    

      }else{
      panierStorage.push(canape);
      localStorage.setItem('panier',JSON.stringify(panierStorage));
      // console.log('pas le meme id')
      }

    }else{
    let panierStorage = [];
    panierStorage.push(canape);
    localStorage.setItem('panier',JSON.stringify(panierStorage));
    // console.log('panier vide')
    }
    
  }else{
    alert("Veuillez choisir un nombre d'article compris entre 1 et 100")
  }
});
  
  


/*
  // On regarde si un panier existe pas déjà
  let itemBuyJSON = localStorage.getItem('panier')

  //Si il n'y a pas de panier existant on en initalise un vide (autrement on incrémente de 1 cf else après)
  if(!itemBuyJSON){

    //On crée notre panier vide
    localStorage.setItem('panier',JSON.stringify([]))

    //On met notre Array dans une variable pour la réutiliser
    itemBuyJSON = localStorage.getItem('panier')
  }


  //On définie une variable qui contient les éléments de notre panier convertie de Array vers objet
  let itemBuy = JSON.parse(itemBuyJSON)

  //On retourne l'id du produit dans dans le panier si false on retourne canape.id
  let itemIndex = itemBuy.findIndex(function(element){
    return element._id == canape._id;
  })

  //On récupère dans des variables les quantités + couleurs saisies par l'utilisateur
  let itemQuantity = document.getElementById("quantity").value
  let itemColor = document.getElementById("colors").options[document.getElementById('colors').selectedIndex].text;

  //Si le canapé selectionné n'est pas dans le panier on le push avec la couleur et la qty
  if (itemIndex == -1) {

    canape.quantity = JSON.parse(itemQuantity);
    canape.colors = itemColor;
    itemBuy.push(canape)
    localStorage.setItem('panier', JSON.stringify(itemBuy))


  //Si le canapé est déjà dans le panier et que la couleur selectionnée est la même, on met à jour la quantité 
  }else{

    if(itemColor == canape.colors){ //ça marche sur le dernier élément ajouté
      
    canape.quantity += JSON.parse(itemQuantity);
    itemBuy.push(canape)
    localStorage.setItem('panier', JSON.stringify(itemBuy))


    //Si le canapé est déjà dedans et que la couleur est différente, on le push avec la couleur et la qty
    }else{
      canape.colors = itemColor;
      canape.quantity = JSON.parse(itemQuantity);
      itemBuy.push(canape)
      localStorage.setItem('panier', JSON.stringify(itemBuy))
    }
  }
        
})
*/
