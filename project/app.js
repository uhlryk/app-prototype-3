/*jslint node: true */
"use strict";
var server = require("./app/server.js");
server()
.setConfig()
.setMiddleware()
.setRouter()
.run();
