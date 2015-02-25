/*jslint node: true */
/*jslint nomen: true */
"use strict";

var credential = require('./config').mysql_credential,
    knex = require('knex')({
        client: 'mysql',
        connection: {
            host: credential.hostname,
            user: credential.username,
            password : credential.password,
            port : credential.port,
            database: credential.name
        }
    }),
    tbl = {
        lunchers: "lunchers"
    };

function getLunchers(req, res) {
    // Only get fields that are visible to every user of the app 
    var query = knex.select('username', 'firstname', 'lastname', 'picture').from(tbl.lunchers);
    
    if (req.query.email) {
        query = query.where({
            email: req.query.email
        });
    }
    
    query.then(function (rows) {
        // Create 'initial' field in returned results
        rows.forEach(function (entry) {
            entry.initial = entry.firstname.charAt(0) + entry.lastname.charAt(0);
        });
        res.json(rows);
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });
}

// Update fields in Luncher record
function updateLuncher(req, res) {
    var id = req.params.id;
    if (!id || !req.body) {
        res.status(400);
        res.send("incorrectly formed query");
    }
    
    knex(tbl.lunchers).where({
        id: id,
        email: null
    }).update(req.body).then(function (rownum) {
        if (rownum !== 1) {
            res.status(400);
            res.send({rownum: rownum});
        } else {
            res.send(null);
        }
    });
}

// Check lunchfund database for record with given email
// If exists, update lunchfund record with current profile information.
// Promise contains number of records obtained/updated.
function refreshLuncherRecord(profile) {
    return knex(tbl.lunchers)
        .where({
            email: profile.email
        }).update({
            firstname: profile.firstname,
            lastname: profile.lastname,
            picture: profile.picture
        });
}

// Promise contains all lunchers without GMAIL registrations
function getLunchersWithoutGmail() {
    return knex(tbl.lunchers).whereNull('email');
}
  
module.exports = {
    // APIs for internal use
    refreshLuncherRecord: refreshLuncherRecord,
    getLunchersWithoutGmail: getLunchersWithoutGmail,
    
    // REST APIs
    getLunchers: getLunchers,
    updateLuncher: updateLuncher
};
