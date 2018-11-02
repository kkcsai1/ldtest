/**
 * Created by Ravi Raman on 08/21/2017
 */
'use strict';
angular.module('myApp.welcome').controller('unauthorizedAccessCtrlr', ["$rootScope", "$scope", "Session", "AppMessages", "$location", function ($rootScope, $scope, Session, AppMessages, $location) {

    $rootScope.session = Session;
    if (Session.userModel.isContractor) {
        $scope.message = Session.userModel.errorMessage;
    } else {
        $scope.message = AppMessages.NOT_AUTHORIZED;
    }

    setTimeout(function () {
        $(".return-top-home").bind('click', function () {
            $location.path("/home");
            $rootScope.$apply();
        });
    }, 100);


}]);

