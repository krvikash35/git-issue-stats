var express = require ('express');
var app = express();
app.use(express.static("node_modules"));
app.use(express.static("app"));


var APP_PORT = process.env.PORT || 3000;
var APP_HOST = process.env.HOST || '0.0.0.0';

app.listen(APP_PORT, APP_HOST, function () {
  console.log("server listening on: "+ APP_HOST + ":" + APP_PORT);
})
