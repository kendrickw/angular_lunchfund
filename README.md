Lab Lunch Group Mutual Fund Mobile Application (powered by Angular.JS)
======================================================================

This a webapp for calculating lunch fund contribution, and also records attendance and lunch fund amount in a spreadsheet hosted on google drive.

Getting Started
---------------

The [zipball of latest release](https://github.com/kendrickw/angular_lunchfund/archive/master.zip) contains everything you need to deploy the lunchfund app.

First things first, make sure you have Node.js already installed. (https://nodejs.org/)

Next, check if the following tools have been installed:
* bower.  To install: `npm install -g bower`
* gulp.  To install: `npm install -g gulp`
* karma-cli.  To install: `npm install -g karma-cli`

Once you have cloned the repository, install the dependencies:
* `bower install`
* `npm install`

Configure MYSQL and GOOGLE APP credentials by editing `routes/config.js`.  The SQL database must be available before running the lunchfund app.  A mysql script to create the initial database is included in `lunchfund_init.mysql`

To start the server locally in development mode:
* export the `NODE_ENV` environment variable to `"development"`.
For example, in Windows powershell:
    ```
    $env:NODE_ENV="development"
    ```
In UNIX:
    ```
    export NODE_ENV="development"
    ```
* Start the node express web server: `npm run start`

To start the server locally in prooduction mode:
* Build the distribution files: `gulp build`
* export the `NODE_ENV` environment variable to `"production"`
* Start the node express web server: `npm run start`

To deploy development version to BLUEMIX (Read `manifest.yml` for deployment details)
* `npm run deploy-dev`

To deploy production version to BLUEMIX (Read `manifest.dist.yml` for deployment details)
* `npm run deploy-prod`

Features
--------

* GOOGLE login authentication
* MYSQL database to store data entries
* Alternate backup to GOOGLE spreadsheet
* Calculate lunch fund automatically using number of attendees and bill amount
* Stock portfolio management
* Offline caching for production server

Technologies
------------
* Node.js (webserver)
* gulp (for building the production app)
* bower (for managing UI dependencies)
* Angular.js framework
* Angular Material UI components
* mySQL database for hosting the lunchfund data
* google spreadsheet as an alternate backup for lunchfund data
* GOOGLE sign-on authentication
* optional deployment to Bluemix
* karma/jasmine for testing

Why not native app?
-------------------

Everything we want to accomplish so far can be done via a web app.  Some of the more advance features (i.e. face recognition) may require us to implement native code.  But until that is implemented, this will remain a web app.

Possible Future Work
--------------------

* Build native app (maybe needed for performance anyways)

Issues
------

Found a bug? Please create an issue here on GitHub!

https://github.com/kendrickw/angular_lunchfund/issues

Testing
-------

Testing is performed using Karma and Jasmine.  The configuration file is located in `karma.conf.js`.
All the test files are in `test` directory.

To Start test, first run the production build, as the testcases need access to some of the angular javascripts that are installed in `bower_components`:
```
gulp build
karma start
```

License
-------

Copyright 2013, 2015 Lunch Fund Group