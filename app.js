// module depencies
var express = require('express')
  , app = express.createServer()
  , site = require('./controllers/site');

console.log(__dirname);

//config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.staticProvider(__dirname + '/public'));

//Routes
app.get('/', site.index);
app.get('/fetch/:station/:page', site.fetch);
app.get('/listen/:station', site.station);
      
//Run
app.listen(3000);
console.log('startin this bitch on 3000');
