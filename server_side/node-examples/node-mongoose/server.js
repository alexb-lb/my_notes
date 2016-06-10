var mongoose = require('mongoose');
var assert = require('assert');
var Dishes = require('./models/dishes3');

// connection
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url); // соединяемся с базой
var db = mongoose.connection; // делаем db - соединение с mongoose
// если произошла ошибка соединения, выводим код ошибки
db.on('error', console.error.bind(console, 'connection error:'));

// если все хорошо, запускаем только один раз функцию, которая будет делать:
db.once('open', function () {
  console.log("Connected correctly to server");

  Dishes.create({
    name: "Ultrapizza",
    description: 'Test',
    comments: [{rating: 3, comment: 'This is insane', author: 'Matt Daemon'}]
  }, function (err, dish) {
    if (err) throw err;

    console.log('Dish created!');
    console.log(dish);
    var id = dish._id;

    setTimeout(function () {
      Dishes.findByIdAndUpdate(id, {
          $set: {description: 'Updated Test'}
        }, {new: true})
        .exec(function (err, dish) {
          if (err) throw err;

          console.log('Updated dish!');
          console.log(dish);

          // используем пуш, поскольку значения в массиве
          dish.comments.push({
            rating: 5,
            comment: 'I\`m getting a sinking feeling!',
            author: 'Leonardo di Caprio'
          });
          // сохраним результат пуша
          dish.save(function (err, dish) {
            console.log("Updated Comments!");
            console.log(dish);

            db.collection('dishes').drop(function () {
              db.close();
            });
          })
        })
    }, 3000);
  })
});
