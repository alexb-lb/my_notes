var express = require('express');
var router = express.Router();
var passport = require('passport'); // подключили модуль паспорта
var User = require('../models/user'); // подключили созданную выше модель юзера
var Verify = require('./verify'); // проверка инфы о юзере через jsonWebTokens

/* GET users listing. */
router.route('/').get(Verify.verifyAdmin, function (req, res, next) {
  User.find({}, function (err, users) {
    //if (err) throw err;
    res.json(users); // отослать ответ в формате json
  })
});

router.post('/test', function (req, res){
  console.log("suka")
  //return res.status(200).json({status: req.body.username}); // вернем статус 500 если ошибка
  // return res.status(200).json({status: "working"}); // вернем статус 500 если ошибка
});

// ссылка типа http://localhost:3000/users/register будет запускать код
// post - подразумевает отправку информации в теле запроса - логин и пароль
router.post('/register', function (req, res) {
  console.log("register!Q@!");
  // User.register:
  // 1й параметр - имя пользователя
  // 2й параметр - пароль
  // 3й - вызов callback функции, которая вернет зареганого пользователя или ошибку
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    function (err, user) { //callback, возвращает ошибку или нового зареганого юзера
      if (err) {
        return res.status(500).json({err: err}); // вернем статус 500 если ошибка
      }
      // забираем имя и фамилию из запроса, если они были указаны
      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.larstname = req.body.lastname;
      }
      // сохраняет информацию о пользователе, а потом делает проверку аутентификации
      user.save(function (err, user){
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({status: 'Registration successful!'});
        }); // passport.authenticate
      }); // user.save end
    }); // User.register
}); // router.post

// ссылка типа http://localhost:3000/users/login будет запускать код
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }

    // если user == null,  возвращаем ошибку - вы не аутентифицированы
    if (!user) {
      return res.status(401).json({
        err: info // может быть шибка: дубликат юзера и т.д.
      });
    }

    // метод, который пытается залогинить юзера
    req.logIn(user, function (err) {
      // если ошибка - вернем статус 500
      if (err) return res.status(500).json({err: 'Could not log in user'});

      console.log('User in users: ', user);

      var token = Verify.getToken(user);

      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token // отсылаем токен с данными назад, который будет всегда отправляться
      });
    });
  })(req, res, next); // передаем данные из request и responce в passport.authenticate
});

// ссылка типа http://localhost:3000/users/logout будет запускать код
router.get('/logout', function (req, res) {
  req.logout(); // метод вылогинивает пользователя
  req.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
