/**
 * Created by Ravi Raman on 08/21/2017
 */
'use strict';
angular.module('myApp.welcome').controller('welcomeCtrl', ["$rootScope", "$scope", "Session", "$location", "$timeout", "AppConstants", "AppMessages", function ($rootScope, $scope, Session, $location, $timeout, AppConstants, AppMessages) {
    $rootScope.adminMenu = false;
    $rootScope.session = Session;
    $scope.AppMessages = AppMessages;
    $scope.AppConstants = AppConstants;

    if (!angular.isUndefined(Session.userModel) && !angular.isUndefined(Session.userModel.gpn)) {
        $('#spinnerLaunch').hide();
    }

    if (Session.userModel.gpn) {
        $scope.data_loaded = true;
        $timeout(function () { $("#welcomeUserModal").modal('show'); }, 500);

    }
    $rootScope.path = function () {
        return $location.path();
    }

    $rootScope.$on('$routeChangeSuccess', function () {
        console.log("welcomeCtrl - $routeChangeSuccess")
    });
}]);

