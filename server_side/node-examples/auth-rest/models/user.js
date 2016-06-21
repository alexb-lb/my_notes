var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String, // если не указать явно, модуль их вставит автоматически
  password: String, // если их не указать явно, модуль их вставит автоматически
  admin: { // по умолчанию будет  false
    type: Boolean,
    default: false
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);