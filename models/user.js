const getDb = require('../util/database').getDb;
const loginUser = require('./user_login');

module.exports = class User {
  constructor(user_obj){
    
      // this.email_id = email_id;
      // this.password = password;
      this.first_name = user_obj.first_name;
      this.last_name = user_obj.last_name;
      this.user_type = user_obj.user_type; 
      this.email_id = user_obj.email_id;
      this.password = user_obj.password;
      this.phone_no = user_obj.phone_no;
      this.address_line1 = user_obj.address_line1;
      this.address_line2 = user_obj.address_line2;
      this.city = user_obj.city;
      this.state = user_obj.state;
      this.pincode = user_obj.pincode;
  }
  save(){
    const db = getDb();
    return loginUser.checkUser(this.email_id, this.phone_no)
    .then(isNewUser => {
      console.log('----',isNewUser)
      if(!isNewUser.length){
        return db.collection('users').insertOne(this)
        .then(result => {
          // if(result.ok){
            console.log(result.ops[0])
            return { 
              ok: true, 
              msg: "User added", 
              metaData: result.ops[0]
            }
          // }
        }) 
        .catch(err => {
          console.log(err)
        })
      }else{
        return { msg: "User exist"}
      }
    })
    
  }
  
  static fetchAllProducts(){
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then( products => {
      return products
    })
    .catch(err => {
      console.log(err)
    })
  }
  static findProductById(){

  }
}


