/*jslint node: true */
/*jslint nomen: true */
"use strict";

var Promise = require('bluebird'),
    FormData = require('form-data'),
    credential = require('./config').mysql_credential,
    env = process.env.NODE_ENV || 'development',
    development = ('development' === env),
    knex = require('knex')({
        client: 'mysql',
        connection: {
            host: credential.hostname,
            user: credential.username,
            password : credential.password,
            port : credential.port,
            database: credential.name,
            timezone: "UTC"
        },

        // This is a clearDB limitation for now. (Do not use more than 3 connections)
        // And save 1 connection for phpmyadmin
        pool: {
            min: 1,
            max: 3
        }
    }),
    tbl = {
        lunchers: "lunchers",
        restaurants: "restaurants",
        lunch_events: "lunch_events",
        lunch_event_lookup: "lunch_event_lookup",
        stocks: "stocks",
        stock_events: "stock_events"
    };

function getLunchers(req, res) {
    // Only get fields that are visible to every user of the app
    var query = knex(tbl.lunchers)
        .select('id', 'username', 'firstname', 'lastname', 'picture')
        .orderBy('id');

    if (req.query.email) {
        query.where({
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
    if (!id) {
        res.status(400);
        res.send("updateLuncher: invalid id " + id);
        return;
    }
    if (!req.body) {
        res.status(400);
        res.send("updateLuncher: Malformed body: " + JSON.stringify(req.body));
        return;
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

// Get past lunch events
function getLunchEvents(req, res) {
    var query = knex(tbl.lunch_events).orderBy('id', 'desc');

    // ?count=# : return number of events
    if (req.query.count) {
        query.limit(parseInt(req.query.count, 10));
    }

    query.then(function (rows) {
        res.json(rows);
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });
}

// Get lunchfund statistics (fund contribution per person, meal contribution, etc..)
/** SELECT luncher_id, sum(meal_cost), sum(fund_contrib), count(*) as meal_count
    FROM lunch_event_lookup
    LEFT JOIN (
        SELECT id, (totalpaid/user_count) as meal_cost, (fund/user_count) as fund_contrib
        FROM (
            SELECT id, totalpaid, fund, count(*) as user_count
            FROM lunch_event_lookup
            LEFT JOIN lunch_events
            ON id=lunch_event_id
            GROUP BY id
        ) as count_tbl
    ) as contrib_tbl
    ON id=lunch_event_id
    GROUP BY luncher_id
**/
// ?id=# to get stat for specific luncher
function getLuncherStat(req, res) {
    var query = knex.select(knex.raw('luncher_id, sum(meal_cost) as total_meal_cost, sum(fund_contrib) as total_fund_contrib, count(*) as meal_count'))
        .from(function () {
            // For each lunch event, calculate the per person contribution (meal_cost, fund_contrib, etc..)
            this.select(knex.raw('id, (totalpaid/user_count) as meal_cost, (fund/user_count) as fund_contrib'))
                .from(function () {
                    // For each lunch event, get number of people (user_count) on each event
                    this.select(knex.raw('id, totalpaid, fund, count(*) as user_count'))
                        .from(tbl.lunch_event_lookup)
                        .leftJoin(tbl.lunch_events, function () {
                            this.on('id', '=', 'lunch_event_id');
                        })
                        .groupBy('id')
                        .as('count_tbl');
                }).as('contrib_tbl');
        })
        .leftJoin(tbl.lunch_event_lookup, function () {
            this.on('id', '=', 'lunch_event_id');
            // ?id=# : luncher ID to query
            if (req.query.id) {
                this.on('luncher_id', parseInt(req.query.id, 10));
            }
        });

    if (!req.query.id) {
        query.groupBy('luncher_id');
    }

    query.then(function (rows) {
        res.json(rows);
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });
}

function getFundholderStat(req, res) {
    var query = knex(tbl.lunch_events)
        .select(knex.raw('fundholder, sum(fund) as funds'))
        .groupBy('fundholder')
        .having('funds', '>', 0)
        .orderBy('funds', 'desc');

    query.then(function (rows) {
        res.json(rows);
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });
}

function getFormattedDate(time) {
    var date = new Date(time),
        str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return str;
}

// Create Lunch event (to Googlespreadsheet)
function createEventGoogleSpreadsheet(req) {
    var googleFormPOSTURL = "https://docs.google.com/forms/d/1hGfAw3GT5YbiTWlNqZhMBAsx2fJ6Jnt5mmhg_8VJLs0/formResponse",
        googleAttendee = "entry.598889479",
        googleLunchFund = "entry_1892695599",
        googleFundHolder = "entry.960282559",
        googleSubmitter = "entry_1745174688",
        googleEventDate = "entry_472715279",
        form = new FormData();

    req.body.attendee.map(function (entry) {
        form.append(googleAttendee, entry.username);
    });
    form.append(googleLunchFund, req.body.fund);
    form.append(googleFundHolder, req.body.fundholder.username);
    form.append(googleSubmitter, req.body.submitter.username);
    form.append(googleEventDate, getFormattedDate(req.body.time));

    return new Promise(function (resolve, reject) {
        if (development) {
            console.info("DEV: skip syncing info to GOOGLE spreadsheet");
            return resolve({statusCode: 200});
        }

        form.submit(googleFormPOSTURL, function (err, res) {
            if (err || res.statusCode !== 200) {
                return reject("GOOGLE spreadsheet update failed: " + err + ":" + res.statusCode);
            }
            resolve(res);
        });
    });
}

// Create Lunch event
function createEvent(req, res) {
    if (!req.body ||
            !req.body.hasOwnProperty('time') ||
            !req.body.hasOwnProperty('bill') ||
            !req.body.hasOwnProperty('totalpaid') ||
            !req.body.hasOwnProperty('fund') ||
            !req.body.hasOwnProperty('fundholder') ||
            !req.body.hasOwnProperty('submitter')) {
        res.status(400);
        res.send("createEvent: Malformed body: " + JSON.stringify(req.body));
        return;
    }

    knex.transaction(function (trx) {
        return trx
            .select('time', 'bill', 'totalpaid', 'fund')
            .from(tbl.lunch_events)
            .orderBy('id', 'desc').limit(1)
            .then(function (rows) {
                if (rows.length &&
                        rows[0].time.setHours(0, 0, 0, 0) === new Date(req.body.time).setHours(0, 0, 0, 0) &&
                        rows[0].bill === req.body.bill &&
                        rows[0].totalpaid === req.body.totalpaid &&
                        rows[0].fund === req.body.fund) {
                    return Promise.reject("createEvent: Duplicate Entry exists in DB.");
                }

                var entry = {
                    rest_id: 0,
                    time: req.body.time,
                    bill: req.body.bill,
                    totalpaid: req.body.totalpaid,
                    fund: req.body.fund,
                    fundholder: req.body.fundholder.id,
                    submitter: req.body.submitter.id
                };

                return trx.insert(entry).into(tbl.lunch_events);
            }).then(function (eventIDs) {
                var attendeeIDs = req.body.attendee.map(function (entry) { return entry.id; });
                return Promise.map(attendeeIDs, function (luncher_id) {
                    var entry = {
                        lunch_event_id: eventIDs[0],
                        luncher_id: luncher_id,
                        multiplier: 1
                    };
                    return trx.insert(entry).into(tbl.lunch_event_lookup);
                });
            }).then(function (inserts) {
                // Number of records written
                // console.log(inserts.length)
                // Lastly, write information on google spreadsheet
                return createEventGoogleSpreadsheet(req);
            });
    }).then(function (response) {
        // response contains reply from google spreadsheet
        res.send();
    })['catch'](function (error) {
        // Error occurred within transaction
        res.status(400);
        res.send(error);
    });

}

// Get stock watch list
function getStockList(req, res) {
    var query = knex(tbl.stocks).orderBy('id', 'desc');

    query.then(function (rows) {
        res.json(rows);
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });
}

// Add stock to stock watch list
function addStockList(req, res) {
    if (!req.body ||
            !req.body.hasOwnProperty('symbol') ||
            !req.body.hasOwnProperty('exchange')) {
        res.status(400);
        res.send("createEvent: Malformed body: " + JSON.stringify(req.body));
        return;
    }

    knex.transaction(function (trx) {
        var entry = {
            symbol: req.body.symbol,
            exchange: req.body.exchange
        };

        return trx
            .select('symbol', 'exchange')
            .from(tbl.stocks)
            .where(entry)
            .then(function (rows) {
                if (rows.length) {
                    return Promise.reject("addStockList: ' + entry.symbol + ' is already in watchlist.");
                }

                return trx.insert(entry).into(tbl.stocks);
            });
    }).then(function (inserts) {
        // Number of records written
        // console.log(inserts.length);
        res.send();
    })['catch'](function (error) {
        // Error occurred within transaction
        res.status(400);
        res.send(error);
    });
    res.send();
}

// Delete a stock from stocklist
function delStockList(req, res) {
    var symbol = req.params.symbol;
    if (!symbol) {
        res.status(400);
        res.send("delStockList: invalid symbol: " + symbol);
        return;
    }
    if (!req.body) {
        res.status(400);
        res.send("delStockList: Malformed body: " + JSON.stringify(req.body));
        return;
    }

    knex(tbl.stocks).where({
        symbol: symbol
    }).del().then(function (rownum) {
        // console.log(rownum);
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
    updateLuncher: updateLuncher,
    getLunchEvents: getLunchEvents,
    createEvent: createEvent,
    getLuncherStat: getLuncherStat,
    getFundholderStat: getFundholderStat,
    getStockList: getStockList,
    addStockList: addStockList,
    delStockList: delStockList
};
