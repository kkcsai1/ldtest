/**
 * Created by Ravi Raman on 08/21/2017.
 */

'use strict';


var myapp_welcome = angular.module('myApp.welcome', ['ngRoute', 'ngResource']);

myapp_home
.config(['$routeProvider', function($routeProvider) {
    var setAppVersion = function (path) {
        return path + "?" + LEAD_Version;
    }
    $routeProvider.when('/welcome', {
        templateUrl: setAppVersion('welcome.html'),
        controller: 'welcomeCtrl'
    });
}])
.controller('ServerErrorCtrl', ["$rootScope", "$scope", "Session", "AppMessages", "AppConstants", function ($rootScope, $scope, Session, AppMessages, AppConstants) {
    $rootScope.session = Session;
    $scope.header = AppMessages.SERVERERROR_HEADER;
    $scope.message = AppMessages.SERVERERROR_MSG;
    //EYtoastr.error(AppMessages.NOT_AUTHORIZED, AppMessages.NOT_AUTHORIZED);
    $scope.AppConstants = AppConstants;
    try {
        $scope.ishtml = $rootScope.dataTest.indexOf("</html>") > -1;
        $scope.detailError =  $sce.trustAsHtml($rootScope.dataTest);
    }
    catch (err) {
        $scope.ishtml = false;
    }
    $('#spinnerLaunch').hide();
}])