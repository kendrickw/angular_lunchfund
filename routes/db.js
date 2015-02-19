/*jslint node: true */
/*jslint nomen: true */
"use strict";

function users(req, res) {
    req.getConnection(function (err, connection) {
       
        connection.query('SELECT * FROM lunchers', function (err, rows) {
            
            if (err) {
                console.log("Error Selecting : %s ", err);
            }
     
            res.json(rows);
        });
    });
}
  
module.exports = {
    users: users
};
