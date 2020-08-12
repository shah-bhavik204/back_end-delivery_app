const Product = require('../models/product');
const User = require('../models/user')
const loginUser = require('../models/user_login')
const cart = require('../models/cart');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.addUser = (req, res) => {
  //  bcrypt.hash(req.query.password, 12)
  //   .then(hash => { 
  // const email = req.query.email;
  // const password = hash;

  let new_user = req.body
  console.log(new_user)
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    console.log('----', errors)

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    bcrypt.hash(new_user.password, 12)
      .then(hash => {
        new_user.password = hash;
        const user = new User(new_user)

        user.save()
          .then(result => {
            console.log(result)
            if(result.ok){
              cart.addCart(result.metaData)
              .then(response => {
                res.json(result)
              })
            }else{
              res.json(result);
            }
          })

      })
  } catch (err) {
    res.status(401).json({ msg: err })
  }

  // user.save()
  //   .then(result => {
  //     res.send(result)

  //Send Email
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: 'bhavik204@rediffmail.com',
  //   from: 'bhaviksshah123@gmail.com',
  //   subject: 'Sending with Twilio SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // return sgMail.send(msg)
  // .catch(err => {
  //   console.log('==>',err.response.body)
  // })

  // })
  // .catch(err => {
  //   res.status(401).json({msg: err})
  // });
  // })
}

exports.loginUser = (req, res) => {

  const email = req.query.email;
  const password = req.query.password;
  console.log(password)

  // console.log(User)
  // const user = new User(email, password)

  loginUser.checkUser(email)
    .then(result => {
      const hash = result[0].password
      console.log(hash)
      return bcrypt.compare(password, hash)
        .then(isValid => {
          console.log(isValid)
          if (isValid) {
            const token = jwt.sign(
              {
                email: email,
                _id: result[0]._id,
                user_type: result[0].user_type
              },
              process.env.JWT_PASSWORD, // 'secret'
              { algorithm: 'HS256' }
            )

            return res.status(200).json({ msg: "Login Successfull" + " " + email, token: token });
          } else {
            res.send("Login Failed")
          }
        })
    })
    .catch(err => {
      console.log(err)
      res.send(err);
    });
}
