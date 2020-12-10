const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();

server.use(bodyParser.json());
server.use(cors());

server.listen(process.env.PORT || 3000);

var userFavorites = ["blue moon", "budweiser"];

//route to get all user beer favorites
server.get("/user/favorites", (req, res) => {
    res.send(userFavorites);
});

//route to add new beer favorites for the user
server.post("/user/favorites", (req, res) => {
    userFavorites.push(req.body);
    res.send("success");
});