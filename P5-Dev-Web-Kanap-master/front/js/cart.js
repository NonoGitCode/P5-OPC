const cart = JSON.parse(localStorage.getItem('panier')) || []
const cartItems = document.getElementById("cart__items");
let cartItemCollectionColor = [];
let cartItemCollectionQuantity = [];
let cartItemCollectionPrice = [];
let cartItemCollectionQuantityExact = [];

//[3] Définition de ma fonction create card qui injectera mon HTML à chaque itération de la boucle par rapport au nombre d'item dans mon panier (cart)
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
//[4] Définition de ma fonction boucleFor qui supprime les éléments du DOM et du LS au click utilisateur
function boucleForDelete(Array){
  Array.forEach((element)=>
  element.addEventListener('click',function(event){
    let article = element.closest('article')
    let itemId = article.dataset.id;
    let itemColor = article.dataset.color;
    cart.forEach((elem,index)=>verifyCart(elem,itemId,itemColor,index))
  }));
} 
// Définition de la fonction modify quantity (appelée en [6]) qui cherche quel input est modifié et qui compare aux éléments du LS pour modifier la quantitée correspondante
function modifyQuantity (element,itemId,itemColor){
  for (let i = 0; i<cart.length; i++){
    if (cart[i].id === itemId && cart[i].color === itemColor){
      cart[i].quantity = quantityValue
    }
    localStorage.setItem('panier',JSON.stringify(cart));
  }
  console.log('coucou2')
}
//[5] Définition de la bouclefor qui ajuste les quantités lorsque l'utilisateur modifie le unput
function boucleForQuantity (Array,secondArray){
  Array.forEach((element) =>
    element.addEventListener('change',async function(event){
      let article = element.closest('article')
      let itemId = article.dataset.id;
      let itemColor = article.dataset.color;
      quantityValue = element.value;
      let totalQuantity = document.getElementById('totalQuantity');
      let text=0
      //Compteur pour mettre à jour la quantité affichée
      for (let i = 0; i < cart.length; i++){
        number = parseInt(cart[i].quantity)
        text+= number
        totalQuantity.innerHTML=text;
      }
      modifyQuantity(element,itemId,itemColor)
      console.log('coucou1')
      boucleForPrice(secondArray)
    })
  )
}
/*****************************************************************************************************************************************/
//Définition de la fonction asyncForEach (appelée en [2]) qui permet de faire une boucle forEach en asynchrone
async function asyncForEach(Array,callback){
  for (let i = 0; i<Array.length; i++){
    await callback (Array[i],i,Array);
  }
};

// [2] Définition de la fonction start qui va fetch tous les élements du LS pour les afficher puis appeler la fonction boucleFor
const start = async () =>{
  await asyncForEach(cart, async (elem) => {
    const res = await fetch("http://localhost:3000/api/products/" + elem.id);
    const product = await res.json()
    const modifications = createCard(product, elem.quantity, elem.color,);
    cartItemCollectionColor.push(modifications.suppression);
    cartItemCollectionQuantity.push(modifications.modifyQuantity);
    cartItemCollectionPrice.push(modifications.price)
    cartItemCollectionQuantityExact.push(modifications.quantityExact);
  });
  boucleForPrice(cartItemCollectionPrice);
  boucleForDelete(cartItemCollectionColor);
  boucleForQuantity(cartItemCollectionQuantity,cartItemCollectionPrice);
}
// [1] Définition de la fonction principale qui appelle la fonction "start"
async function displayProducts() {
  start()
};
// Fonction Principale
displayProducts();
/*************************************************************************************************/
//Compteur pour mettre à jour la quantité affichée
let totalQuantity = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice')
let text=0
for (let i = 0; i < cart.length; i++){
  number = parseInt(cart[i].quantity)
  text+= number
  totalQuantity.innerHTML=text;
}

function boucleForPrice (Array){
  let totPrice = 0
  let newCart = JSON.parse(localStorage.getItem('panier'));
  for (let i = 0; i < Array.length; i++){
    totPrice += (parseInt(Array[i])*(newCart[i].quantity));
  }
totalPrice.innerHTML=totPrice
}


