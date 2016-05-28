//подключения модуля для ввода параметров через командную строку
var argv = require('yargs')
  .usage('Usage: node $0 --l [num] --b [num]')
  .demand(['l','b'])
  .argv;

// использование функции из модуля
var rect = require('./rectangle');

function solveRect(l,b){
  rect(l, b, function(err, rectangle){
    if(err) { // если первым параметром придет ошибка - отобразить в консоли
      console.log(err);
    } else {
      console.log("area: " + rectangle.area());
      console.log("perimeter " + rectangle.perimeter());
    }
  });
}

solveRect(argv.l, argv.b);

// node rect2 --l=2 --b=4
//
//var argv = require('yargs')
//  .usage('Usage: $0 -w [num] -h [num]')
//  .demand(['w','h'])
//  .argv;

//console.log("The area is:", argv.w * argv.h);