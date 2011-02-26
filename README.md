Mixtape.js
----------

Mixtape.js is a small node app which I built to listen to songs posted to the blog NahRight... I didn't want to have to manually click though each song when programming...    

Someday I'd like to see this evolve into a tumbltape type project, but for any website... not just tumblr.    

Currently the ui is stolen from Tim Van Damme's amazing [The Box](http://thebox.maxvoltar.com/). I feel bad about that sorta.    

At this time, mixtape.js will only work on safari (mp3s...html5... it's a whole thing).   



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

