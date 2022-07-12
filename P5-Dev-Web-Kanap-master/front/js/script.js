
fetch("http://localhost:3000/api/products") 
    .then(function(response){
        return response.json();
    })
    .then(function(listCanape){
        const listProducts = document.getElementById("items")
        
        for (let index = 0; index < listCanape.length; index++) {
            const canape = listCanape[index];
            
           let text =  `<a href="./product.html?id=${canape._id}"> <article> <img src="${canape.imageUrl}" alt="${canape.altTxt}"> <h3 class="productName"> ${canape.name} </h3> <p class="productDescription"> ${canape.description}</p></article>`;
           listProducts.innerHTML += text;
        }

        
    })
    .catch(function(error) {
        console.error(error)
    });
