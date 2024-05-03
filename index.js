const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://pgstaka:Guru0521!@cluster0.gw0z3um.mongodb.net/blogUserDatabase?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Success: Connected to MongoDB');
  })
  .catch((err) => console.log('Failure: Unconnected to MongoDB'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/blog/create', (req, res) => {
  res.sendFile(__dirname + '/views/blogCreate.html');
});

app.post('/blog/create', (req, res) => {
  console.log('reqの中身', req.body);
  res.send('ブログデータを投稿しました');
});

// app.post('/', (req, res) => {
//   console.log('POST request received');
// });

app.listen(5000, () => {
  console.log('Listening on localhost port 5000');
});
