'use strict';
moudle.exports = function (x, y, callback) {
  try {
    if (x < 0 || y < 0) {
      throw new Error("Rectangle params < 0: l=" + x + ", and b=" + y);
    }
    else
      callback(null, {
        perimeter: function (x, y) { return (2 * (x + y)); },
        area: function (x, y) { return (x * y); }
      });
  }
  catch (error) {
    callback(error, null);
  }
};

// использование функции из модуля
rect(l, b, function(err, rectangle){
  if(err) {
    console.log(err);
  } else {
    //...code....
  }
});