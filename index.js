const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
const session = require('express-session');

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

// Defining the Schema and Model
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const BlogModel = mongoose.model('blog', BlogSchema);
const UserModel = mongoose.model('user', UserSchema);

// BLOG function
// Create blog
app.get('/blog/create', (req, res) => {
  if (req.session.userId) {
    res.render('blogCreate');
  } else {
    res.redirect('/user/login');
  }
});

app.post('/blog/create', (req, res) => {
  BlogModel.create(req.body, (error, savedBlogData) => {
    if (error) {
      res.render('error', { message: '/blog/createのエラー' });
    } else {
      res.redirect('/');
    }
  });
});

// Read All Blogs
app.get('/', async (req, res) => {
  const allBlogs = await BlogModel.find();
  res.render('index', { allBlogs: allBlogs, session: req.session.userId });
});

// Read Single Blog
app.get('/blog/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogRead', {
    singleBlog: singleBlog,
    session: req.session.userId,
  });
});

// Update Blog
app.get('/blog/update/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogUpdate', { singleBlog });
});

app.post('/blog/update/:id', (req, res) => {
  BlogModel.updateOne({ _id: req.params.id }, req.body).exec((error) => {
    if (error) {
      res.render('error', { message: '/blog/updateのエラー' });
    } else {
      res.redirect('/');
    }
  });
});

// Delete Blog
app.get('/blog/delete/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogDelete', { singleBlog });
});

app.post('/blog/delete/:id', (req, res) => {
  BlogModel.deleteOne({ _id: req.params.id }).exec((error) => {
    if (error) {
      res.render('error', { message: '/blog/deleteのエラー' });
    } else {
      res.redirect('/');
    }
  });
});

// User function
// Create User
app.get('/user/create', (req, res) => {
  res.render('userCreate');
});

app.post('/user/create', (req, res) => {
  UserModel.create(req.body, (error, savedUserData) => {
    if (error) {
      res.render('error', { message: '/user/createのエラー' });
    } else {
      res.redirect('/user/login');
    }
  });
});

// user Login
app.get('/user/login', (req, res) => {
  res.render('login');
});

app.post('/user/login', (req, res) => {
  UserModel.findOne({ email: req.body.email }, (error, savedUserData) => {
    if (savedUserData) {
      // ユーザーが存在した場合の処理
      if (req.body.password === savedUserData.password) {
        // パスワードが一致した場合の処理
        req.session.userId = savedUserData._id;
        res.redirect('/');
      } else {
        // パスワードが一致しなかった場合の処理
        res.render('error', {
          message: '/user/loginのエラー：パスワードが間違っています',
        });
      }
    } else {
      // ユーザーが存在しない場合の処理
      res.render('error', {
        message: '/user/loginのエラー：ユーザーが存在しません',
      });
    }
  });
});

// Connecting to port
app.listen(5000, () => {
  console.log('Listening on localhost port 5000');
});
