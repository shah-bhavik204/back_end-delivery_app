const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const {expressValidator} = require('express-validator')

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
  //   // res.json({
    //   //   title: "My first response"
    //   // })
    //   next();
    // });
app.use(express.json());
// app.use(expressValidator.check())

app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use(errorController.get404);

mongoConnect(client => {
  // console.log('===>',client);
  app.listen(3000);
});
