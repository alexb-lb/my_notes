var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var promotionSchema = new Schema({
  name: {type: String, required: true, unique: true},
  image: {type: String, required: true},
  label: {type: String, default: ''},
  price: {type: Number, required: true},
  description: {type: String, required: true}
});

var Promotions = mongoose.model('Promotion', promotionSchema);
module.exports = Promotions;