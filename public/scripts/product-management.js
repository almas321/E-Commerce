
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

//we got multiple buttons. How do we know which button was clicked inside of deleteProduct
//For this, we can utilize the default event object which we get automatically for all the functions that are triggered upon events
//And on this event object, we have a target property. This target is the element which caused the event or on which the event occurred. And in our case, we know that this will be the button,

async function deleteProduct(event) {
    const buttonElement = event.target; //single delete button 
    const productId = buttonElement.dataset.productid; // we get id with the help od data attribute that we set in the product item file in the button tag
    const csrfToken = buttonElement.dataset.csrf;

//we can use it for sending POST or, in our case, also DELETE requests.

//first of all, wants a URL to which the request should be sent. And in our case, that should be the domain on which we already are, so we don't need to repeat that here, slash and then the path on that domain where we wanna send the request to.  /localhost:/3000/admin/products/ +productid

//we need to configure here because by default we would send a GET request,we can change the method with help of method

//We need to send the CSRF token with that request as well because otherwise the request will be blocked by our server, because the CSRF protection we added on the server also affects the request we send with frontend JavaScript,


const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) { //if we don't have an okay response,
    alert('Something went wrong!');
    return;
  }


    //apne ko pura product item hi dlt krna hai isliye button ka parent div, div ka parent div, div ka parent product-item uska parent li (refer product-item and all product ejs)
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}



//because we have so many delete buttons on page therefor for on click of each delete button we call function 
for (const deleteProductButtonElement of deleteProductButtonElements) {
    deleteProductButtonElement.addEventListener('click', deleteProduct);
  }
  