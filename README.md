Mixtape.js
----------

Here's a [video](http://www.youtube.com/watch?v=0orBMjJw3Vk) of this junk.

Mixtape.js is a small node app which I built to listen to songs posted to the blog NahRight... I didn't want to have to manually click though each song when programming...

Someday I'd like to see this evolve into a tumbltape type project, but for any website... not just tumblr.

Currently the ui is stolen from Tim Van Damme's amazing [The Box](http://thebox.maxvoltar.com/). I feel bad about that sorta.

At this time, mixtape.js will only work on safari & chrome (mp3s...html5... it's a whole thing).

Stations
--------

You can add your own stations by editing the config.js file. Currently the only stations are "nahright" and "unpiano"...

To add a new station, simply add to the stations object in config.js like this:

    exports.stations = {
      
      //just add this newstation below nahright and other stations

      newstation: {
        name: 'New Station',
        host: 'http://pathToHost.com'
        page: '/page/path/' //will be used to scrape muliple pages
      }
    
    }

For stations to work, their will need to be links with mp3s on the blog you are trying to scrape. (nahright's station doesn't have this, but it has it's own custom scraper... so yeah). 

To listen to your new station just go to:

    http://localhost:3000/listen/newstation 

*Note: that localhost:3000/ will play the unpiano station by default*

Getting this crap running (is probably not worth it)
----------------------------------------------------

Your going to want to do this:

    npm install express request jsdom jquery soupselect htmlparser

Which means, you need node + npm...

Also this uses submodules for jquery stuff... so make sure to do:

    git submodule update --init

and also make the jquery build... do that going to the root of this project, then:

    cd ./public/js/lib/jquery/
    make

you'll need to have make installed.
