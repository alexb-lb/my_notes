var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String, required: true}
}, {timestamps: true});


var commentSchema = new Schema(
  { rating: {type: Number, min: 1, max: 5, required: true},
    comment: {type: String, required: true},
    author: {type: String, required: true}},
  {timestamps: true});

var dishSchema = new Schema(
  { name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    comments: [commentSchema]},
  {timestamps: true});

var Dishes = mongoose.Model('Dish', dishSchema);