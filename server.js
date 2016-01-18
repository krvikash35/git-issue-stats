var express = require ('express');
var app = express();
app.use(express.static("node_modules"));
app.use(express.static("app"));

app.listen(process.env.PORT, '0.0.0.0', function () {
  console.log("server listening on port: 8081");
})
