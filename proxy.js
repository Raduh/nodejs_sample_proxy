var DEBUG = true;

var config = require('./config.js');

var assert = require('assert');
var http = require("http");
var url = require('url');
var util = require('util');
var qs = require('querystring');

var donations = [];

http.createServer(function(request, response) {
    var process_query = function (query) {
        var amount = query.amount || 0;
        var latitude = query.latitude || 0;
        var longitude = query.longitude || 0;
        var radius = query.radius || 0;
        var reqType = query.type || "N";

        var send_response = function(status_code, json_response) {
            if (status_code >= 500) {
                console.log(json_response);
                util.log(json_response);
            }
            response.writeHead(status_code, {
                "Content-Type" : "application/json; charset=utf-8",
                "Access-Control-Allow-Origin" : "*"
            });
            response.write(JSON.stringify(json_response));
            response.end();
        };

        if (reqType == "P") {
            send_response(200, {});
            console.log("Received $" + amount);
            donations.push({
                'lat': latitude,
                'long': longitude,
                'radius': radius,
                'amount': amount
            });
        } else if (reqType == "G") {
            send_response(200, {'donations': donations});
        }
    }

    var url_parts = url.parse(request.url, true);
    process_query(url_parts.query);
}).listen(config.PROXY_PORT);

