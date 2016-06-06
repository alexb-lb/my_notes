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

// определяем роутер, направляем в него парсер
var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// обрабатывыаем все запросы к корню через роутер
dishRouter.route('/')
  .all(function (req, res, next) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send all the dishes to you!')
  })
  .post(function (req, res, next){
    res.end('Will add the dish: ' + req.body.name + ' with details ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting all dishes');
  });

dishRouter.route('/:dishId')
  .all(function (req, res, next){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send details of the dish: ' + req.params.dishId);
  })
  .put(function (req, res, next){
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting dish ' + req.params.dishId);
  });

// если урл - dishes, включает роутер
app.use('/dishes', dishRouter);

// любой запрос (например about.html) будет искаться в папке public
app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function () {
  console.log('Server running at http ' + hostname + ':' + port);
});
