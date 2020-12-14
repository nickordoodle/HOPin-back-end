const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://hopin-team:${process.env.MONGO_KEY}@cluster0.achgy.mongodb.net/users?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

client.connect(err => {
    const collection = client.db("users").collection("favorites");
    console.log("MONGO SUCCESS!!!");
    // perform actions on the collection object
    client.close();
});

server.use(bodyParser.json());
server.use(cors());

server.listen(process.env.PORT || 3000);

var userFavorites = [{
        "id": 1811,
        "name": "blue moon",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4f3ONUtuWWK9A225iRiOYQtxBKqoMB0f_vQ&usqp=CAU",
        "category": "Best 100 Beers",
        "abv": "5.4",
        "type": "Light Orange",
        "brewer": "Budweiser",
        "comments": []
    },
    {
        "id": 634,
        "name": "corona",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzfmVk90f78KN4elNbTyPvtb9YneFg5zsew&usqp=CAU",
        "category": "central america beers",
        "abv": "4.2",
        "type": "light",
        "brewer": "Corona Inc.",
        "country": "Mexico",
        "comments": []
    },
    {
        "id": 7982,
        "name": "heinken",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4FHhLYrprAVnOvWTyBetZIH6Jx_lb8oEWA&usqp=CAU",
        "category": "east coast brewskies",
        "abv": "5.0",
        "type": "lager",
        "brewer": "west brewers",
        "country": "united states",
        "comments": []
    },
    {
        "id": 2346,
        "name": "best beers",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkqBbr9JsYBazBjz1uMoOqoyREs5VliS49yQ&usqp=CAU",
        "category": "east coast brewskies",
        "abv": "4.0",
        "type": "lager",
        "brewer": "west brewers",
        "country": "canada",
        "comments": []
    }
];

//route to get all user beer favorites
server.get("/user/favorites", (req, res) => {
    res.send(userFavorites);
});


//route to add new beer favorites for the user
server.post("/user/favorites", (req, res) => {
    //TODO Check if beer is already in favorites
    userFavorites.push(req.body);
    res.send("success");
});

//route to change userFavorites information by id
server.put("/user/favorites/:id", (req, res) => {
    const id = req.params.id;
    const beer = req.body;
    let targetIndex = -1;
    userFavorites.map((beer, idx) => {
        if (Number(beer.id) === Number(id)) {
            targetIndex = idx;
            console.log("target index: " + targetIndex);
        }
    });
    console.log("beer back end id: " + beer.id);
    console.log("id: " + id);

    let result = userFavorites.filter((beer) => beer.id === id);
    if (beer.name !== undefined) {
        result[0].name = beer.name;
    }
    if (beer.category !== undefined) {
        result[0].category = beer.category;
    }
    if (beer.abv !== undefined) {
        result[0].abv = beer.abv;
    }
    if (beer.type !== undefined) {
        result[0].type = beer.type;
    }
    if (beer.brewer !== undefined) {
        result[0].brewer = beer.brewer;
    }
    if (beer.comments !== undefined) {
        result[0].comments = beer.comments;
    }
    res.send(result[0]);
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
        return res.status(404).send("Beer not found");
    }
    // Update our data
    userFavorites.splice(beerIdx, 1);

    // Send back to front end a success response
    res.send({
        success: "Success"
    });
});