require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var defaultSong = "The Sign by Ace of Base";

var track="";
// ...
for(var i =3; i<process.argv.length;i++){
 var t = process.argv[i];
 track = track+" "+t;
 if(i==3){
    track = t;
 }
}


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
    if(track){
        spotify.search({ type: 'track', query: track}, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            for(var i = 0; i<data.tracks.items.length;i++){
                console.log("Song Name: "+data.tracks.items[i].name);
                console.log("Artists: ");
                for(var j = 0; j<data.tracks.items[i].artists.length;j++){
                    console.log(data.tracks.items[i].artists[j].name);
                }
                console.log("Preview link: "+data.tracks.items[i].external_urls.spotify);
                console.log("Album: "+data.tracks.items[i].album.name);   
                console.log("\r\n");
                
            }         
         });
    }
    else{
        console.log(defaultSong);
    } 
}
else if(command === "movie-this"){

}

// my-tweets

// spotify-this-song

// movie-this

// do-what-it-says