var express = require('express');
var dishRouter = express.Router();
var mongoose = require('mongoose');

var Dishes = require('../models/dishes.js');

// обрабатывыаем все запросы к корню через роутер
dishRouter.route('/')
  .get(function (req, res, next) {

    Dishes.find({}, function (err, dishes) {
      if (err) throw err;
      console.log(dishes);
      res.json(dishes); // отослать ответ в формате json
    })
  })
  .post(function (req, res, next) {
    // первый параметр - спарсенное body с клиентского запроса на добавление
    Dishes.create(req.body, function (err, dish) {
      if (err) throw err;

      console.log('Dishes created!');
      var id = dish._id; // вернет уже dish с id из базы
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

// dish по ID
dishRouter.route('/:dishId') // post не нужен - мы можем добавить dish в общую коллекцию
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

//  комменты
dishRouter.route('/:dishId/comments')
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;
      res.json(dish.comments); // извлекает из обьекта dish свойство c комментами
    })
  })
  .post(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;

      dish.comments.push(req.body);
      dish.save(function (err, dish){
        if (err) throw err;

        console.log('Updated comments!');
        console.log(dish);
        res.json(dish);
      })
    })
  })
  .delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;

      // находим количество комментов по данному блюду
      for(var i = 0; i < dish.comments.length; i++){
        // удаляем по id
        dish.comments.id(dish.comments[i]._id).remove();
      }

      dish.save(function (err, dish){
        if (err) throw err;

        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Deleted all comments!');
      })
    });
  });

// для конкретного коммента
dishRouter.route('/:dishId/comments/:commentId')
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;
      // возвращаем из базы совпадающий id, который был в запросе
      res.json(dish.comments.id(req.params.commentId));
    })
  })
  .put(function (req, res, next) {
    // не апдейтит, а удаляет старый коммент и пихает новый с другим ID
    Dishes.findById(req.params.dishId, function (err, dish){
      if (err) throw err;

      dish.comments.id(req.params.commentId).remove();
      dish.comments.push(req.body);
      dish.save(function (err, dish){
        if(err) throw err;

        console.log('Updated comments!');
        console.log(dish);
        res.json(dish);
      });
    });
  })
  .delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      dish.comments.id(req.params.commentId).remove();

      dish.save(function (err, resp){
        if (err) throw err;
        res.json(resp);
      })
    });
  });

module.exports = dishRouter;