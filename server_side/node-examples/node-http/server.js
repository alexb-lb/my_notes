/**
 * Created by bobrenko on 31.05.2016.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function(req, res){
  console.log('Request for ' + req.url + ' by method ' + req.method);

  if (req.method == 'GET'){
    var fileUrl;

    if(req.url == '/') fileUrl = '/index.html';
    else fileUrl = req.url;

    // на винде все / будут вревращены в \ и наобррот на UNIX
    var filePath = path.resolve('./public' + fileUrl);

    // возвращаем расширение файла, .html например
    var fileExt = path.extname(filePath);
    if (fileExt == '.html'){ // обрабатываем только html-файлы
      // проверка, существует ли файл по указанному пути
      fs.exists(filePath, function (exists){ // если файл существует
        if (!exists) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end('<h1>Error 404: ' + fileUrl + ' not found</h1>');
          return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(filePath).pipe(res)
      })
    }
  }
  else { // if request method is no a GET
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Error 404: ' + req.method  + ' not supported</h1>');
  }
});

server.listen(port, hostname, function (){
  console.log('Server running at http://' + hostname + ':' + port);
});