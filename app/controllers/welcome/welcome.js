/**
 * Created by Ravi Raman on 08/21/2017
 */
'use strict';

var myapp_welcome = angular.module('myApp.welcome', ['ngRoute', 'ngResource']);

myapp_welcome
.config(['$routeProvider', function ($routeProvider) {
    var setAppVersion = function (path) {
        return path + "?" + LEAD_Version;
    }
    $routeProvider.when('/welcome', {
        templateUrl: setAppVersion('welcome.html'),
        controller: 'welcomeCtrl'
    })
    .when('/servererror', {
        templateUrl: setAppVersion('servererror.html'),
        controller: 'ServerErrorCtrl'
    })
    .when('/unauthorized', {
        templateUrl: setAppVersion('unauthorized.html'),
        controller: 'unauthorizedAccessCtrlr'
    });
}]);