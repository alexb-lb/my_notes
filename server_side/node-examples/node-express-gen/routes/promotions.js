var express = require('express');
var router = express.Router();

// обрабатывыаем все запросы к корню через роутер
router.route('/')
  .all(function (req, res, next) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send all the PROMO to you!')
  })
  .post(function (req, res, next){
    res.end('Will add the PROMO: ' + req.body.name + ' with details ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting all PROMOes');
  });

router.route('/:promoId')
  .all(function (req, res, next){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send details of the PROMO: ' + req.params.promoId);
  })
  .put(function (req, res, next){
    res.end('Will update the PROMO: ' + req.body.name + ' with details: ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting PROMO ' + req.params.promoId);
  });

module.exports = router;