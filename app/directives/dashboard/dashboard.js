/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('dashboard', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/dashboard/dashboard.html'),
        scope: {
            dmetric: "=",
            ddonut: "=",
            MR_URL: "="
        },
        link: function (scope, elem, attr) {


        },
        controller : "@", // @ symbol
        name:"dashboardController"
    }
}]);
