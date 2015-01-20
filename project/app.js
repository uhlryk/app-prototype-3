/*jslint node: true */
"use strict";
var server = require("./app/server.js");
server(process.env.NODE_APP)
.setConnection()
.setMiddleware()
.setRouter()
.run();
