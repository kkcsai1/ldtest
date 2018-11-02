/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('dashboardDetail', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/dashboard/dashboard-detail.html'),
        scope: {
        },
        link: function (scope, elem, attr) {

        },
        controller : "@", // @ symbol
        name:"dashboardController"
    }
}]);