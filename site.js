//Module dependecies
var request = require('request')
  , jsdom = require('jsdom')
  , jquery = require('jquery')
  , select = require('soupselect').select
  , htmlparser = require('htmlparser');

//Public Methods
exports.index = function(req, res){
  res.render('index', { 
    locals: {
      title: 'Nah Right Radio' 
    }
  });
};

exports.fetch = function(req, res){
  var page = req.params.page
    , host = 'http://www.nahright.com'
    , path = '/news/page/';

  _scrape(host, path, page, function(result){
     res.send(JSON.stringify(result));
  });
}

//Private Methods
function _find (match, attr, element){
  var result = false;
  if (!element.children) return result;
  for (var i = 0, l = element.children.length; i < l; i++) {
    var child = element.children[i];

    if (new RegExp(match).test(child[attr])) {
      result = child;
      break;
    }
    else {
      var find = _find(match, attr, child);
      if (find) {
        result = find;
        break;
      }
    }
  }
  return result;
}

function _scrape (host, path, page, callback){
  
  //make request
  request({uri:host + path + page}, function (error, response, body) {
        
    if (!error && response.statusCode == 200) { 
      
      //define handler
      var handler = new htmlparser.DefaultHandler(function (err, dom) {

        if (err) return console.log("Error: " + err);
        var posts = select(dom, '.post')
          , result = [];
    
        posts.forEach(function (post) {
          
          //parse post data 
          var data = _find('script', 'name', post);
          
          if (!data) return;
          if (!data.children[0].data.match('hcode')) return;
          data = data.children[0].data.match(/"[^\"]*"/gi);
          if (!data.length) return;

          //mp3
          var mp3 = 'http://www.hulkshare.com/ap-' + data[0].replace(/\"/g, '');

          //parse img
          var img = _find('img', 'name', post)
          img = img ? img.attribs.src : '/noimage.jpg';

          //parse title
          var title = data[1].replace(/\"/g, '');
         
          //push result 
          result.push({
            mp3: mp3,
            photo: img,
            title: title
          });

        });
     
        callback(result);

      });

      var parser = new htmlparser.Parser(handler);
      parser.parseComplete(body);

    }
 
  });

}
