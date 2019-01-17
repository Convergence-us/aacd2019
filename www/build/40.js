webpackJsonp([40],{

/***/ 947:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityFeedLeaderboardPageModule", function() { return ActivityFeedLeaderboardPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__ = __webpack_require__(969);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_charts__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_charts__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let ActivityFeedLeaderboardPageModule = class ActivityFeedLeaderboardPageModule {
};
ActivityFeedLeaderboardPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */]),
            __WEBPACK_IMPORTED_MODULE_3_ng2_charts__["ChartsModule"],
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */]
        ]
    })
], ActivityFeedLeaderboardPageModule);

//# sourceMappingURL=activityfeedleaderboard.module.js.map

/***/ }),

/***/ 969:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityFeedLeaderboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_charts__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ng2_charts__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Components, functions, plugins







let ActivityFeedLeaderboardPage = class ActivityFeedLeaderboardPage {
    constructor(navParams, storage, databaseprovider, cd, view, localstorage) {
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.view = view;
        this.localstorage = localstorage;
        //public chartLabels: string[] = ['John Black','Peter Vroom','Lauren Post','Jennifer Toddley','Lisa Bollenbach'];
        //public chartData: number[] = [1200,1000,850,825,700];
        this.chartLabels = [];
        //public chartData: number[] = [];
        this.chartData = [
            { data: [], label: 'Postings' }
        ];
        this.chartType = 'horizontalBar';
        this.chartLegend = false;
        //public chartOptions: any[] = {title: {
        //			display: true,
        //			text: 'Postings and Comments'
        //		},
        //		scales:{xAxes:[{ticks:{beginAtZero:true}}]}};
        this.chartOptions = { title: {
                display: true,
                text: 'Postings and Comments'
            },
            scales: { xAxes: [{ ticks: { beginAtZero: true } }] } };
    }
    ionViewDidEnter() {
        var flags = "lb|";
        this.cd.markForCheck();
        this.databaseprovider.getDatabaseStats(flags, "0").then(data => {
            if (data['length'] > 0) {
                var AttendeeName = "";
                for (var i = 0; i < data['length']; i++) {
                    AttendeeName = data[i].LastName + ", " + data[i].FirstName;
                    this.chartLabels.push(AttendeeName);
                    var Counter = parseInt(data[i].PostingsComments);
                    this.chartData[0].data.push(Counter);
                }
                //console.log('Labels: ' + JSON.stringify(this.chartLabels));
                //console.log('Data: ' + JSON.stringify(this.chartData));
                this.cd.markForCheck();
                //this.chart.chart.config.data.labels = "Postings";
                this.chart.chart.update();
            }
        });
    }
    closeModal() {
        this.view.dismiss();
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_6_ng2_charts__["BaseChartDirective"]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_ng2_charts__["BaseChartDirective"])
], ActivityFeedLeaderboardPage.prototype, "chart", void 0);
ActivityFeedLeaderboardPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activityfeedleaderboard',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/activityfeedleaderboard/activityfeedleaderboard.html"*/'<ion-header>\n		<ion-navbar color="primary">\n		  <button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		  </button>\n		  <ion-title>\n			Leaderboard Top 10\n		  </ion-title>\n		</ion-navbar>\n	  </ion-header>\n\n<ion-content>\n\n	<div class="chart-container" style="position: relative; height:100vh; width:100vw">\n		<canvas baseChart #chart\n		 [datasets]=\'chartData\' \n		 [labels]=\'chartLabels\' \n		 [chartType]=\'chartType\'\n		 [options] = \'chartOptions\'\n		 [legend]="chartLegend">\n		</canvas>\n\n		<ion-grid>\n			<ion-row>\n				<ion-col col-4 >\n				</ion-col>\n				<ion-col col-4 >\n					<button ion-button block color="danger" (click)="closeModal()">\n						Close\n					</button>\n				</ion-col>\n				<ion-col col-4 >\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n<div style="margin-left:20px">\n<p>*Rotate your device to landscape mode for larger view.<br>\n 	 *Tap any bar to get details.\n</p>\n	</div>\n</div>\n	\n\n</ion-content>		\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/activityfeedleaderboard/activityfeedleaderboard.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["A" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityFeedLeaderboardPage);

//# sourceMappingURL=activityfeedleaderboard.js.map

/***/ })

});
//# sourceMappingURL=40.js.map