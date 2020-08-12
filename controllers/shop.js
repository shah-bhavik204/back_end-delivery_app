const Product = require('../models/product');
const Products = require('../models/products');
const cart = require('../models/cart');
// const { response } = require('express');
const { validationResult } = require('express-validator');
const getDb = require('../util/database').getDb;


exports.getProducts = (req, res, next) => {
  // console.log(Product)
  Product.fetchAllProducts()
    .then(products => {
      res.json(products)
    })
    .catch(err => {
      console.log(err);
    })
};

exports.saveProduct = (req, res, next) => {
  console.log(req.body)
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    console.log('----', errors)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const product_id = req.body.product_id;
    const title = req.body.title;
    const department = req.body.department;
    const description = req.body.description;
    const price = req.body.price;
    const imageURL = req.body.imageURL;
    // const cretedBy = req.body.cretedBy;

    const product = new Product(product_id, title, department, price, description, imageURL);
    // console.log(product)
    product.save()
      .then(result => {
        res.send(result)
        console.log('Product created!')
      })
      .catch(err => {

      })
  } catch (error) {
    return next(error)
  }
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  let message = '';
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.addMultpleProducts = (req, res, next) => {
  // if(req.userData.type === 0){

  // }
  try {
    let userData = req.userData;
    let products = req.body;
    let validation = false;
    const errors = validationResult(req);

    console.log('----', errors)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }else{
        if([0,1].includes(userData.user_type) ){

    Products.insertMultipleProducts(products,userData)
        .then(result => {
          // console.log(result)
          res.json(result)
        })
      }else{
        // console.log('wfw')
        res.json( {ok: false, msg: "User not Authorized"})

      }
    }
  }catch (err) {

  }
}

exports.postEditProduct = (req, res, next) => {
  //Request => 
  // {
  //   filter: {...},
  //   set: {...}
  // }
  if( [0,1].includes(req.userData.user_type )){
    let filter = req.body.filter;
    let set = req.body.set;
    const db = getDb();
    console.log(filter,set)

  try {
    db.collection('products').updateMany(
        filter,                                         
        // { _id: '48793283210' },
       { $set: set }                                    
      // { $set: { description: 'Very spicy' } }
    ).then(result => {
      res.send(result)
    })
 } catch (e) {
    console.log(e);
 }
}else{
  res.json({
    ok: false,
    msg: "User not Authorized"
  })
}

};

// exports.getIndex = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart
//         .getProducts()
//         .then(products => {
//           res.render('shop/cart', {
//             path: '/cart',
//             pageTitle: 'Your Cart',
//             products: products
//           });
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// };

exports.postCart = (req, res, next) => {
  let item = req.body.item;
  let userData = req.userData;

  cart.manageCart(item, userData)
    .then(result => {
      // if(result.ok){
        // console.log(result)
        res.json(result);
      // }else{
      //   res.send("Operation failed")
      // }
    })
    .catch(err => {
      res.json(err)
    })

};

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then(products => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       return req.user
//         .createOrder()
//         .then(order => {
//           return order.addProducts(
//             products.map(product => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch(err => console.log(err));
//     })
//     .then(result => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(result => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({include: ['products']})
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };
