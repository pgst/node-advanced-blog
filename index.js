const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

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
const BlogModel = mongoose.model('blog', BlogSchema);

// BLOG function
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create blog
app.get('/blog/create', (req, res) => {
  res.sendFile(__dirname + '/views/blogCreate.html');
});

app.post('/blog/create', (req, res) => {
  console.log('reqの中身', req.body);
  BlogModel.create(req.body, (error, savedBlogData) => {
    if (error) {
      console.log('データの書き込みが失敗しました');
      res.send('ブログデータの投稿が失敗しました');
    } else {
      console.log('データの書き込みが成功しました');
      res.send('ブログデータの投稿が成功しました');
    }
  });
});

// Read All Blogs
// Read Single Blog
// Update Blog
// Delete Blog

// Connecting to port
app.listen(5000, () => {
  console.log('Listening on localhost port 5000');
});
