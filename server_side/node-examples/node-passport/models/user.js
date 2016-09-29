var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String, // если не указать явно, модуль их вставит автоматически
  password: String, // если их не указать явно, модуль их вставит автоматически
  firstname: {type: String, default: ''},
  lastname: {type: String, default: ''},
  admin: {type: Boolean, default: false}
});

// расширение methods позволяет создавать свои собственные методы схемы
User.methods.getName = function (){
  return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);