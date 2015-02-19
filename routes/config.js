/*jslint node: true */
/*jslint nomen: true */
"use strict";

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
exports.google_oauth2 = {
    "GOOGLE_CLIENT_ID": "384238783745-u9sv4qr9h4ac017f5n2a7glav80h8mg4.apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET": "G1pipQs2x785CiqjL3WB6fSE",
    "callbackURL": "http://localhost:3000/auth/google/callback"
};

exports.session = {
    "copyright": "<i class='glyphicon glyphicon-copyright-mark'></i> Lunchfund 2013, 2015",
    "secret": "MYS3SSI0NS3CR3T"
};

exports.mysql_credential = {
    /*
    "jdbcUrl": "jdbc:mysql://bf146718426b5e:a0090098@us-cdbr-iron-east-01.cleardb.net:3306/ad_4018ccff0f1c022",
    "uri": "mysql://bf146718426b5e:a0090098@us-cdbr-iron-east-01.cleardb.net:3306/ad_4018ccff0f1c022?reconnect=true",
    "name": "ad_4018ccff0f1c022",
    "hostname": "us-cdbr-iron-east-01.cleardb.net",
    "port": "3306",
    "username": "bf146718426b5e",
    "password": "a0090098"
    */
    "jdbcUrl": "jdbc:mysql://bf146718426b5e:a0090098@us-cdbr-iron-east-01.cleardb.net:3306/ad_4018ccff0f1c022",
    "uri": "mysql://bf146718426b5e:a0090098@us-cdbr-iron-east-01.cleardb.net:3306/ad_4018ccff0f1c022?reconnect=true",
    "name": "ad_4018ccff0f1c022",
    "hostname": "us-cdbr-iron-east-01.cleardb.net",
    "port": "3306",
    "username": "bf146718426b5e",
    "password": "a0090098"
};