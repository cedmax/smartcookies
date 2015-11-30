var express = require('express');
var settings = require('./settings.json');
var data = require('./smartcookies.json').cookies;

var app = express();

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.enable('view cache');
app.engine('html', require('hogan-express'));
app.use(require('express-autoprefixer')({ browsers: 'last 2 versions', cascade: false })).use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.locals = data[Math.floor(Math.random()*data.length)];
  res.render('index');
});

var server = app.listen(settings.port);
