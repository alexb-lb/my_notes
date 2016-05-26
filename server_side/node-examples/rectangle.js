var rect = require('./rect1.js');

function solveRect(l, b) {
  console.log("Start calcing rectangle");

  if (l < 0 || b < 0) {
    console.log("Rectangle params should be greater then zero: length = " + l + ", breadth = " + b);
  } else {
    console.log("Area is " + rect.area(l, b));
    console.log("Perimeter is " + rect.perimeter(l, b));
  }
}

solveRect(5, 12);
solveRect(4, 2);
solveRect(-3, 4);