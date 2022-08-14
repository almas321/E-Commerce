const addToCartButtonElement = document.querySelector('#product-details button'); //ad to cart button
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');  ////because two badge one mobile screen one big screen

async function addToCart () {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  let response;

  try {
      response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({        //the data theat we wanna attach to request
          productId: productId,
          _csrf: csrfToken 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
  } catch (error) {
    alert('Something went wrong!');
    return;
  }
  
  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  const responseData = await response.json();  //json()-> from json to regular JavaScript

  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements){

    cartBadgeElement.textContent = newTotalQuantity;
  }

}

addToCartButtonElement.addEventListener('click', addToCart);