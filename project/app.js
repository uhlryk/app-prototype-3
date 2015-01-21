/*jslint node: true */
"use strict";
var server = require("./app/server.js");
server(process.env.NODE_APP)
.setConfig()
.setMiddleware()
.setRouter()
.run();
