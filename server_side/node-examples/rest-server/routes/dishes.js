var express = require('express');
var router = express.Router();

// обрабатывыаем все запросы к корню через роутер
router.route('/')
  .all(function (req, res, next) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send all the dish to you!')
  })
  .post(function (req, res, next){
    res.end('Will add the dish: ' + req.body.name + ' with details ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting all dishes');
  });

router.route('/:dishId')
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

module.exports = router;