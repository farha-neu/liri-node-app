require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];


//This will show your last 20 tweets and when they were created at in your terminal/bash window.
if(command ==="my-tweets"){
    var params = {screen_name: 'aliceliriliri',count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        for(var i = 0; i < tweets.length; i++){
            console.log(tweets[i].text);
            console.log("Created at: "+tweets[i].created_at+"\r\n");
        } 
    }
  });
}
else if(command === "spotify-this-song"){
    
}

// my-tweets

// spotify-this-song

// movie-this

// do-what-it-says