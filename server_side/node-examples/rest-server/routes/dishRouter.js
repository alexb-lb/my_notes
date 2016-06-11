var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Dishes = require('/models/dishes');

// обрабатывыаем все запросы к корню через роутер
router.route('/')
  .get(function (req, res, next) {
    Dishes.find({}, function (err, dishes) {
      if (err) throw err;
      res.json(dishes); // отослать ответ в формате json
    })
  })
  .post(function (req, res, next) {
    // первый параметр - спарсенное body с клиентского запроса на добавление
    Dishes.create(req.body, function (err, dish) {
      if (err) throw err;

      console.log('Dishes created!');
      var id = data._id; // вернет уже dish с id из базы
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Added the dish with id: ' + id);
    })
  })
  .delete(function (req, res, next) {
    // удалить все данные из коллекции документов dishes
    Dishes.remove({}, function (err, dishes) {
      if (err) throw err;
      res.json(dishes)
    })
  });

router.route('/:dishId') // post не нужен - мы можем добавить dish в общую коллекцию
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;
      res.json(dish);
    })
  })
  .put(function (req, res, next) {
    Dishes.findByIdAndUpdate(
      req.params.dishId,  // ищет по dishId
      {$set: req.body}, // считывает то, что нужно обновить
      {new: true}, // передать в коллбек уже обновленный документ
      function (err, dish) {
        if (err) throw err;
        res.json(dish); // покажет обновленный документ
      });
  })
  .delete(function (req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, dish) {
        if (err) throw err;
        res.json(dish);
      });
  });

module.exports = router;