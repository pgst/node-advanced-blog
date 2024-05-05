const UserModel = require('../../models/user');

module.exports = (req, res) => {
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
};
