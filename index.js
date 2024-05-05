const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const routers = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
mongoose.set('strictQuery', false);

// Session
app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);

// Connecting to MongoDB
mongoose
  .connect(
    'mongodb+srv://pgstaka:Guru0521!@cluster0.gw0z3um.mongodb.net/blogUserDatabase?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Success: Connected to MongoDB');
  })
  .catch((err) => console.log('Failure: Unconnected to MongoDB'));

app.use(routers);

// Page Notfound
app.get('*', (req, res) => {
  res.render('error', { message: 'ページが見つかりません' });
});

// Connecting to port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
