const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);  //uses the built in date constructor function, which gives us various utility methods for working with dates.
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',  // for eg: Monday,tuesday
        day: 'numeric',
        month: 'long',    // for eg: July not 07
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  //accessing all the entities in order documents
  static async findAll() {
    const orders = await db.getDb().collection('orders').find().sort({ _id: -1 }) .toArray();

    return this.transformOrderDocuments(orders);
  }

  //accessing all the entities in order documents for specific user/id
  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  save() {

    // for updating 
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      // for inserting
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;