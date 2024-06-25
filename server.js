const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const lyricsFinder = require('lyrics-finder');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5124;

app.get("/", (_, res) => {
  res.json({ msg: "Welcome to music api" });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173",
    clientId: "6b765ffc9a314d22a1c14dba65be55cc",
    clientSecret: "421c600e61b14cc6b68df3cdcdad2cbf",
    refreshToken: refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173",
    clientId: "6b765ffc9a314d22a1c14dba65be55cc",
    clientSecret: "421c600e61b14cc6b68df3cdcdad2cbf",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found";
  res.json({lyrics});
})

app.listen(PORT, () => {
  console.log(`listening to port http://localhost:${PORT}/`);
});
