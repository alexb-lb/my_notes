var mongoose = require('mongoose');
var assert = require('assert');
var Dishes = require('./models/dishes');
var Promotions = require('./models/promotions');
var Leaders = require('./models/leaders');

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
    image: "images/ultrapizza.png",
    category: "main",
    label: "Hot",
    price: 10.12,
    description: "A unique...",
    comments: [
      {
        rating: 5,
        comment: "Imagine all the eatables, living in conFusion!",
        author: "John Lemon"
      }, {
        rating: 4,
        comment: "Sends enyone to heaven, I wish I could get my mother-in-law to eat",
        author: "Paul McVites"
      }
    ]
  }, function (err, data) {
    if (err) throw err;

    Dishes.create({
      name: "Test dish",
      image: "images/test.png",
      category: "main",
      price: 100,
      description: "wtf",
      comments: [
        {
          rating: 5,
          comment: "Its just a piece of suxxen test",
          author: "Alex the greatest"
        }
      ]
    }, function (err, data) {
      if (err) throw err;

      Promotions.create({
        name: "Weekend Grand Buffet",
        image: "images/buffet.png",
        label: "New",
        price: 19.99,
        description: "Featuring..."
      }, function (err, data) {
        if (err) throw err;

        Leaders.create({
          name: "Peter Pan",
          image: "images/alberto.png",
          designation: "Chief Executive Officer",
          abbr: "CEO",
          description: "Our CEO, Peter..."
        }, function (err, data) {
          if (err) throw err;

          Promotions.find({}, function (err, data) {
            console.log("Promotions:");
            console.log(data);
          });

          Leaders.find({}, function (err, data) {
            console.log("Leaders:");
            console.log(data);
          });

          Dishes.find({}, function (err, data) {
            console.log("Dishes:");
            console.log(data);
          });

          setTimeout(function (){
            console.log("bye!");
            db.close();
          }, 2000)
        })
      });
    });
  });
});
