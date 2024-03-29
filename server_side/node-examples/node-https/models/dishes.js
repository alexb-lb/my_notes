var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  rating: {type: Number, min: 1, max: 5,required: true}, // валидация по числу
  comment: {type: String, required: true},
  // author: {type: String,required: true}
  // вместо автора, делаем ссылку на ID обьекта коллекции User
  // это позволит вывести комменты по конкретному блюду через .populate()
  // а так же сравнивать ID автора с ID пользователя, для редактирования коммента
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

var dishSchema = new Schema({
  name: {type: String, required: true, unique: true},
  image: {type: String, required: true},
  category: {type: String, required: true},
  label: {type: String, default: ''},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  comments: [commentSchema]
}, {timestamps: true});

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;

