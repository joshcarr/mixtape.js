//Module dependecies
//==================================
var request = require('request')
  , jsdom = require('jsdom')
  , jquery = require('jquery')
  , select = require('soupselect').select
  , htmlparser = require('htmlparser')
  , config = require('../config');


//Public Methods
//===================================
exports.index = function (req, res) {
  res.render('player', {
      title: 'Mixtape.js Radio',
      station: 'unpiano'
  });
};

exports.station = function (req, res) {
  res.render('player', {
    title: 'Mixtape.js Radio (' + config.stations[req.param('station')].name + ')',
    station: req.param('station')
  });
};

exports.fetch = function(req, res){
  var page = req.param('page')
    , station = req.param('station');

  _scrape(station, page, function(result){
     res.send(JSON.stringify(result));
  });
};


//Private Methods
//==================================
function _nahRight (post) {
  //parse post data
  var data = select(post, 'script');
  if (!data.length) return;
  data = data[0];
  if (!data.children[0].data.match('hcode')) return;
  data = data.children[0].data.match(/"[^\"]*"/gi);
  if (!data.length) return;

  //mp3
  var mp3 = 'http://www.hulkshare.com/ap-' + data[0].replace(/\"/g, '');

  //parse img
  var img = select(post, 'img');
  img = img.length ? img[0].attribs.src : '/noimage.jpg';

  //parse title
  var title = data[1].replace(/\"/g, '');

  //push result
  return { mp3: mp3
         , photo: img
         , title: title
         };
}

function _genericMP3 (post) {
  var links = select(post, 'a')
    , mp3s = [];

  if (!links || !links.length) return false;

  links.forEach(function (link) {
    if (link.attribs.href && link.attribs.href.match(/.mp3$/)) mp3s.push(link.attribs.href);
  });

  if (!mp3s.length) return;

  //parseimg
  var img = select(post, 'img');
  img = img[0] ? img[0].attribs.src : '/noimage.jpg';

  var response = [];

  mp3s.forEach(function(mp3){
    response.push({
      mp3: mp3,
      photo: img,
      title: mp3.match(/[^\.\/]*\.mp3$/)[0]
    });
  });

  return response;
}


function _scrape (station, page, callback){

  var host = config.stations[station].host
    , path = config.stations[station].path;

  //make request
  request({uri:host + path + page}, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      //define handler
      var handler = new htmlparser.DefaultHandler(function (err, dom) {

        if (err) return console.log("Error: " + err);
        var posts = select(dom, '.post')
          , result = [];

        posts.forEach(function (post) {
          post = _processPost(host, post);
          if (post) result.push(post);
        });

        //flatten array :/
        result = jquery.map(result, function(item){
          return item
        });

        callback(result);

      });

      var parser = new htmlparser.Parser(handler);
      parser.parseComplete(body);

    }

  });

}

function _processPost (host, post) {
  return host.match('nahright') ? _nahRight(post) : _genericMP3(post);
}
