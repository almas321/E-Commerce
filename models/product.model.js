const mongodb = require('mongodb');

const db = require('../data/database')

class Product {
    constructor(productData)  //constructor(title,summary,description)
    {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        this.updateImageData();
        if (productData._id) {
          this.id = productData._id.toString();  //._id because that is the id field that's automatically created in the database by MongoDB.
        }
      }

      static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();
    
        return products.map(function(productDocument) {
          return new Product(productDocument);
        });
      }

      updateImageData(){
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl = `/products/assets/images/${this.image}`;
      }
    
      async save() {
        const productData = {
          title: this.title,
          summary: this.summary,
          price: this.price,
          description: this.description,
          image: this.image
        };

        //we now check whether we have an id,which means we are saving a product that was already stored in the database before, or if we don't have an id, which means we're about to add a new product,
        
        if(this.id) //if we do have id we update the product
        {  
          const productId = new mongodb.ObjectId(this.id)  //to convert id into mongodb object id

          if(!productData.image){
            delete productData.image;
          }
            await db.getDb().collection('products').updateOne({_id:productId}, {
            $set:productData
          });
        }

        else  //if we dont have existing id then we insert the product
        {
          await db.getDb().collection('products').insertOne(productData);  //storing the input into database
        }

    }

//for replacing image with new one
async replaceImage(newImage)
{
  this.image = newImage;
  this.updateImageData();
}


//...............................................................................

static async findById(productId) {
  let prodId;  //to access inside try
  try {
    prodId = new mongodb.ObjectId(productId);
  } catch (error) {
    error.code = 404;
    throw error;
  }
  const product = await db.getDb().collection('products').findOne({ _id: prodId });

  if (!product)  //if we don’t find the product
  {
    const error = new Error('Could not find product with provided id.');
    error.code = 404;  //we can set method to object with dot notation
    throw error;
  }

  return new Product(product);
}

  async remove(){

    const prodcutId = new mongodb.ObjectId(this.id)
    await db.getDb().collection('products').deleteOne({_id:prodcutId});
  }

  static async findMultiple(ids){
    const prodcutIds = ids.map(function(id){
      return new mongodb.ObjectId(id);
    });

    const products = await db.getDb().collection('products').find({_id:{$in:prodcutIds}}).toArray();
    
    return products.map(function(productDocument){
      return new Product(productDocument)
    });
  }

}
//..............................................................................

module.exports = Product;