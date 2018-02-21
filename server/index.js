/**
* @author Jonathan Lin
* @description The backend server for LDN
*/

// Constants
const PORT = 3000;

// Imports
var express = require("express");
var app = express();
var cors =  require("cors");
var body_parser = require("body-parser");

/** Listen function */
function listen() {
    console.log("Listening on port " + PORT + "!");
}

/** Main function (entry point) */
function start_server() {
    // Middleware
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({extended: true}));
    app.use(cors({origin: "*"}));

    app.listen(PORT, listen);
}

start_server();
