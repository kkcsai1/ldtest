'use strict';

/**
 * Created by Ravi Raman on 08/21/2017.
 */

var myapp_dashboard = angular.module('myApp.dashboard', ['ngRoute']);

angular.module('myApp.dashboard').config(['$routeProvider', function ($routeProvider) {

    var setAppVersion = function (path) {
        return path + "?" + LEAD_Version;
    }

    $routeProvider.when('/dashboard', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard.html'),
        controller: 'DashboardCtrl',
        requireADLogin: true
    }).when('/dashboard-non-ppedd-sr', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-nonppedd-sr.html'),
        controller: 'DashboardCtrl',
        requireADLogin: true
    }).when('/dashboard-detail', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-detail.html'),
        controller: 'DashboardCtrl'
    }).when('/comments', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-comments.html'),
        controller: 'DashboardCommentsDataCtrl'
    }).when('/quantitative-detail', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-quantitative-detail.html'),
        controller: 'DashboardQuantitativeDetailDataCtrl'
    }).when('/definitions', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-definition.html'),
        controller: 'DashboardDefinitionDataCtrl'
    }).when('/launch', {
        templateUrl: setAppVersion('app/views/dashboard/dashboard-launch.html'),
        controller: 'DashboardLaunchDataCtrl'
    });
}]);