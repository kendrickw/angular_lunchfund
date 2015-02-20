/*jslint node: true */
/*jslint nomen: true */
"use strict";

var tbl = {
    lunchers: "lunchers"
};

var escapeString = function (val) {
    val = val.replace(/[\n\r\b\t\\'"\x1a]/g, function (s) {
        switch (s) {
        case "\n":
            return "\\n";
        case "\r":
            return "\\r";
        case "\b":
            return "\\b";
        case "\t":
            return "\\t";
        case "\x1a":
            return "\\Z";
        case "'":
            return "''";
        case '"':
            return '""';
        default:
            return "\\" + s;
        }
    });
    return val;
};

function lunchers(req, res) {
    var email = req.query.email;
    req.getConnection(function (err, connection) {
        var qstr = "SELECT * FROM " + tbl.lunchers;
        if (req.query.email) {
            qstr += " WHERE email='" + escapeString(req.query.email) + "'";
        }
        
        console.log(qstr);
        
        connection.query(qstr, function (err, rows) {
            
            if (err) {
                console.log("Error Selecting : %s ", err);
            }
     
            res.json(rows);
        });
    });
}
  
module.exports = {
    lunchers: lunchers
};
