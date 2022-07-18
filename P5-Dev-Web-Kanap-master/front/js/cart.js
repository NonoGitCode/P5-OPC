const cart = JSON.parse(localStorage.getItem('panier'))||[]
const cartItems = document.getElementById("cart__items");
let cartItemCollectionColor = [];
let cartItemCollectionQuantity = [];
let cartItemCollectionPrice = [];
let cartItemCollectionQuantityExact = [];

//[2] Définition de ma fonction create card qui injectera mon HTML à chaque itération de la boucle par rapport au nombre d'item dans mon panier (cart)
function createCard(product, quantity, color) {
  const article = document.createElement('article');
  article.setAttribute('class',"cart__item");
  article.setAttribute('data-id',product._id);
  article.setAttribute('data-color',color);
  const divCartItemImg = document.createElement('div');
  divCartItemImg.setAttribute('class','cart__item__img');
  const img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  const divCartItemContent = document.createElement('div');
  divCartItemContent.setAttribute('class',"cart__item__content");
  const divCartItemContentDescription = document.createElement('div');
  divCartItemContentDescription.setAttribute('class',"cart__item__content__description");
  const price = document.createElement('p');
  const h2 = document.createElement('h2');
  h2.innerHTML = product.name;
  const pColor = document.createElement('p');
  pColor.innerHTML = color;
  const divCartItemContentSettings = document.createElement('div');
  divCartItemContentSettings.setAttribute('class',"cart__item__content__settings");
  const divCartItemContentSettingsQuantity = document.createElement('div');
  divCartItemContentSettingsQuantity.setAttribute('class',"cart__item__content__settings__quantity");
  price.innerHTML = `${product.price} €`
  const pQuantity = document.createElement('p');
  const imputQuantity = document.createElement('input');
  imputQuantity.setAttribute('type','number');
  imputQuantity.setAttribute('class','itemQuantity');
  imputQuantity.setAttribute('name','itemQuantity');
  imputQuantity.setAttribute('min','1');
  imputQuantity.setAttribute('max','100');
  imputQuantity.setAttribute('value',quantity);
  divCartItemContentSettingsQuantity.appendChild(pQuantity);
  divCartItemContentSettingsQuantity.appendChild(imputQuantity);
  pQuantity.innerHTML='Quantité :'
  const divCartItemContentSettingsDelete = document.createElement('div');
  divCartItemContentSettingsDelete.setAttribute('class',"cart__item__content__settings__delete");
  const pDelete = document.createElement('p');
  pDelete.setAttribute('class','deleteItem');
  pDelete.innerHTML = "Supprimer";
  divCartItemContentSettingsDelete.appendChild(pDelete);
  divCartItemContentSettings.appendChild(divCartItemContentSettingsQuantity);
  divCartItemContentSettings.appendChild(divCartItemContentSettingsDelete);
  divCartItemContentDescription.appendChild(h2);
  divCartItemContentDescription.appendChild(pColor);
  divCartItemContentDescription.appendChild(price);
  divCartItemContent.appendChild(divCartItemContentDescription);
  divCartItemContent.appendChild (divCartItemContentSettings);
  divCartItemImg.appendChild(img);
  article.appendChild(divCartItemImg);
  article.appendChild(divCartItemContent);
  cartItems.appendChild(article);

  const modifications = {
    suppression : pDelete,
    modifyQuantity : imputQuantity,
    quantityExact : imputQuantity.value,
    price : product.price
  }
  return modifications;
};
/*****************************************************************************************************************************************/
// Définition de la fonction verifyCart (appelée en [5]) qui permet de comparer l'id et la couleur à tous mes items du panier pour supprimer le bon élément, puis update mon panier.
function verifyCart (elem,itemId,itemColor,index){
  if (elem.id === itemId && elem.color === itemColor){
    cart.splice(index,1);
  }
   localStorage.setItem('panier',JSON.stringify(cart));
   window.location.reload();
  }
  //[3] Définition de ma fonction boucleFor qui supprime les éléments du DOM et du LS au click utilisateur
function boucleForDelete(Array){
  Array.forEach((element)=>
    element.addEventListener('click',function(event){
      let article = element.closest('article')
      let itemId = article.dataset.id;
      let itemColor = article.dataset.color;
      cart.forEach((elem,index)=>verifyCart(elem,itemId,itemColor,index))
    })
  );
} 
// Définition de la fonction modify quantity (appelée en [6]) qui cherche quel input est modifié et qui compare aux éléments du LS pour modifier la quantitée correspondante
function modifyQuantity (element,itemId,itemColor){
  for (let i = 0; i<cart.length; i++){
    if (cart[i].id === itemId && cart[i].color === itemColor){
      cart[i].quantity = quantityValue
    }
    localStorage.setItem('panier',JSON.stringify(cart));
  }
}
//[4] Définition de la bouclefor qui ajuste les quantités lorsque l'utilisateur modifie le unput
function boucleForQuantity (Array,secondArray){
  Array.forEach((element) =>
    element.addEventListener('change',async function(event){
      if (element.value <= 0){
        alert ('La quantité ne peux être inférieur à 1')
        quantity.value = 1
      }else{
        let article = element.closest('article')
        let itemId = article.dataset.id;
        let itemColor = article.dataset.color;
        quantityValue = element.value;
        let totalQuantity = document.getElementById('totalQuantity');
        let text=0
        modifyQuantity(element,itemId,itemColor)
        boucleForPrice(secondArray)
        quantityTot();
      }
      
    })
  )
}
/*****************************************************************************************************************************************/

