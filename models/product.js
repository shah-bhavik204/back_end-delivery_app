const getDb = require('../util/database').getDb;

module.exports = class Product {
  constructor(product_id, title, department, price, description, imageURL) {
    this.product_id = product_id,
      this.title = title;
    this.department = department;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    // this.createdBy = createdBy;

  }
  save() {
    const db = getDb();
    return this.findProductById(this.product_id)
      .then(isNewProduct => {
        console.log(isNewProduct);
        if (!isNewProduct.length) {
          return db.collection('products').insertOne(this)
            .then(result => {
              // if(result.ok)
              return ('Product created!')
              // console.log(result)
            })
            .catch(err => {

              console.log(err)
            })
        } else {
          return "Product exist"
        }
      })
  }
  static fetchAllProducts() {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        return products
      })
      .catch(err => {

      })
  }
  findProductById(_id) {
    const db = getDb();
    return db.collection('products')
      .aggregate([
        {
          "$match": { "product_id": _id }
        }
      ])
      .toArray()
      .then(result => {
        return result
      })
      .catch(err => {
        console.log(err)
      })
  }
  insertMultipleProducts(products) {
    console.log(products)
    return db.collection('products').insertMany(products, { ordered: false })
      .then(result => {
        // if(result.ok)
        return result
        // console.log(result)
      })
      .catch(err => {

        return err
      })
  }
}
