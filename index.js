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
app.get('/', async (req, res) => {
  const allBlogs = await BlogModel.find();
  console.log('全ブログデータ', allBlogs);
  res.send('全ブログデータを読み取りました');
});

// Read Single Blog
app.get('/blog/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log('singleBlog', singleBlog);
  res.send('個別の記事ページ');
});

// Update Blog
app.get('/blog/update/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log('singleBlog', singleBlog);
  res.send('個別の更新ページ');
});

app.post('/blog/update/:id', async (req, res) => {
  BlogModel.updateOne({ _id: req.params.id }, req.body).exec((error) => {
    if (error) {
      console.log('データの更新が失敗しました');
      res.send('ブログデータの更新が失敗しました');
    } else {
      console.log('データの更新が成功しました');
      res.send('ブログデータの更新が成功しました');
    }
  });
});

// Delete Blog
app.get('/blog/delete/:id', async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  console.log('singleBlog', singleBlog);
  res.send('個別の削除ページ');
});

app.post('/blog/delete/:id', async (req, res) => {
  BlogModel.deleteOne({ _id: req.params.id }).exec((error) => {
    if (error) {
      console.log('データの削除が失敗しました');
      res.send('ブログデータの削除が失敗しました');
    } else {
      console.log('データの削除が成功しました');
      res.send('ブログデータの削除が成功しました');
    }
  });
});

// Connecting to port
app.listen(5000, () => {
  console.log('Listening on localhost port 5000');
});
