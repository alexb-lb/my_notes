var express = require('express');
var dishRouter = express.Router();
var mongoose = require('mongoose');

var Dishes = require('../models/dishes.js');
var Verify = require('./verify');

// обрабатывыаем все запросы к корню через роутер
dishRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {

    Dishes.find({})
      .populate('comments.postedBy') // присоединили обьект с комментариями по блюду
      .exec(function (err, dishes){ // выполнили коллбек-функцию
        if(err) throw err;
        res.json(dishes)
      });
  })
  .post(Verify.verifyAdmin, function (req, res, next) {
    // первый параметр - спарсенное body с клиентского запроса на добавление
    Dishes.create(req.body, function (err, dish) {
      if (err) throw err;

      console.log('Dishes created!');
      var id = dish._id; // вернет уже dish с id из базы
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Added the dish with id: ' + id);
    })
  })
  .delete(Verify.verifyAdmin, function (req, res, next) {
    // удалить все данные из коллекции документов dishes
    Dishes.remove({}, function (err, dishes) {
      if (err) throw err;
      res.json(dishes)
    })
  });

/*** КОНКРЕТНОЕ БЛЮДО ПО DISH ID ***/
dishRouter.route('/:dishId') // post не нужен - мы можем добавить dish в общую коллекцию
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
      .populate('comments.postedBy') // присоединили обьект с комментариями по блюду
      .exec(function (err, dish){ // выполнили коллбек-функцию
        if(err) throw err;
        res.json(dish)
      });
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

/*** КОММЕНТАРИИ ***/
dishRouter.route('/:dishId/comments')
  .all(Verify.verifyOrdinaryUser) // для всех операций проверяем, зареган ли юзер
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
      .populate('comments.postedBy') // присоединили обьект с комментариями по блюду
      .exec(function (err, dish){ // выполнили коллбек-функцию
        if(err) throw err;
        res.json(dish.comments)
      });
  })
  .post(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
      if (err) throw err;
      // записываем id пользователя из полученного ранее параметра req.decoded
      req.body.postedBy = req.decoded._doc._id;
      // пушим коммент, автоматически вставляется так же id пользователя
      dish.comments.push(req.body);
      dish.save(function (err, dish){
        if (err) throw err;

        console.log('Updated comments!');
        console.log(dish);
        res.json(dish);
      })
    })
  })
  // разрешим удаление всех комментов только администратору
  .delete(Verify.verifyAdmin, function (req, res, next) {
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

/*** КОНКРЕТНЫЙ КОММЕНТАРИЙ ***/
dishRouter.route('/:dishId/comments/:commentId')
  .all(Verify.verifyOrdinaryUser) // для всех операций проверяем, зареган ли юзер
  .get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
      .populate('comments.postedBy') // присоединили обьект с комментариями по блюду
      .exec(function (err, dish){ // выполнили коллбек-функцию
        if(err) throw err;
        res.json(dish.comments.id(req.params.commentId));
      });
  })
  .put(function (req, res, next) {
    // не апдейтит, а удаляет старый коммент и пихает новый с другим ID
    Dishes.findById(req.params.dishId, function (err, dish){
      if (err) throw err;

      dish.comments.id(req.params.commentId).remove();
      // записываем id пользователя из полученного ранее параметра req.decoded
      req.body.postedBy = req.decoded._doc._id;

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

      // проверим, собственный ли это коммент юзера
      if(dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id){
        var err = new Error('You are not authorized to do this');
        err.status = 403;
        return next(err);
      }

      dish.comments.id(req.params.commentId).remove(); // удаляем коммент
      dish.save(function (err, resp){ // добавляем новый коммент на его место
        if (err) throw err;
        res.json(resp);
      })
    });
  });

module.exports = dishRouter;