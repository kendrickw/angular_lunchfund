/*jslint node: true */
/*jslint nomen: true */
"use strict";

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var google_oauth2 = {
    "GOOGLE_CLIENT_ID": "FILL-ME-IN",
    "GOOGLE_CLIENT_SECRET": "FILL-ME-IN"
};

// MYSQL credential
var mysql_credential = {
    "name": "FILL-ME-IN",
    "hostname": "FILL-ME-IN",
    "port": "FILL-ME-IN",
    "username": "FILL-ME-IN",
    "password": "FILL-ME-IN"
};

// BLUEMIX:
// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
    console.log('Parsing VCAP_SERVICES');
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var service_name = 'cleardb';

    if (services[service_name]) {
        mysql_credential = services[service_name][0].credentials;
    } else {
        console.log('The service ' + service_name + ' is not in the VCAP_SERVICES, did you forget to bind it?');
    }
}

module.exports = {
    google_oauth2: google_oauth2,
    mysql_credential: mysql_credential
};