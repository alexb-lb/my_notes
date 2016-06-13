var session = require('express-session');
// поскольку запускаем локально, сохраняем в локальное хранилище
var FileStore = require('session-file-store')(session);

// инфа о сессии доступна по свойству req.session.name
app.use(session({
  name: 'session-id', // Id сессии
  secret: '12345-67890-09876-54321', // секретный ключ
  saveUninitialized: true,
  resave: true,
  store: new FileStore() // если открыто на локальном компе, будет сохранятся туда
}));