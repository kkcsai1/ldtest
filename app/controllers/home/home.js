'use strict';

var myapp_home = angular.module('myApp.home', ['ngRoute','ngResource','ngTouch']);

angular.module('myApp.home')
.config(['$routeProvider', function($routeProvider) {
    var setAppVersion = function (path) {
        return path + "?" + LEAD_Version;
    }
  $routeProvider.when('/home', {
      templateUrl: setAppVersion('app/views/dashboard/dashboard.html'),
    controller: 'HomeCtrl'
  }).when('/privacy', {
      templateUrl: setAppVersion('app/views/home/privacy.html'),
      controller: 'PrivacyCtrl'
  }).when('/privacy-detail', {
      templateUrl: setAppVersion('app/views/home/privacy-detail.html'),
      controller: 'PrivacyDetailCtrl'
  });
}]);







