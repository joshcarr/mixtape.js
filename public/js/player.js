var Player = {

  currentAudio: null,
  manualSeek: false,
  laoded: false,
  playlist: [],
  page: 1,
  song: 0,

  initialize: function () {
    if(!document.createElement('audio').canPlayType) return false; //no html5 support
    this.requestSongs(function () {
      this.playSong();
      this.addListeners();
    });
  },

  requestSongs: function (callback) {
    var that = this;
    $.ajax({
      dataType: 'json',
      url: ['/fetch', this.page].join('/'),
      success: function (response) {
        if (!response.length) {
          //fetch next page
          that.page++;
          that.requestSongs(callback);
        } else {
          $.merge(Player.playlist, response);
          callback && callback.apply(that, arguments);
        }
      }
    });
  },

  getPhoto: function () {
    return this.$photo = this.$photo || $('.photo img');
  },

  getPlayer: function () {
    return this.$player = this.$player || $('.player');
  },

  getLoading: function () {
    return this.$loading = this.$loading || $('#loading');
  },
    
  getTimer: function () {
    return this.$timer = this.$timer || $('#timer');
  },

  getHandle: function () {
    return this.$handle = this.$handle || $('#handle');
  },

  getGutter: function () {
    return this.$gutter = this.$gutter || $('#gutter');
  },

  getTitle: function () {
    return this.$title = this.$title || $('.details');
  },

  getToggle: function () {
    return this.$toggle = this.$toggle || $('#playtoggle');
  },

  getAudioTagFromSrc: function (src) {
    return this.$currentAudio = $('<audio><source src="' + src  +'" type="audio/mpeg"></source></audio>');
  },

  onTimeUpdate: function (){
    var rem = parseInt(this.duration - this.currentTime, 10)
      , pos = (this.currentTime / this.duration) * 100
      , mins = Math.floor(rem / 60, 10)
      , secs = rem - mins * 60;
 
    Player.getTimer().text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
    
    if (!Player.manualSeek) {
      Player.getHandle().css({left: pos + '%'});
    } 
    
    if (pos == 100) {
      Player.playNext();
    }

    if (Player.update) {
      Player.getGutter().slider('option', 'max', this.duration);
    } else if (!Player.loaded) {
      Player.loaded = true;
      Player.getGutter().slider({
        value: 0,
        step: 0.01,
        orientation: "horizontal",
        range: "min",
        max: this.duration,
        animate: true,          
        slide: function () {             
          Player.manualSeek = true;
        },
        stop: function (e,ui) {
          Player.manualSeek = false;         
          Player.$currentAudio[0].currentTime = ui.value;
        }
      });
    }

  },

  addAudioTagListeners: function () {
    var $audioTag = this.$currentAudio;
    if ($audioTag[0].buffered && $audioTag[0].buffered.length) {
      $audioTag.bind('progress', function () {
        var loaded = parseInt((($audioTag[0].buffered.end(0) / audio.duration) * 100), 10);
        this.getLoading().css({'display': 'block', width: loaded + '%'});
      });
    } else {
      this.getLoading().css({'display': 'none'});
      this.$currentAudio[0].play();
    }
    
    $audioTag.bind('timeupdate', this.onTimeUpdate);
  },

  addListeners: function () {
    this.$currentAudio.bind('play', function () {
      Player.getToggle().addClass('playing');   
    }).bind('pause ended', function () {
      Player.getToggle().removeClass('playing');    
    });   
        
    $("#playtoggle").click(this.togglePlay);

    $(window).bind('keyup', function (e) {
      switch (e.keyCode) {
        case 13: //enter
        case 32: //space
          Player.togglePlay();
          break;
        case 37: //left
          Player.playPrevious();
          break;
        case 39: //right
          Player.playNext();
          break;
        default:
      }
    });
  },

  setPhoto: function () {
    var photo = this.getPhoto();
    var size = this.playlist[this.song].photo.match(/\d+(?=\.)/g) || 'auto';
    photo.animate({'opacity': 0}, function (){
      photo.attr('src', Player.playlist[Player.song].photo);
      photo.parent().animate({'height': size}, function (){
        photo.css({'height': size});
        photo.animate({'opacity': 1.0});
      });
    });
  },

  setTitle: function () {
    this.getTitle().html(this.playlist[this.song].title);
  },

  playSong: function (src) {
    if (this.loaded) this.update = true;
    this.setPhoto();
    this.setTitle();
    if (this.$currentAudio) {
      this.$currentAudio[0].pause();
      this.$currentAudio.remove();
    }
    this.getAudioTagFromSrc(this.playlist[this.song].mp3).insertAfter(this.getPlayer());
    this.addAudioTagListeners();
  },

  playNext: function () {
    this.song++;
    if (this.song >= this.playlist.length) {
      this.page++;
      this.requestSongs(this.playSong);
    } else {
      if (this.song == this.playlist.length - 1) {
        this.page++;
        this.requestSongs();
      }
      this.playSong();
    }
  },

  playPrevious: function () {
    this.song--;
    if (this.song < 0) this.song = 0;
    this.playSong();
  },

  togglePlay: function () {
    if (Player.$currentAudio[0].paused) Player.$currentAudio[0].play();
    else Player.$currentAudio[0].pause(); 
  }

};

$(document).ready(function () {
  Player.initialize();
});
