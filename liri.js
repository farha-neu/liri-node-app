// https://farha-neu.github.io/Responsive-Portfolio/

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
for(var i =3; i<process.argv.length;i++){
 var t = process.argv[i];
 track = track+" "+t;
 if(i==3){
    track = t;
 }
}

var doWhat = false;

var text = "******************\r\nCommand: "+command;

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
    text+="\r\n\r\n";
    var params = {screen_name: 'aliceliriliri',count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        for(var i = 0; i < tweets.length; i++){
            var tweetText = tweets[i].text;
            var date = tweets[i].created_at+"\r\n";
            console.log(tweetText);
            console.log("Created at: "+date);
            text+=tweetText+"\r\n"+date+"\r\n";
        } 
    }
    appendFile(text);
  });
}

function spotifyThisSong(track){
  
    if(track){
        if(!doWhat){
            text+=" "+track;
        }
        text+="\r\n\r\n";
        spotify.search({ type: 'track', query: track,limit:10}, function(err, data) {
            if (err) {
              var error = "Error occurred: " + err;
              text+=error+"\r\n";
              return console.log(error);
            }
            if(data.tracks.items.length>0){
                for(var i = 0; i<data.tracks.items.length;i++){
                    var songName = "Song Name: "+data.tracks.items[i].name;
                    console.log(songName);
                    console.log("Artists: ");
                    text+=songName+"\r\n"+"Artists: ";
                    for(var j = 0; j<data.tracks.items[i].artists.length;j++){
                        var artist = data.tracks.items[i].artists[j].name;
                        console.log(artist);
                        if(j===data.tracks.items[i].artists.length-1){
                            text+=artist;
                        }
                        else{
                            text+=artist+",";
                        }
                       
                    }
                    var previewLink = "Preview link: "+data.tracks.items[i].external_urls.spotify+"\r\n";
                    var album = "Album: "+data.tracks.items[i].album.name+"\r\n";
                    console.log(previewLink+album);  
                    text+="\r\n"+previewLink+album+"\r\n";
                    
                }      
                appendFile(text);
            }
            else{
                var message = "Song not found!";
                console.log(message);
                text+=message+"\r\n\r\n";
                appendFile(text);
            }
           
         });
        
    }
    else{
        console.log(defaultSong);
        text+= "\r\n\r\n"+defaultSong+"\r\n\r\n";
        appendFile(text);
    } 
   
}

function movieThis(track){
  
     
    
    if(doWhat||!track){
        text+="\r\n\r\n";
    }
    else if(track){
        text+=" "+track+"\r\n\r\n";
    }
    if(!track){
        track = "Mr.Nobody";
    }
   
    var queryUrl = "http://www.omdbapi.com/?t=" + track + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);


    request(queryUrl, function(error, response, body) {
      
    if (!error && response.statusCode === 200) {
        var movieObject = JSON.parse(body);

        if(movieObject.Response==="False"){
            var errorMessage = movieObject.Error;
            console.log(errorMessage);
            text+=errorMessage+"\r\n\r\n";
        }
        else{
            var title = "Title: " + movieObject.Title+"\r\n";
            var year = "Year: " +  movieObject.Year+"\r\n";
            var rating =  "Rotten Tomato Rating: " +movieObject.Ratings[1].Value+"\r\n";
            var country = "Country Produced: " + movieObject.Country+"\r\n";
            var language = "Language: " +  movieObject.Language+"\r\n";
            var plot = "Plot: " + movieObject.Plot+"\r\n";
            var actors = "Actors: " + movieObject.Actors+"\r\n";
            console.log(title+year+rating+country+language+plot+actors);
            text+=title+year+rating+country+language+plot+actors+"\r\n";
    
        }
    }
    appendFile(text);
    
    });
        
}

function doWhatItSays(){
        doWhat = true;
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
        doWhat = false;
      
    });
}

function appendFile(text){
    fs.appendFile("log.txt", text, function(err) {
        if (err) {
          console.log(err);
        }
      
      });
}
