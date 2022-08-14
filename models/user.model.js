const bcrypt = require('bcryptjs');

const db = require('../data/database')

const mongodb = require('mongodb');
class User //classes are a JavaScript feature that allow us to define blueprints for objects that we wanna create in the future. And I do wanna create user objects in the future with the intention of then saving them in the database or logging them in.

{
    constructor(email,password,fullname,street,postal,city) //constructor, which is a method that will be called automatically
    {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {      // nested object
            street:street, 
            postalcode:postal,
            city:city,
        };  
    }


    userWithSameEmail(){
        return db.getDb().collection('users').findOne({ email: this.email });
    }

//this method returns true, if the user we're trying to create exists already in the database.
    async existAlready(){
        const existingUser = await this.userWithSameEmail(); //
        if(existingUser){
            return true;
        }

        return false;
    }

//---------------------------------------------------------------------------    
    async signup()
    {
        const hashpassword = await bcrypt.hash(this.password, 12);  //for encrypting the password, 12 indicate how strong
        
        //collection:In MongoDB, you have collections in a database. Collections of documents. Collections are basically like tables in a MySQL or in SQL database in general, but they have no fixed schema.They have no fixed data types. They are more flexible.
        
        //insertOne: we can insert one new document.

        await db.getDb().collection('users').insertOne({
            email:this.email,
            password:hashpassword,
            name:this.name,
            address: this.address
            
        });
        
    }

//---------------------------------------------------------------------------
    
    hasMatchingPassword(hashedpassword) {
        return bcrypt.compare(this.password, hashedpassword);
       
      }

    static findById(userId){

    const uid = new mongodb.ObjectId(userId);
    return db.getDb().collection('users').findOne({_id:uid}, {projection:{password: 0}});
 }

    }


//exporting user class 
module.exports = User;