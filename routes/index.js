/*jslint node: true */
"use strict";
/*
 * GET pages and render
 */

exports.index = function (req, res, data) {
    res.render('index', data);
};
