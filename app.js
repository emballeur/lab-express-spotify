require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  //console.log('artist is', req.query.artist)
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", {
        artists: data.body.artists.items,
        artist: req.query.artist,
      });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    function (data) {
      let artist = req.query.artist;
      //console.log('Artist albums', data.body.items);
      res.render("albums", { albums: data.body.items, artist: artist });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id).then(
    function (data) {
      //console.log('tracks', data.body.items);
      res.render("tracks", {
        tracks: data.body.items,
        album: req.query.album,
        artist: req.query.artist,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(5500, () =>
  console.log("My Spotify project running on port 5500 🎧 🥁 🎸 🔊")
);
