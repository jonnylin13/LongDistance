/**
* @author Jonathan Lin
* The backend server for LDN
*/

// Constants
const PORT = 3000;

// Imports
var express = require("express");
var app = express();
var cors =  require("cors");
var body_parser = require("body-parser");

function listen() {
    console.log("Listening on port " + PORT + "!");
}

function start_server() {
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({extended: true}));
    app.use(cors({origin: "*"}));
    app.listen(PORT, listen);
}

start_server();
