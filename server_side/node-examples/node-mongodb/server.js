var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var dboper = require('./operations'); // подключаем модуль с операциями
var url = 'mongodb://localhost:27017/conFusion'; // подключаем ДБ

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to the server");

  // коллбек в коллбеке - после того, как одна операция отработала, она вызывает другую
  dboper.insertDocument(db, // INSERT
    {name: "Vadonut", description: "testing desc"},
    "dishes",
    function (result) {
      console.log(result.ops);

      dboper.findDocuments(db, // FIND
        "dishes",
        function (docs) {
          console.log(docs);

          dboper.updateDocument(db, // UPDATE
            {name: "Vadonut"},
            {description: "Updated Test"},
            "dishes", function (result) {
              console.log(result.result);

              dboper.findDocuments(db, // FIND
                "dishes",
                function (docs) {
                  console.log(docs);

                  db.dropCollection("dishes", // DROP
                    function (result) {
                      console.log(result);

                      db.close();
                    })
                })
            })
        })
    }
  )
});
