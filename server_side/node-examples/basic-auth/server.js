var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();
app.use(morgan('dev'));

function auth(req, res, next){
  console.log(req.headers);

  var authHeader = req.headers.authorization;
  if (!authHeader){ // если инфы по авторизации нету
    var err = new Error('You are not authorized!');
    err.status = 401; // ошибка авторизации
    // дальше будут вызваны только те функции,
    // которые обрабатывают эту ошибку, остальные будут пропущены
    next(err);
    return;
  }
  // 1. делает массив из пришедшей строки по пробелу
  // 2. декодирует второй элемент массива из base64
  // 3. конкатерирует все опять в строку
  // 4. делает массив из строки по разделителю ":"
  var auth = new Buffer(authHeader.split(' ')[1],'base64')
    .toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  // если пара логин/пароль подходит
  if(user == 'admin' && pass == 'password') {
    next(); // продолжаем выполнение функций
  } else {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    next(err);
  }
}

// если не было ошибки, считывание файла будет продолжаться дальше
// функции ниже будут выполнены
app.use(auth);
app.use(express.static(__dirname + '/public'));

// обработка ошибок аутентификации
app.use(function (err, req, res, next){
  res.writeHead(err.status || 500, {
    'WWW-Authenticate': 'Basic',
    'Content-Type': 'text/plain'
  });
  res.end(err.message);
});

app.listen(port, hostname, function (){
  console.log('Server running at http://${hostname}:${port}/');
});
