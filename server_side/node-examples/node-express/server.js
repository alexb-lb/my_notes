/**
 * Created by bobrenko on 31.05.2016.
 */
var express = require('express');
var morgan = require('morgan');

// позволяет читать body запроса к серверу
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// если придет боди в формате жсон, используем парсер
app.use(bodyParser.json());

// вызывает функцию, когда приходит запрос на /dishes
app.all('/dishes', function (req, res, next){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  next(); // позволяет продолжить выполнение
});

// по гету отдает что-то. Например, достает из БД
// next не вызывается, так что выполнения функции процесс прерывается
app.get('/dishes', function (req, res, next){
  res.end('any data');
});

// по посту добавляет новую информацию
app.post('/dishes', function (req, res, next){
  res.end('Will add data ' + req.body.name + ' with details: ' + req.body.description);
});

// по достает итем по ID. Добавить и delete - тоже самое
app.get('/dishes/:dishId', function (req, res, next){
  res.end('Will add data ' + req.params.dishId);
});

// модифицировать уже имеюийся итем
app.put('/dishes/:dishId', function (req, res, next){
  res.write('Updating data: ' + req.params.dishId + '/n');
  res.end('Will update data ' + req.body.name + 'with details: ' + req.body.description);
});

// любой запрос (например about.html) будет искаться в папке public
app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function (){
  console.log('Server running at http ' + hostname + ':' + port);
});
