const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();

server.use(bodyParser.json());
server.use(cors());

server.listen(process.env.PORT || 3000);

//route to return list of all employees
server.get("/beers", (req, res) => {
    res.send(employees);
});

//route to return employees by id
server.get("/employees/:id", (req, res) => {
    const eId = req.params.id;
    const results = employees.filter((emp) => emp.eId === eId);

    res.send(results);
});