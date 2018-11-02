/**
 * Created by Ravi Raman on 08/21/2017
 */
'use strict';
angular.module('myApp.welcome').controller('ServerErrorCtrl', ["$rootScope", "$scope", "Session", "AppMessages", "AppConstants", function ($rootScope, $scope, Session, AppMessages, AppConstants) {

    $rootScope.session = Session;
    $scope.header = AppMessages.SERVERERROR_HEADER;
    $scope.message = AppMessages.SERVERERROR_MSG;
    //EYtoastr.error(AppMessages.NOT_AUTHORIZED, AppMessages.NOT_AUTHORIZED);
    $scope.AppConstants = AppConstants;
    try {
        $scope.ishtml = $rootScope.dataTest.indexOf("</html>") > -1;
        $scope.detailError = $sce.trustAsHtml($rootScope.dataTest);
    }
    catch (err) {
        $scope.ishtml = false;
    }


    $('#spinnerLaunch').hide();
}]);

