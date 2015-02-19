/*jslint node: true */
/*jslint nomen: true */
"use strict";

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
exports.google_oauth2 = {
    "GOOGLE_CLIENT_ID": "XXXX",
    "GOOGLE_CLIENT_SECRET": "XXXX",
    "callbackURL": "http://localhost:3000/auth/google/callback"
};

exports.session = {
    "copyright": "<i class='glyphicon glyphicon-copyright-mark'></i> Lunchfund 2013, 2015",
    "secret": ""XXXX""
};

exports.mysql_credential = {
    "jdbcUrl": ""XXXX"",
    "uri": ""XXXX"",
    "name": ""XXXX"",
    "hostname": ""XXXX"",
    "port": "3306",
    "username": ""XXXX"",
    "password": ""XXXX""
};