// [1] Définition de la fonction displayProduct qui va fetch tous les élements du LS pour les afficher puis appeler les fonctions boucleFor
function displayProducts (){
  if (cart.length === 0){
    let article = document.getElementById('cart__items');
    article.innerHTML = 'Votre Panier est vide';
  }else{
    for (let i = 0; i < cart.length; i++){
      fetch("http://localhost:3000/api/products/" + cart[i].id)
        .then((canape)=>{
          return canape.json();
        })
        .then((product)=>{
          const modifications = createCard(product, cart[i].quantity, cart[i].color,);
          cartItemCollectionColor.push(modifications.suppression);
          cartItemCollectionQuantity.push(modifications.modifyQuantity);
          cartItemCollectionPrice.push(modifications.price)
          cartItemCollectionQuantityExact.push(modifications.quantityExact);
        })
        .then(()=>{
          quantityTot();
          boucleForPrice(cartItemCollectionPrice);
          boucleForDelete(cartItemCollectionColor);
          boucleForQuantity(cartItemCollectionQuantity,cartItemCollectionPrice);
        })
        .catch(function(error){
          console.error(error)
      });
    }
  }
} 

// Fonction Principale
displayProducts();
/*************************************************************************************************/

let totalQuantity = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice')

//Compteur pour mettre à jour la quantité affichée
function quantityTot (){
  let text=0
  for (let i = 0; i < cart.length; i++){
  number = parseInt(cart[i].quantity)
  text+= number
  totalQuantity.innerHTML=text;
  }
}
function boucleForPrice (Array){
  let totPrice = 0
  let newCart = JSON.parse(localStorage.getItem('panier'));
    for (let i = 0; i < Array.length; i++){
      totPrice += (parseInt(Array[i])*(newCart[i].quantity));
    }
    totalPrice.innerHTML=totPrice
  }

/*************************************************************************************************/
function checkInput (){
  const firstName = document.getElementById('firstName');
  const firstNameError = document.getElementById('firstNameErrorMsg');
  const firstNameValue = firstName.value.trim();

  const lastName = document.getElementById('lastName');
  const lastNameError = document.getElementById('lastNameErrorMsg');
  const lastNameValue = lastName.value.trim();

  const address = document.getElementById('address');
  const addressError = document.getElementById('addressErrorMsg');
  const addressValue = address.value.trim();

  const city = document.getElementById('city');
  const cityError = document.getElementById('cityErrorMsg');
  const cityValue = city.value.trim();

  const mail = document.getElementById('email');
  const mailError = document.getElementById('emailErrorMsg');
  const mailValue = mail.value.trim();
  let check = true;

  const firstNameRegex = /^[A-Za-z\s]{3,50}$/;
  const lastNameRegex = /^[A-Za-z\s]{3,50}$/;
  const addressRegex = /^[A-Za-z0-9\s]{5,50}$/;
  const cityRegex = /^[A-Za-z\s]{3,50}$/;
  const mailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (firstNameValue.match(firstNameRegex)){
    firstNameError.innerHTML = "";
  }else{
    check = false;
    firstNameError.innerHTML = "Veuillez saisir un prénom valide";
  }

  if (lastNameValue.match(lastNameRegex)){
    lastNameError.innerHTML = "";
  }else{
    check = false;
    lastNameError.innerHTML = "Veuillez saisir un nom de famille valide";
  }

  if (addressValue.match(addressRegex)){
    addressError.innerHTML = "";
  }else{
    check = false;
    addressError.innerHTML = "Veuillez saisir un une addresse valide";
  }

  if (cityValue.match(cityRegex)){
    cityError.innerHTML = "";
  }else{
    check = false;
    cityError.innerHTML = "Veuillez saisir un nom ville valide"
  }

  if (mailValue.match(mailRegex)){
    mailError.innerHTML = "";
  }else{
    check = false;
    mailError.innerHTML = "Veuillez saisir une addresse mail valide"
  }
  return check
};

//Définition de la fonction postAPI qui va envoyer l'objet "body" contenant les informations de l'utilisateur  => addresse + id des produits commandés et nous retourne l'id de la commande 
function postApi(body){
  fetch("http://localhost:3000/api/products/order",{
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type" : "application/json",
    }
  })
  .then(response => response.json())
  .then(response=> {
    let cart = []
    localStorage.setItem('panier',JSON.stringify(cart))
    window.location.href = `./confirmation.html?orderId=${response.orderId}`
  })
  .catch(function(error){
    console.error(error)
  });
}

//Définition de la fonction requestBody qui va récuperer les valeurs des champs du formulaire pour mettre les informations dans un objet qui sera transmit à l'API
function requestBody(){

  const firstNameInput = document.querySelector('#firstName')
  const firstName = firstNameInput.value

  const lastNameInput = document.querySelector('#lastName')
  const lastName = lastNameInput.value

  const addressInput = document.querySelector('#address')
  const address = addressInput.value

  const cityInput = document.querySelector('#city')
  const city = cityInput.value

  const emailInput = document.querySelector('#email')
  const email = emailInput.value

  let idProducts  = [];
  for (let i = 0; i < cart.length; i++){
    for (let number = cart[i].quantity; number>0; number--){
      idProducts.push(cart[i].id)
    }
  }

  const body = { 
    contact: {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  },
  products : idProducts,
  }
  return body
};

//Définition de la fonction submitForm qui permet de récuperer les informations entrées par l'utilisateur dans le formulaire, va vérifier si celles-ci sont correctes et va transmettre à l'API puis récuperer le numéro de commande dans la réponse de l'API 
function submitForm (e){
  e.preventDefault();
  if (cart.length === 0){
    alert('Vous ne pouvez passer une commande avec un panier vide')
  }else{
    if(checkInput()){
      postApi(requestBody())
    };
  }
};
//Lorsque l'utilisateur clique sur le bouton commander, on appelle la fonction submitForm
const submitBtn = document.getElementById('order')
submitBtn.addEventListener("click", (e) => submitForm(e))

