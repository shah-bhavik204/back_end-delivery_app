const getDb = require('../util/database').getDb;

exports.insertMultipleProducts = ((products, userData) => {
    console.log('nln',products,userData)
    const db = getDb();

    // if([0,1].includes(userData.user_type) ){
      let sanitizedProducts = products
      // .forEach( prod => {
      //   prod.created_by = userData._id
      // })

      return db.collection('products').insertMany(sanitizedProducts, {ordered: false})
        .then(result => {
          // if(result.ok)
          return result
          // console.log(result)
        })
        .catch(err => {
  
          return err
        })
    // }else{
      // console.log('wfw')
      // return {ok: false, msg: "User not Authorized"}
    // }

  });