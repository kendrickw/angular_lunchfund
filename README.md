Lab Lunch Group Mutual Fund Mobile Application (powered by Angular.JS)
======================================================================

This a webapp for calculating lunch fund contribution, and also records attendance and lunch fund amount in a spreadsheet hosted on google drive.

Getting Started
---------------

The [zipball of latest release](https://github.com/kendrickw/angular_lunchfund/archive/master.zip) contains everything you need to deploy the lunchfund app.

This webapp uses the following technologies:
* Node.js (webserver)
* gulp (for building the production app)
* bower (for managing UI dependencies)
* Angular.js framework
* Angular Material UI components
* mySQL database for hosting the lunchfund data
* google spreadsheet as an alternate backup for lunchfund data
* GOOGLE sign-on authentication
* option deployment to Bluemix

The SQL database must be populated first before running the lunchfund app.
* (Ask Kendrick for the current .sql file)
* routes/config.js contains user configuration parameters

Once the package is downloaded, first install the dependencies:
(This Assumes you have bower and Node.js already installed)
# bower install
# npm install

To start the server in development mode
* If you are using powershell in windows: $env:NODE_ENV="development"
* If you are using UNIX: set NODE_ENV="development"
* npm run start

To start the server in production mode
* If you are using powershell in windows: $env:NODE_ENV="production"
* If you are using UNIX: set NODE_ENV="production"
* npm run start

To deploy development version to BLUEMIX (Read manifest.yml for detail)
* npm run deploy-dev

To deploy production version to BLUEMIX (Read manifest.dist.yml for detail)
* npm run deploy-prod

Features
--------

* GOOGLE login authentication
* MYSQL database to store data entries
* Alternate backup to GOOGLE spreadsheet
* Calculate lunch fund automatically using number of attendees and bill amount
* Stock portfolio management

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

None at the moment.

License
-------

Copyright 2013, 2015 Lunch Fund Group