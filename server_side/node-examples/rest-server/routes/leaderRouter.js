var express = require('express');
var router = express.Router();

// обрабатывыаем все запросы к корню через роутер
router.route('/')
  .all(function (req, res, next) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send all the leader to you!')
  })
  .delete(function (req, res, next){
    res.end('Deleting all leaderes');
  });

router.route('/:leaderId')
  .all(function (req, res, next){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
  })
  .get(function (req, res, next){
    res.end('Will send details of the leader: ' + req.params.leaderId);
  })
  .post(function (req, res, next){
    res.end('Will add the leader: ' + req.body.name + ' with details ' + req.body.description);
  })
  .put(function (req, res, next){
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
  })
  .delete(function (req, res, next){
    res.end('Deleting leader ' + req.params.leaderId);
  });

module.exports = router;
