'use strict';

/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection", "AppConstants", 
function ($rootScope, $location, AppCommon, $scope, Connection, AppConstants) {

    //redirect if there is no access
    if (!$rootScope.menuRole.DASHBOARD) {
        $location.path("/unauthorized");
    }

    if (!$rootScope.isUserLoaded) {
        $location.path("/");
    }

    $scope.redirectTo = function (redirectURL) {
        $location.path("/" + redirectURL);
    };
}]);