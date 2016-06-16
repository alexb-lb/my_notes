var express = require('express');
var morgan = require('morgan');
// заменяем cookieParser на экспресс сессии
var session = require('express-session');
// подключаем хранилище для сохранения инфы по сессиям
var FileStore = require('session-file-store')(session);

var hostname = 'localhost';
var port = 3000;

var app = express();
app.use(morgan('dev'));
// использование экспресс-сессий
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: true, // принужительно записывать каждую сессию
  resave: true,
  store: new FileStore() // подключили модуль хранилища. По ум. сох. в оперативку
}));



function auth(req, res, next){
  console.log(req.headers);
  // если у клиента нет подписанных сервером cookies
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) { // если инфы по авторизации нету
      var err = new Error('You are not authorized!');
      err.status = 401; // ошибка авторизации
      next(err);
      return;
    }
    // вытаскиваем данные из base64 строки из заголовка запроса
    var auth = new Buffer(authHeader.split(' ')[1], 'base64')
      .toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    console.log(user);
    console.log(pass);
    // если пара логин/пароль подходит
    if (user == 'admin' && pass == 'password') {
      // устанавливаем user:'admin', подписываем и шифруем с исп-ем. ключа
      req.session.user = 'admin';
      next();
    } else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  } // если в хедера запроса уже пришли установленные куки
  else {
    // и если у подписанных куки user: 'admin'
    if(req.session.user === 'admin') {
      console.log('req.session: ', req.session);
      next();
    } else { // если нет, значит юзер пытался подделать их
      var err = new Error ('Хакер, ты не пройдешь!!');
      err.status = 401;
      next(err);
    }
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
  console.log('Server running at http://' + hostname + ':' + port);
});
