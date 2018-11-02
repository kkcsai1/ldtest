'use strict';
/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardCommentsDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection", 
"AppConstants",  "$filter", "dashboardSFService", "Idle", "jsonPath",
function ($rootScope, $location,AppCommon, $scope, Connection, AppConstants,  $filter, dashboardSFService, Idle, jsonPath) {
	$scope.spinnerCounter = 0;
    $scope.gotoDashboardPage = function (r) {
        $location.path("/" + $rootScope.backPage);
    };

	$scope.currentUser = $rootScope.session.userModel;
	
	 $scope.$watch(function () {
	 	if(dashboardSFService.nonPPEDDdashBoardDetail && dashboardSFService.nonPPEDDdashBoardDetail.dashboardComments){
        	return dashboardSFService.nonPPEDDdashBoardDetail.dashboardComments;
	 	}
    },
    function (newVal, oldVal) {
        //alert("Inside watch");
        if (dashboardSFService.nonPPEDDdashBoardDetail != null) {
        	   $scope.dashBoardData = {};
        	   $scope.dashBoardData.UserResponded = dashboardSFService.nonPPEDDdashBoardDetail.dashboardComments;
	           $scope.spinnerCounter --;
	   	} 
    }, true);
}]);