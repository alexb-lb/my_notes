var assert = require('assert');

exports.insertDocument = function (db, document, collection, callback){
  // получить коллекцию документов
  var coll = db.collection(collection);
  // вставим документ
  coll.insert(document, function (err, result) {
    assert.equal(err, null);
    console.log("Inserted " + result.result.n + " documents into collection " + collection);
    callback(result); // вызов коллбека после выполнения операции
  });
};

exports.findDocuments = function (db, collection, callback){
  // получить коллекцию документов
  var coll = db.collection(collection);
  // найти документы
  coll.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs); // вызов коллбека после выполнения операции
  });
};

exports.removeDocument = function (db, document, collection, callback){
  // получить коллекцию документов
  var coll = db.collection(collection);
  // удалить первый подходящий под критерии документ
  coll.deleteOne(document, function (err, result) {
    assert.equal(err, null);
    console.log("Removed the document " + document);
    callback(result); // вызов коллбека после выполнения операции
  });
};

exports.updateDocument = function (db, document, update, collection, callback){
  // получить коллекцию документов
  var coll = db.collection(collection);
  // изменить первый подходящий документ
  coll.updateOne(document,
    {$set: update}, // какое конкретное поле надо изменить
    null,
    function (err, result) {
    assert.equal(err, null);
    console.log("Updated the document with" + update);
    callback(result); // вызов коллбека после выполнения операции
  });
};