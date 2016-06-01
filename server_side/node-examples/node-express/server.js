/**
 * Created by bobrenko on 31.05.2016.
 */
var express = require('express');

// позволяет писать логи
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

// dev - один из готовых шаблонов вывода логов
app.use(morgan('dev'));

// любой запрос (например about.html) будет искаться в папке public
// __dirname - абсолютный путь к папке (оттуда, где лежит express)
// так что сервер можно запускать откуда угодно
app.use(express.static(__dirname + '/public'));

// короткая форма инициализации http модуля через express
app.listen(port, hostname, function (){
  console.log('Server running at http ' + hostname + ':' + port);
});
