const getDb = require('../util/database').getDb;


exports.checkUser = ((email_id, phone_no) => {
    const db = getDb();
    // console.log('=====',this.email_id)
    return db.collection('users').aggregate([
        {"$match": { "email_id": email_id }
        // {"$match": { $or: [{ "email_id": email_id }, { "phone_no": phone_no }] }  //For unique phone_no but has some issue in loginUSer 
      }
    ])
    .toArray()
    .then(result => {
      return result
    })
    .catch(err => {
      console.log(err)
    })
  });