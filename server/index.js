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

// Variables
var lobbies = [];
var clients = [];

/** GET handshake request **/
function register_client(req, res) {
    res.json({msg: "Success!"});
    console.log(req.query.client_id);
}

/** Registers REST endpoints **/
function register_endpoints() {
    app.get("/register_client", register_client);
}

/** Listen function */
function listen() {
    console.log("Listening on port " + PORT + "!");
    // Set API endpoints
    register_endpoints();
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
