/**
 * Created by bobrenko on 31.05.2016.
 */
var express = require('express');
var morgan = require('morgan');

// позволяет читать body запроса к серверу
var bodyParser = require('body-parse');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// если придет боди в формате жсон, используем парсер
app.use(bodyParser.json());

// вызывает функцию, когда приходит запрос на /dishes
app.all('/dishes', function (req, res, next){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  next();
});

// любой запрос (например about.html) будет искаться в папке public
// __dirname - абсолютный путь к папке (оттуда, где лежит express)
// так что сервер можно запускать откуда угодно
app.use(express.static(__dirname + '/public'));

// короткая форма инициализации http модуля через express
app.listen(port, hostname, function (){
  console.log('Server running at http ' + hostname + ':' + port);
});
