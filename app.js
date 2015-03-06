/*jslint node: true */
/*jslint nomen: true */
"use strict";

var env = process.env.NODE_ENV || 'development',
    development = ('development' === env),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require('./routes/config'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    db = require('./routes/db');

var app_version = require('./package.json').version,
    copyright_text = "Lunchfund 2013, 2015";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Determine hostname where app is deployed
var hostname = "localhost:3000";
if (process.env.VCAP_APPLICATION) {
    var bluemix_env = JSON.parse(process.env.VCAP_APPLICATION);
    hostname = bluemix_env.application_uris;
}

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.google_oauth2.GOOGLE_CLIENT_ID,
    clientSecret: config.google_oauth2.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://" + hostname + "/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        if (profile._json) {
            var user = {
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                initial: profile._json.given_name.charAt(0) + profile._json.family_name.charAt(0),
                email: profile._json.email,
                picture: profile._json.picture
            };
            return done(null, user);
        }

        return done(null, false);
    });
}));

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);

if (development) {
    app.set('views', __dirname + '/views');
} else {
    app.set('views', __dirname + '/dist/views');
    app.use(express['static'](path.join(__dirname, 'dist')));
}
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express['static'](path.join(__dirname, 'bower_components')));
app.use('/css/fonts', express['static'](path.join(__dirname, '/bower_components/bootstrap/dist/fonts')));
app.use('/fonts', express['static'](path.join(__dirname, '/bower_components/bootstrap/dist/fonts')));
app.use(express['static'](path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: config.google_oauth2.GOOGLE_CLIENT_SECRET,
    cookie: {expires: new Date(2147483647000)},   // Don't let the session cookie expire
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// development only
if (development) {
    console.log("Development Mode");

    // Show stacktrace
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be GOOGLE protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureGoogleAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Use this route middleware on any resource that needs to be LUNCHFUND APP protected.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        db.refreshLuncherRecord(req.user).then(function (numRows) {
            if (numRows !== 1) {
                return res.redirect('/registration');
            }
            return next();
        })['catch'](function (error) {
            console.error(error);
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
}

// special authentication middleware that just checks for google acccount


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
}), function (req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
    console.log(res);
});

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), function (req, res) {
    res.redirect('/');
});


// MYSQL endpoints
app.get('/db/lunchers', ensureAuthenticated, db.getLunchers);
app.put('/db/luncher/:id', ensureGoogleAuthenticated, db.updateLuncher);
app.get('/db/events', ensureAuthenticated, db.getLunchEvents);
app.post('/db/event', ensureAuthenticated, db.createEvent);
app.get('/db/luncherstat', ensureAuthenticated, db.getLuncherStat);


// Main application endpoints
app.get('/', ensureAuthenticated, function (req, res) {
    res.render('index', {
        'version' : app_version,
        COPYRIGHT_TEXT: copyright_text,
        DEVMODE: development,
        user: req.user
    });
});

app.get('/login', function (req, res) {
    res.render('login', {
        COPYRIGHT_TEXT: copyright_text
    });
});

/*
db.getTopLunchers().then(function (rows) {
    console.log(rows);
});
db.getTotalStat().then(function (total) {
    console.log(total);
});
db.getFundholderStat().then(function (fundstat) {
    console.log(fundstat);
});
*/

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('/registration', function (req, res) {
    if (!req.user) {
        res.redirect('/login');
    }

    db.getLunchersWithoutGmail().then(function (rows) {
        res.render('registration', {
            email: req.user.email,
            lunchers: rows,
            COPYRIGHT_TEXT: copyright_text
        });
    })['catch'](function (error) {
        res.status(400);
        res.send(error);
    });

});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));

});