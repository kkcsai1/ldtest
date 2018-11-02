'use strict';

/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardDefinitionDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection", 
"AppConstants",  "$filter", "Idle", "jsonPath", "AppMessages", function ($rootScope, $location, AppCommon, $scope, Connection, AppConstants,  $filter, Idle, jsonPath, AppMessages) {

    $scope.gotoDashboardPage = function (r) {
        $location.path("/" + r);
    };
    
    
	$scope.getPeerPath = function(peerPath){
		var peerPathVal = "";
		$.each(peerPath.CycleData, function(k,v){
			if(v.CategoryName.toLowerCase().indexOf("peer")!=-1){
				peerPathVal = v.Value;
			}
		});
		return peerPathVal;
	};

	$scope.currentUser = $rootScope.session.userModel;

	$scope.peerPath = "";
	if($rootScope.session.userModel.nonPPEDDpeerGroupResponseError && $rootScope.session.userModel.nonPPEDDpeerGroupResponseError!=""){
		if($rootScope.session.userModel.nonPPEDDpeerGroupResponseError.status === 404){
			$scope.peerPath = AppMessages.NO_TALENT_METRICS;
			$scope.peerPath = $scope.peerPath.replace("REPLACEGUI", $scope.currentUser.gui);
			$scope.peerPath = $scope.peerPath.replace("REPLACEYEAR", $rootScope.session.userModel.nonPPEDD.selectedYear);
		}else if($rootScope.session.userModel.nonPPEDDpeerGroupResponseError.status === 500){
			var errorCode = [];
			var errorID = "";
			errorCode = $rootScope.session.userModel.nonPPEDDpeerGroupResponseError.responseText.split(":");
			if(errorCode.length>0){
				if(errorCode[1]){
					errorID = errorCode[1];
				}
			}
			$scope.peerPath = AppMessages.PEER_INTERNAL_SERVICE_ERROR + errorID;
		}
	}else if($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup && $rootScope.session.userModel.nonPPEDDpeerGroup.length>0){
		
		if(typeof $rootScope.session.userModel.nonPPEDDpeerGroup[$rootScope.session.userModel.nonPEERindex] !== "undefined") {
			$scope.peerPath = $rootScope.session.userModel.nonPPEDDpeerGroup[$rootScope.session.userModel.nonPEERindex];
		}
		if(typeof $scope.peerPath !== "undefined" && $scope.peerPath && $scope.peerPath.CycleData && $scope.peerPath.CycleData.length>0){
			//$scope.peerPath = $scope.peerPath.CycleData[0].Value;
			$scope.peerPath = $scope.getPeerPath($scope.peerPath);
		}
	}
}]);