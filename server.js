// module depencies
var express = require('express')
  , app = express.createServer()
  , site = require('./controllers/site');

//config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', site.index);
app.get('/fetch/:station/:page', site.fetch);
app.get('/listen/:station', site.station);

//Run
app.listen(3000);
console.log('startin this bitch on 3000');
