const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://hopin-team:${process.env.MONGO_KEY}@cluster0.achgy.mongodb.net/users?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

var userFavorites = [{
        "id": 1811,
        "name": "blue moon",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4f3ONUtuWWK9A225iRiOYQtxBKqoMB0f_vQ&usqp=CAU",
        "category": "International Hit",
        "abv": "5.4",
        "style": "Light Valencia",
        "brewer": "Budweiser",
        "country": "USA"
    },
    {
        "id": 634,
        "name": "corona",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzfmVk90f78KN4elNbTyPvtb9YneFg5zsew&usqp=CAU",
        "category": "Export",
        "abv": "4.2",
        "style": "stout",
        "brewer": "Corona Inc.",
        "country": "Mexico"
    },
    {
        "id": 7982,
        "name": "heinken",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4FHhLYrprAVnOvWTyBetZIH6Jx_lb8oEWA&usqp=CAU",
        "category": "Domestic Import",
        "abv": "5.0",
        "style": "IPA",
        "brewer": "west brewers",
        "country": "united states"
    },
    {
        "id": 2346,
        "name": "best beers",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkqBbr9JsYBazBjz1uMoOqoyREs5VliS49yQ&usqp=CAU",
        "category": "Domestic Import",
        "abv": "4.0",
        "style": "lager",
        "brewer": "west brewers",
        "country": "canada"
    }
];


client.connect(err => {
    const collection = client.db("users").collection("favorites");
    console.log("MONGO SUCCESS!!!");
    // perform actions on the collection object
    client.close();
});

server.use(bodyParser.json());
server.use(cors());

server.listen(process.env.PORT || 3000);

//route to get all user beer favorites
server.get("/", (req, res) => {
    let data = "no data";
    axios.get("http://ontariobeerapi.ca/beers").then((res) => {
        data = res.data;
        console.log(data);
    });

    res.send(data);
});

//route to get all user beer favorites
server.get("/user/favorites", (req, res) => {
    if (userFavorites.length < 1) {
        res.send("You don't have any favorites yet.");
        return;
    }
    res.send(userFavorites);
});


//route to add new beer favorites for the user
server.post("/user/favorites", (req, res) => {
    //TODO Check if beer is already in favorites
    let isFail = false;
    userFavorites.map(beer => {
        if (beer.name === req.body.name) {
            sendFailed404Error(res, "Oops, it looks like you already have that beer favorited.");
            isFail = true;
        }
    });
    if (!isFail) {
        userFavorites.push(req.body);
        // Send to front end a success response
        sendSuccessResponse(res);
    }
});

//route to change userFavorites information by id
server.put("/user/favorites/:id", (req, res) => {
    const id = req.params.id;
    const beerBodyRequest = req.body;
    console.log("New Put Request with body: " + beerBodyRequest);
    let targetIndex = -1;
    userFavorites.map((beer, idx) => {
        if (Number(beer.id) === Number(id)) {
            targetIndex = idx;
        }
    });
    // Check if we did not find the beer
    if (targetIndex === -1) {
        return res.status(404).send("Sorry, we couldn't  update your beer. Try again later");
    }

    if (beerBodyRequest.name !== undefined && beerBodyRequest.name !== "") {
        userFavorites[targetIndex].name = beerBodyRequest.name;
    }
    if (beerBodyRequest.image_url !== undefined && beerBodyRequest.image_url !== "") {
        userFavorites[targetIndex].image_url = beerBodyRequest.image_url;
    }
    if (beerBodyRequest.category !== undefined && beerBodyRequest.category !== "") {
        userFavorites[targetIndex].category = beerBodyRequest.category;
    }
    if (beerBodyRequest.abv !== undefined && beerBodyRequest.abv !== "") {
        userFavorites[targetIndex].abv = beerBodyRequest.abv;
    }
    if (beerBodyRequest.style !== undefined && beerBodyRequest.style !== "") {
        userFavorites[targetIndex].style = beerBodyRequest.style;
    }
    if (beerBodyRequest.brewer !== undefined && beerBodyRequest.brewer !== "") {
        userFavorites[targetIndex].brewer = beerBodyRequest.brewer;
    }
    if (beerBodyRequest.country !== undefined && beerBodyRequest.country !== "") {
        userFavorites[targetIndex].country = beerBodyRequest.country;
    }
    // Send to front end a success response
    sendSuccessResponse(res);
});

//route to delete a favorite beer by id
server.delete("/user/favorites/:id", (req, res) => {
    // Set the id from the params
    const beerId = req.params.id;
    let beerIdx = -1;

    userFavorites.map((beer, index) => {
        if (Number(beer.id) === Number(beerId)) {
            //if true, found beer to delete
            beerIdx = index;
            return;
        }
    });
    // Check if we did not find the beer
    if (beerIdx === -1) {
        return res.status(404).send("We're sorry, we couldn't delete that beer. Try again later.");
    }
    // Update our data
    userFavorites.splice(beerIdx, 1);

    // Send to front end a success response
    sendSuccessResponse(res);
});

function sendSuccessResponse(res) {
    res.send("success");
}

function sendFailed404Error(res, msg) {
    res.status(404).send(msg);
}