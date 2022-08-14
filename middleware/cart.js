const Cart = require('../models/cart.model')

//the job of looking at an incoming request, and determining whether it's coming from a user who already has a cart or who doesn't have a cart yet.

function initializeCart(req, res, next) {
    let cart;

    if(!req.session.cart)  //if in the request session, the cart property is undefined, as it will be initially if a user visits this page for the first time.
    {
        cart = new Cart();  //I'll set my cart equal to new cart.
    } 
    else // if we find a cart in the session already, we know that for this user, we did create a cart in the past.
    {
      const sessionCart = req.session.cart;
      cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );  //my cart variable will be set equal to new cart, but I'll take the items with which I want to initialize that cart, from the cart that was already stored in my session.
    }

    res.locals.cart = cart;  //I want to make that available  for this request response cycle  in all the other middleware functions and my views,
    next();  //the request can travel on to the next middleware in line.
}

module.exports = initializeCart;