require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

var keys = require("./keys.js");
var fs = require("fs");

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

if(command ==="my-tweets"){
   myTweets();
}
else if(command === "spotify-this-song"){
   spotifyThisSong(track);
}
else if(command === "movie-this"){
   movieThis(track);
}
else if(command === "do-what-it-says"){
    doWhatItSays();
}

function myTweets(){
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

function spotifyThisSong(track){
    if(track){
        spotify.search({ type: 'track', query: track,limit:5}, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            if(data.tracks.items.length>0){
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
            }
            else{
                console.log("Song not found!");
            }
              
         });
    }
    else{
        console.log(defaultSong);
    } 
}

function movieThis(track){
    if(!track){
        track = "Mr.Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + track + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);


    request(queryUrl, function(error, response, body) {
      
    if (!error && response.statusCode === 200) {
        var movieObject = JSON.parse(body);

        if(movieObject.Response==="False"){
            console.log(movieObject.Error);
        }
        else{
            console.log("Title: " + movieObject.Title);
            console.log("Year: " +  movieObject.Year);
            console.log("Rotten Tomato Rating: " +  movieObject.Ratings[1].Value);
            console.log("Country Produced: " +  movieObject.Country);
            console.log("Language: " +  movieObject.Language);
            console.log("Plot: " +  movieObject.Plot);
            console.log("Actors: " +  movieObject.Actors);
        }
    }
    
    });
        
}

function doWhatItSays(){
        fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }
      
        var dataArr = data.split(",");
      
        var command = dataArr[0];
        var trackOrMovie = dataArr[1];
        
        if(command ==="spotify-this-song"){
            spotifyThisSong(trackOrMovie);
        }
        else if(command==="movie-this"){
            movieThis(trackOrMovie);
        }
        else if(command==="my-tweets"){
            myTweets();
        }
      
    });
}
