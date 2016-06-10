var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaders = new Schema({
  name: {type: String, required: true, unique: true},
  image: {type: String, required: true},
  designation: {type: String, required: true},
  abbr: {type: String, required: true},
  description: {type: String, required: true}
});

var Leaders = mongoose.model('Leader', leaders);
module.exports = Leaders;
