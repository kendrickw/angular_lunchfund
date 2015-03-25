angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/copyright/copyright.html","<div>\n    {{CopyrightCtrl.COPYRIGHT_TEXT}} (v{{CopyrightCtrl.VERSION}})\n</div>");
$templateCache.put("app/fund-chart/fund-chart.html","<md-content class=\"panel panel-default\">\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout=\"row\">\n            <div flex>Fund Book Value</div>\n            <div>{{FundChartCtrl.book.total | currency}}</div>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\">\n        <div google-chart chart=\"FundChartCtrl.book\" style=\"{{FundChartCtrl.book.cssStyle}}\"></div>\n    </div>\n</md-content>");
$templateCache.put("app/fund-form/fund-form.html","<md-content class=\"panel panel-default\">\n    <div class=\"panel-body\">\n\n        <form name=\"Fundform\" ng-submit=\"FundCtrl.submit($event)\">\n\n            <!--\n                For form error detection\n                <pre>{{Fundform.eventdate.$error | json}}</pre>\n            -->\n            <md-input-container>\n                <label>Event Date</label>\n                <input type=\"date\" ng-model=\"FundCtrl.eventdate\"\n                       name=\"eventdate\"\n                       max=\"{{FundCtrl.today}}\"\n                       required/>\n                <div ng-messages=\"Fundform.eventdate.$error\">\n                    <div ng-message=\"required\">Please enter a valid date.</div>\n                    <div ng-message=\"max\">Are you time travelling?</div>\n                </div>\n            </md-input-container>\n\n            <md-input-container>\n                <label>Bill</label>\n                <input type=\"number\" min=\"0\" step=\"0.01\" pattern=\"[\\d\\.]*\"\n                       name=\"bill\"\n                       placeholder=\"Enter Amount\"\n                       ng-change=\"FundCtrl.tipOffset = 0\"\n                       ng-model=\"FundCtrl.billAmount\"\n                       required/>\n                <div ng-messages=\"Fundform.bill.$error\">\n                    <div ng-message=\"required\">Please enter the bill amount</div>\n                    <div ng-message=\"number\">The bill amount must be a number.</div>\n                    <div ng-message=\"min\">There is no such thing as free lunch.</div>\n                </div>\n            </md-input-container>\n\n            <div layout layout-align=\"center center\">\n                <div>Tips ({{FundCtrl.tipPercent | number:2}}%)</div>\n                <span flex></span>\n                <md-button class=\"md-accent md-raised\"\n                           ng-click=\"FundCtrl.tipOffset = 0\"\n                           ng-disabled=\"!FundCtrl.tipOffset\">\n                    <md-icon md-svg-icon=\"content:undo\"></md-icon><span> Reset</span>\n                </md-button>\n            </div>\n\n            <div layout>\n                <md-slider flex ng-model=\"FundCtrl.tipOffset\"\n                           class=\"md-primary\"\n                           aria-label=\"tipOffset\"\n                           id=\"tip\"\n                           step=\"0.25\"\n                           min=\"{{FundCtrl.tipOffsetFloor()}}\"\n                           max=\"{{FundCtrl.tipOffsetCeil()}}\">\n                </md-slider>\n                <div flex=\"33\" layout layout-align=\"start center\">\n                    <div>{{FundCtrl.tipsAmount | currency}}</div>\n                </div>\n            </div>\n\n            <div layout>\n                <div flex>Total</div>\n                <div flex=\"33\">{{FundCtrl.totalAmount | currency}}</div>\n            </div>\n\n            <div layout>\n                <div flex>Each Pays</div>\n                <div flex=\"33\">{{FundCtrl.eachPays | currency}}</div>\n            </div>\n\n            <div layout>\n                <div flex>Lunchfund</div>\n                <div flex=\"33\">{{FundCtrl.getLunchfundAmount() | currency}}</div>\n            </div>\n\n            <div layout>\n                <div flex layout layout=\"start center\">\n                <md-select ng-model=\"FundCtrl.fundholder\" placeholder=\"Fundholder\">\n                    <md-option ng-repeat=\"user in FundCtrl.attendee()\" ng-value=\"user\">{{user.username}}</md-option>\n                </md-select>\n                </div>\n                <div layout layout-align=\"start center\">\n                    <md-button class=\"md-accent md-raised\">\n                        <md-icon md-svg-icon=\"file:cloud-upload\"></md-icon><span> Submit</span>\n                    </md-button>\n                </div>\n            </div>\n\n        </form>\n\n    </div><!-- /panel-body -->\n</md-content>");
$templateCache.put("app/fund-stat/fund-stat.html","<md-content class=\"panel panel-default\">\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout ng-click=\"FundStatCtrl.togglefundholder()\">\n            <div flex>Fund Holder Stats</div>\n            <md-button aria-label=\"{{FundStatCtrl.fundholderstatMode.text}}\"\n                       style=\"padding: 0px;\">\n                <md-icon md-svg-icon=\"{{FundStatCtrl.fundholderstatMode.icon}}\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\" ng-show=\"FundStatCtrl.fundholderstatMode.expand\">\n        <div style=\"display: inline-block\" ng-repeat=\"entry in FundStatCtrl.fundholderstat\">\n                <div class=\"lf-badge\" style=\"display: inline-block\">\n                    {{entry.username}}: {{entry.fund | currency}}\n                </div>\n                <div style=\"width:1px; height:20px; display:inline-block\"></div>\n        </div>\n    </div>\n\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout ng-click=\"FundStatCtrl.togglelunchouting()\">\n            <div flex>Lunch Outings</div>\n            <md-button aria-label=\"{{FundStatCtrl.lunchoutingstatMode.text}}\"\n                       style=\"padding: 0px;\">\n                <md-icon md-svg-icon=\"{{FundStatCtrl.lunchoutingstatMode.icon}}\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\" ng-show=\"FundStatCtrl.lunchoutingstatMode.expand\">\n        <div style=\"display: inline-block\" ng-repeat=\"entry in FundStatCtrl.lunchoutingstat\">\n            <div class=\"lf-badge\" style=\"display: inline-block\">\n                {{entry.username}}: {{entry.meal_count}}\n            </div>\n            <div style=\"width:1px; height:20px; display:inline-block\"></div>\n        </div>\n    </div>\n\n</md-content>");
$templateCache.put("app/luncher-select/luncher-select.html","<md-content class=\"panel panel-default\">\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout=\"row\" ng-click=\"LuncherCtrl.toggleEdit()\">\n            <div flex>{{LuncherCtrl.attendee().length}} lunchers</div>\n            <md-button style=\"padding: 0px;\">\n                <md-icon md-svg-icon=\"{{LuncherCtrl.editMode.icon}}\"></md-icon>\n                <span> {{LuncherCtrl.editMode.text}}</span>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\">\n        <div style=\"display: inline-block\"\n             ng-repeat=\"user in LuncherCtrl.lunchers() track by user.id\"\n             ng-show=\"LuncherCtrl.editMode.expand || LuncherCtrl.isAttending(user)\">\n            <button style=\"display:inline-block\"\n                    class=\"lf-badge\"\n                    ng-class=\"{\n                                \'selected\': LuncherCtrl.editMode.expand && LuncherCtrl.isAttending(user),\n                                \'notselected\': LuncherCtrl.editMode.expand && !LuncherCtrl.isAttending(user)\n                              }\"\n                    ng-click=\"LuncherCtrl.toggle(user)\"\n                    ng-disabled=\"!LuncherCtrl.editMode.expand\">\n                {{user.username}}\n            </button>\n\n            <!-- put some spacings between buttons -->\n            <div style=\"width:1px; height: 20px; display:inline-block\"></div>\n        </div>\n    </div>\n</md-content>");
$templateCache.put("app/past-event/past-event.html","<md-content class=\"panel panel-default\">\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout=\"row\">\n            <div>Past Events</div>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\">\n        <md-list>\n            <md-item ng-repeat=\"event in EventCtrl.events() track by event.id\">\n                <md-item-content>\n                    <div class=\"md-tile-content\">\n                        <h3>{{event.time | date : \'MMM-dd\'}}</h3>\n                        <h4>Bill: {{event.bill | currency}}</h4>\n                        <h4>Lunchfund: {{event.fund | currency}}</h4>\n                    </div>\n                </md-item-content>\n                <md-divider ng-if=\"!$last\"></md-divider>\n            </md-item>\n        </md-list>\n    </div>\n</md-content>");
$templateCache.put("app/routes/dashboard.html","<div class=\"container\">\n\n    <fund-chart></fund-chart>\n    <fund-stat></fund-stat>\n\n</div><!-- /container -->");
$templateCache.put("app/routes/home.html","<div class=\"container\">\n\n    <luncher-select></luncher-select>\n    <fund-form></fund-form>\n    <past-event></past-event>\n\n</div><!-- /container -->");
$templateCache.put("app/routes/setting.html","<div class=\"container\">\n\n    <md-content class=\"panel panel-default\">\n        <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n            <div layout=\"row\">\n                Export Database\n            </div>\n        </md-toolbar>\n\n        <div class=\"panel-body\">\n            To be implemented\n        </div>\n    </md-content>\n\n</div><!-- /container -->");
$templateCache.put("app/routes/stock.html","<div class=\"container\" style=\"min-height: 300px;\">\n\n    <md-autocomplete\n        style=\"margin-bottom: 15px\"\n        md-selected-item=\"StockCtrl.selectedItem\"\n        md-search-text=\"StockCtrl.searchText\"\n        md-items=\"item in StockCtrl.querySearch(StockCtrl.searchText)\"\n        md-item-text=\"item.symbol\"\n        md-autofocus=\"false\"\n        md-delay=\"500\"\n        placeholder=\"Stock Quote Lookup\">\n        <span md-highlight-text=\"StockCtrl.searchText\">{{item.symbol}} ({{item.name}}) - {{item.exchange}}</span>\n    </md-autocomplete>\n\n    <!-- Stock search result -->\n    <stock-chart symbol=\"StockCtrl.selectedItem.symbol\"></stock-chart>\n\n    <stock-chart ng-repeat=\"entry in StockCtrl.getWatchList()\" symbol=\"entry.symbol\"></stock-chart>\n\n</div><!-- /container -->");
$templateCache.put("app/stock-chart/stock-chart.html","<md-content class=\"panel panel-default\" ng-show=\"stocksymbol\">\n    <md-toolbar class=\"panel-heading md-primary md-hue-1\">\n        <div layout>\n            <div flex>{{stock.name}} ({{stocksymbol}})</div>\n            <div ng-show=\"StockChartCtrl.isValidSym\">\n                <md-button aria-label=\"refresh\"\n                           style=\"padding: 0px;\"\n                           ng-click=\"getStockQuote()\">\n                    <md-icon md-svg-icon=\"navigation:refresh\"></md-icon>\n                </md-button>\n                <md-button aria-label=\"buy or sell\"\n                           style=\"padding: 0px;\"\n                           ng-click=\"StockChartCtrl.toggleBuySell()\">\n                    <md-icon md-svg-icon=\"action:shopping-cart\"></md-icon>\n                </md-button>\n                <md-button aria-label=\"maintain watchlist\"\n                           style=\"padding: 0px;\"\n                           ng-click=\"StockChartCtrl.toggleWatchList()\">\n                    <md-icon md-svg-icon=\"{{StockChartCtrl.getToggleIcon()}}\"></md-icon>\n                </md-button>\n            </div>\n        </div>\n    </md-toolbar>\n\n    <div class=\"panel-body\" ng-hide=\"StockChartCtrl.isValidSym\">\n        <p>Unable to retrieve data</p>\n    </div>\n\n    <!-- Buy/Sell Form -->\n    <div class=\"panel-body\" ng-show=\"StockChartCtrl.exposeForm\">\n        <!-- display buy/sell history -->\n\n        <!-- form -->\n        <md-content md-theme=\"dark\" class=\"md-padding\">\n            <form name=\"Stockform\" ng-submit=\"StockChartCtrl.addToStockevent()\">\n                <div layout=\"row\">\n                    <md-select class=\"md-dark-theme dark\" ng-model=\"StockChartCtrl.stockform.type\">\n                        <md-option ng-value=\"\'BUY\'\" ng-selected=\"true\">BUY</md-option>\n                        <md-option ng-value=\"\'SELL\'\">SELL</md-option>\n                    </md-select>\n                    <md-input-container>\n                        <label>Date</label>\n                        <input type=\"date\" ng-model=\"StockChartCtrl.stockform.time\"\n                               name=\"date\"\n                               max=\"{{StockChartCtrl.today}}\"\n                               required/>\n                        <div ng-messages=\"Stockform.date.$error\">\n                            <div ng-message=\"required\">Please enter a valid date.</div>\n                            <div ng-message=\"max\">Are you time travelling?</div>\n                        </div>\n                    </md-input-container>\n                </div>\n                <div layout=\"row\">\n                    <md-input-container>\n                        <label>Position</label>\n                        <input type=\"number\" min=\"1\" step=\"1\" pattern=\"[\\d]*\"\n                               ng-model=\"StockChartCtrl.stockform.position\"\n                               name=\"position\"\n                               required/>\n                    </md-input-container>\n                    <md-input-container>\n                        <label>Price</label>\n                        <input type=\"number\" min=\"0.01\" step=\"0.01\" pattern=\"[\\d\\.]*\"\n                               ng-model=\"StockChartCtrl.stockform.price\"\n                               name=\"price\"\n                               required/>\n                    </md-input-container>\n                    <md-input-container>\n                        <label>Fee</label>\n                        <input type=\"number\" min=\"0\" step=\"0.01\" pattern=\"[\\d\\.]*\"\n                               ng-model=\"StockChartCtrl.stockform.fee\"\n                               name=\"fee\"\n                               required/>\n                    </md-input-container>\n                </div>\n                <div layout=\"row\">\n                    <md-button class=\"md-raised\" flex>\n                        <md-icon md-svg-icon=\"content:add-circle\"></md-icon><span> {{StockChartCtrl.stockform.type}}</span>\n                    </md-button>\n                </div>\n            </form>\n        </md-content>\n    </div>\n\n    <div class=\"panel-body\" ng-show=\"StockChartCtrl.isValidSym\">\n\n        <!-- Transaction history -->\n        <div layout=\"column\">\n            <div ng-repeat=\"event in StockChartCtrl.stockevent\">\n                {{event.time | date : \'MMM-dd-yyyy\'}}:\n                <span ng-if=\"event.buy\">Bought </span>\n                <span ng-if=\"!event.buy\">Sold </span>\n                {{event.position}} units @ {{event.price}}\n            </div>\n        </div>\n\n        <md-divider></md-divider>\n        <!-- START of stock quotes -->\n        <div layout layout-align=\"start center\">\n            <div flex><h1>{{stock.askdisp}}</h1></div>\n            <div ng-style=\"stock.changestyle\"><h2><md-icon md-svg-icon=\"{{stock.changeicon}}\"></md-icon>{{stock.change}}</h2></div>\n        </div>\n        <div layout style=\"font-size: smaller;\">\n            Updated on: {{stock.created | date : \'medium\'}}\n        </div>\n        <div layout style=\"font-size: smaller;\">\n            <div flex=\"40\" layout=\"column\">\n                <div layout>\n                    <div flex>Open</div>\n                    <div>{{stock.open}}</div>\n                </div>\n                <div layout>\n                    <div flex>High</div>\n                    <div>{{stock.dayshigh}}</div>\n                </div>\n                <div layout>\n                    <div flex>Low</div>\n                    <div>{{stock.dayslow}}</div>\n                </div>\n            </div>\n            <div flex></div>\n            <div flex=\"55\" layout=\"column\">\n                <div layout>\n                    <div flex>Market cap</div>\n                    <div>{{stock.mktcap}}</div>\n                </div>\n                <div layout>\n                    <div flex>P/E Ratio</div>\n                    <div>{{stock.PEratio}}</div>\n                </div>\n                <div layout>\n                    <div flex>Dividend</div>\n                    <div>{{stock.divyield}}</div>\n                </div>\n            </div>\n\n        </div>\n        <!-- END of stock quotes -->\n\n        <!--  Get stock graph\n              https://code.google.com/p/yahoo-finance-managed/wiki/miscapiImageDownload\n        -->\n        <md-tabs md-selected=\"StockChartCtrl.tabindex\" flex style=\"overflow: hidden\">\n            <md-tab ng-repeat=\"chart in StockChartCtrl.charts\"\n                    label=\"{{chart.timespan}}\">\n            </md-tab>\n        </md-tabs>\n\n        <!-- Using switch statement, and not placed inline within tab, because\n             I want the image to be loaded only if the tab is visible\n        -->\n        <ng-switch on=\"StockChartCtrl.tabindex\" class=\"tabpanel-container\">\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"1D\"\n                 ng-switch-when=\"0\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"1D chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"5D\"\n                 ng-switch-when=\"1\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"5D chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"3M\"\n                 ng-switch-when=\"2\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"3M chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"6M\"\n                 ng-switch-when=\"3\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"6M chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"1Y\"\n                 ng-switch-when=\"4\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"1Y chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"2Y\"\n                 ng-switch-when=\"5\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"2Y chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"5Y\"\n                 ng-switch-when=\"6\"\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"5Y chart\"></img>\n            </div>\n            <div role=\"tabpanel\"\n                 aria-labelledby=\"max\"\n                 ng-switch-default\n                 md-swipe-left=\"StockChartCtrl.nexttab()\"\n                 md-swipe-right=\"StockChartCtrl.prevtab()\">\n                 <img class=\"fullwidth\"\n                      ng-src=\"{{StockChartCtrl.getStockChartSrc()}}\"\n                      ng-srcset=\"{{StockChartCtrl.getStockChartSrcset()}}\"\n                      alt=\"max chart\"></img>\n            </div>\n        </ng-switch>\n\n    </div>\n\n</md-content>");}]);