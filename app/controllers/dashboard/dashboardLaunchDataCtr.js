'use strict';

/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardLaunchDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection", 
	"AppConstants",  "$filter", "dashboardSFService", "Idle", "jsonPath", function ($rootScope, $location, AppCommon, $scope, Connection, AppConstants, 
	$filter,dashboardSFService, Idle, jsonPath) {

    $scope.gotoDashboardPage = function (r) {
        $location.path("/" + $rootScope.backPage);
    };
	$rootScope.showView = true;
	if($rootScope.session){
		$rootScope.session = "";
		delete $rootScope.session;
		dashboardSFService = null;
	}
	
	//window.onload = function() {
	    // if(!window.location.hash) {
	    //     window.location = window.location + '#loaded';
	    //     window.location.reload();
	    // }
	//}
	
}]);