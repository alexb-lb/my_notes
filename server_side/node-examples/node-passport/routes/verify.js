var User = require('../models/user');
var jwt = require("jsonwebtoken"); // используется для создания и сверки токенов
var config = require("../config.js");

exports.getToken = function (user){
  // подписывает токен на 1 час (3600 сек)
  return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};


exports.verifyOrdinaryUser = function (req, res, next){
  // token должен быть в одном из этих мест body запроса с клиента:
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // если токен пришел в запросе
  if(token){
    // вытаскивает и проверяет данные из токена
    jwt.verify(token, config.secretKey, function (err, decoded){
      if (err){
        var err = new Error ('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        // ложит раскодированный токен в request для проброски дальше
        req.decoded = decoded;
        next();
      }
    });
  }
  else { // если токен не пришел с запросом с клиента
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};