const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middleware/image-upload');

const router = express.Router();

router.get('/products',  adminController.getProducts); //   /admin/prodcuts

router.get('/products/new', adminController.getNewProduct);  //   /admin/prdoucts/new

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

//view and edit
router.get('/products/:id', adminController.getUpdateProduct); //for loading the page

router.post('/products/:id', imageUploadMiddleware, adminController.UpdateProduct); //We might have an image in there. We use enctype multipart/form-data for the form, so we should add our imageUploadMiddleware.

router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder)

module.exports = router;