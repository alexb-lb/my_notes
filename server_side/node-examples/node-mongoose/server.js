var mongoose = require('mongoose');
var assert = require('assert');
var Dishes = require('./models/dishes1');

// connection
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url); // соединяемся с базой
var db = mongoose.connection; // делаем db - соединение с mongoose
// если произошла ошибка соединения, выводим код ошибки
db.on('error', console.error.bind(console, 'connection error:'));

// если все хорошо, запускаем только один раз функцию, которая будет делать:
db.once('open', function (){
  console.log("Connected correctly to server");


  Dishes.create({ // создать новой документ dish по шаблону схемы
    name: "Ultrapizza",
    description: 'Test'
  }, function (err, dish){ // колбек вызывается сразу после создания док-а
    if (err) throw err;

    console.log('Dish created!');
    console.log(dish);
    var id = dish._id; // сохраняем уникальный id документа

    setTimeout(function (){ // ставим таймер на 3 сек
      Dishes.findByIdAndUpdate(id, { // UPDATE существующего док-а по id
        $set: {
          description: 'Updated Test' // указываем, на что меняем
        }
      }, {
        new: true // какой док вернуть? true - измененный, false - старый
      })
        .exec(function (err, dish){ // выполнить после предыдущ. операции
          if (err) throw err;

          console.log('Updated dish!');
          console.log(dish);

          db.close();

          db.collection('dishes').drop(function (){ // DROP
            db.close(); // отключиться
          });
      })
    }, 3000);
  })
});