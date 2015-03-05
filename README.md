# LunchFund written in Angular

The application uses Node.js®

## See it in action!


## How to deploy
npm install
bower install
gulp build
node app.js

## How it works
MYSQL database needs to be InnoDB to support SQL transactions.


## Developer Notes
# Avoid using ng-controller, so directive is used wherever possible
# ngmin is not used in gulp, so make sure to use the following syntax:
app.controller('MenuController', [ '$aside', 'global', function ($aside, global) {
    ...
}]);

## License

The license information can be found in the file [license.txt](./license.txt), which is located in the root directory of the project.