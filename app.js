// app.js (this) is our main entry file that starts the node/express server, handles incoming request

const path = require ('path')

const express = require('express');  //importing express package
const csrf = require ('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const errorHandlerMiddleware = require('./middleware/error-handler');
const addCsrftokenMiddleware = require('./middleware/csrf-token');
const checkAuthStatusMiddleware = require('./middleware/check-auth');
const protectRoutemiddleware = require('./middleware/protect-routes');
const cartMiddleware = require('./middleware/cart')
const updateCartPricesMiddleware =require('./middleware/update-cart-prices');
const notFoundMiddleware = require('./middleware/not-found');

const authRoutes = require('./routes/auth.routes') //A ./ simply means, please look in the folder I'm currently in. So look for a routes folder in the folder I'm currently in, so in the project folder.
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.route');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.static('public')); //  //To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use('/products/assets',express.static('product-data'));

//This urlencoded middleware that's built into express, actually parses incoming requests and extracts request data that might be attached to those requests.
app.use(express.urlencoded({extended:false})); // try to extract any attached request data for all incoming requests.
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

// --------------------------CSRF MIDDLEWARE-------------------------------------

//we have two middleware that deal with the CSRF token: the third party middleware("csurf") helps us generate the token + check incoming tokens for validity - our on;y middleware just distributes generated tokens to all our other middleware/route handler and functions and views.

//we will have that CSRF protection, and that simply means that all incoming requests, which are not Get requests,now needs to have a CSRF token attached. This is what this middleware will check for. And any requests that are not Get requests that don't have a valid CSRF token will be... denied; They won't be able to continue.
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);    

app.use(addCsrftokenMiddleware);

// ----------------------------------------------------------------------------
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);   //app.use, which is a built-in method in the express app object allows us to add a middleware that will be triggered for every incoming request. And we do wanna check for every incoming request. If this request is for one of these two routes. So therefore, we wanna use our middleware for every incoming request
app.use('/cart', cartRoutes);

//for protecting below admin routes
app.use('/orders',protectRoutemiddleware, ordersRoutes);
app.use('/admin',protectRoutemiddleware, adminRoutes);

app.use(notFoundMiddleware);


app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function(){
    app.listen(3000);   ////listening on port 3000 means that we will able to send http request to domain 3000. on our local machine that is "localhost:3000", local host is alias for our local computer it is only accible from insile our own computer.
})
.catch(function(error){
    console.log("Failed to connect to the database!");
    console.log(error)
});
