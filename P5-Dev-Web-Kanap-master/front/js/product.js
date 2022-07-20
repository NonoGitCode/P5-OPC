//On récupère l'id du canape correspondant dans le lien
const idProduct = new URL(window.location.href).searchParams.get("id");

//On contacte l'API en précisant qu'on est dans le context Id
fetch("http://localhost:3000/api/products/" + idProduct)
  .then(function (response) {
    return response.json();
  })


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
  
  //On définit le format de l'objet qu'on souhaite avoir dans le panier
  let canape = {
    id : idProduct,
    color: colors.value,
    quantity: parseInt(quantity.value),
    name : name,
  };
  
//console.log(canape)

  //Condition, si la quantité est comprise entre 1 et 100 on ajoute le produit au panier ou alors on incrémente la quantité
  if (quantity.value >= 1 && quantity.value <= 100){
    //si il y'a déjà un panier dans le local storage
    if(localStorage.getItem('panier')){
      panierStorage = JSON.parse(localStorage.getItem('panier'));
      if (findItem(panierStorage,canape.id)){
        if (findColor(panierStorage,canape.color,canape.id)){
          panierStorage.forEach(element => {
            if (element.id == canape.id && element.color == canape.color){
              element.quantity += canape.quantity
              localStorage.setItem('panier',JSON.stringify(panierStorage));
             alert('Article ajouté au panier');
            }
          })
        }else{
          panierStorage.push(canape);
          localStorage.setItem('panier',JSON.stringify(panierStorage));
          alert('Article ajouté au panier');
        }
      }else{
      panierStorage.push(canape);
      localStorage.setItem('panier',JSON.stringify(panierStorage));
    }
  }else{
    let panierStorage = [];
    panierStorage.push(canape);
    localStorage.setItem('panier',JSON.stringify(panierStorage));
    alert('Article ajouté au panier');
    // console.log('panier vide')
    }
  }else{
    alert("Veuillez choisir un nombre d'article compris entre 1 et 100")
  }
});
  
  
