const { response } = require('express');

const getDb = require('../util/database').getDb;
const {ObjectId} = require('mongodb');

exports.manageCart = (item, userData) => {
  const db = getDb();
  // const objectId = new ObjectID(userData._id);
  // console.log(item,userData)
  try{
    if(item.quantity === 0){
      return db.collection('cart').updateOne(
        {
          'customer_id': new ObjectId(userData._id),
          // 'cart_items._id': item._id
        },
        { $pull: 
          { "cart_items": {_id: "item._id"} }   
        } 
      )
      .then(result => {
        return result
      })
    }else{
    return checkUserCartItems(userData._id,item)
    .then(response => {
      console.log(response)
      if(!response.length){
        console.log(true  )
        return db.collection('cart').updateOne(
          { 'customer_id': new ObjectId(userData._id) },
          {
            '$addToSet': { 'cart_items': item  }
          }
        )
        .then(result => {
          console.log(result)
          return result
        })
      }else{
        return db.collection('cart').updateOne(
          { 
            'customer_id': new ObjectId(userData._id), 
            'cart_items._id': item._id
          },
          {
            '$set': { 'cart_items.$.quantity': item.quantity }
          }
        )
        .then(result => {
          return result
        })
      }
      // return response
    })
  }
  } catch(e) {
    console.log(e);
  }
}

exports.addCart = (userData) => {
  const db = getDb();

  let cart_object = {
    _id: userData._id,
    cart_items: []
  }

  return db.collection('cart').insertOne(cart_object)
  .then(result => {
    return result.result
  })
  .catch(err => {
    return err
  })
}

checkUserCartItems = (user_id, cart_item) => {
  const db = getDb();
  return db.collection('cart').aggregate([
    {
      '$match': {
        'customer_id': new ObjectId(user_id),
        'cart_items._id': cart_item._id
      }
    }
  ])
  .toArray()
  .then(result => {
    return result
  })
}