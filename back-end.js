const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();

//hopin-team
//jwklnNauD1BhEibr
//MONGO TESTING
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hopin-team:jwklnNauD1BhEibr@cluster0.achgy.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log("MONGO SUCCESS!!!");
    // perform actions on the collection object
    client.close();
});


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
    //TODO Check if beer is already in favorites
    userFavorites.push(req.body);
    res.send("success");
});

//route to change userFavorites information by id
server.put("/user/favorites/:id", (req, res) => {
    const id = req.params.id;
    const beer = req.body;
    // let result = userFavorites.filter((beer) => beer.eId === id);
    // if (beer.fName !== undefined) {
    //     result[0].fName = beer.fName;
    // }
    // if (beer.lName !== undefined) {
    //     result[0].lName = beer.lName;
    // }
    // if (beer.email !== undefined) {
    //     result[0].email = beer.email;
    // }
    // if (beer.role !== undefined) {
    //     result[0].role = beer.role;
    // }
    // res.send(result[0]);
});


//route to delete a favorite beer by id
server.delete("/user/favorites/:id", (req, res) => {
    // Set the id from the params
    const id = req.params.id;
    let beerIdx = -1;
    userFavorites.map((beer, idx) => {
        //TODO Change .id to whatever parameter we name the object
        if (beer.id === id) {
            //if true, found beer to delete
            beerIdx = idx;
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