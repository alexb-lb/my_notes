var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true  // index - будет ошибка, если имя не уникально
  },
  description: {
    type: String,
    required: true
  }
}, {timestamps: true});

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;