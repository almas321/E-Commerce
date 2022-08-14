const Product = require('../models/product.model');
const Order = require('../models/order.model');

//for showing us the products page, the admin products page.
async function getProducts(req, res, next) {
    try {
      const products = await Product.findAll();  //findAll is a static method we call with the help of class
      res.render('admin/products/all-products', { products: products });  //now we can use this product in template
    } catch (error) {
      next(error);
      return;
    }
  }
  

//for showing us to page for adding a new product,
function getNewProduct(req, res) {
    res.render('admin/products/new-products');
  }

//for submitting a new product.
async function createNewProduct(req, res, next) {
    const product = new Product({           //creating the object of class 
        ...req.body,                         //passing the parameter for constructor(model folder) 
        image: req.file.filename,
    });

    try{
        
        await product.save();      //calling the save method from model for storing the value to the database
    }

    catch (error) {
        next(error);
        return;
      }

    res.redirect('/admin/products');
}

//export them with this syntax to make them available outside of this file as well.


// .................................UPDATE............................................

async function getUpdateProduct(req,res,next){

  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product });
  } catch (error) {
    next(error);
  }
}

async function UpdateProduct(req,res){
  const product = new Product({
    ...req.body,      //to spread all those req.body fields into new Product. //req.body.title,req.body.summary blabla 
    _id:req.params.id  //because I get the id in my request parameters because of that placeholder we defined on our routes.
  });

  if(req.file) {
    //replace the old image with new one
    product.replaceImage(req.file.filename) // new image name that we want to replace with 
  }
  try{
    
    await product.save();
  }
  catch(error){
    next(error);
    return;
  }
  res.redirect('/admin/products');
}


// ...............................................................................


async function deleteProduct(req,res,next){
 let prdouct;
  try{
    
    prdouct = await Product.findById(req.params.id);
    prdouct.remove();          //removing the product from databse  
  }
  catch(error){
    next(error);
    return
  }

  //The proper thing to do here on the backend is not to redirect. But since we will target and trigger this action with help of an AJAX request, we wanna send back a response in JSON format. This can be done by calling the json method on response,
  
  res.json({messagage: 'Deleted Product!'});
}

// ...............................................................................


  async function getOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      res.render('admin/orders/admin-orders', {
        orders: orders
      });
    } catch (error) {
      next(error);
    }
  }

// ...............................................................................


  async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);  

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}
  



module.exports = {
    getProducts:getProducts,
    getNewProduct,getNewProduct,
    createNewProduct:createNewProduct,
    getUpdateProduct:getUpdateProduct,
    UpdateProduct:UpdateProduct,
    deleteProduct:deleteProduct,
    getOrders:getOrders,
    updateOrder:updateOrder
};