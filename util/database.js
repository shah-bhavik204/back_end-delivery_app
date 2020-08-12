const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://dungenMaster:dun123MAS*()@cluster0-dzexk.mongodb.net/cluster0?retryWrites=true&w=majority',{ useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw "No db found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
