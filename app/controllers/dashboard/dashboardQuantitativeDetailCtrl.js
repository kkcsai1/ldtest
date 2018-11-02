'use strict';
/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardQuantitativeDetailDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection", 
"AppConstants",  "$filter", "dashboardSFService", "Idle", "jsonPath", "Util",
function ($rootScope, $location,AppCommon, $scope, Connection, AppConstants,  $filter, dashboardSFService, Idle, jsonPath, Util) {
	$scope.spinnerCounter = 0;
    $scope.gotoDashboardPage = function (r) {
        $location.path("/dashboard");
    };
    
    $scope.metricsData = $rootScope.session.userModel.PPEDD.currentMBMDataTapped.metricsData;
	$scope.type =  $rootScope.session.userModel.PPEDD.currentMBMDataTapped.type;

	$scope.currentUser = $rootScope.session.userModel;
	
	 $scope.$watch(function () {
    	if(dashboardSFService.dashBoardDetail && dashboardSFService.dashBoardDetail.RaterInfo){
        	return dashboardSFService.dashBoardDetail.RaterInfo;
    	}
    },
    function (newVal, oldVal) {
        //alert("Inside watch");
        if (dashboardSFService.dashBoardDetail && dashboardSFService.dashBoardDetail.RaterInfo!=null) {
        
            //$scope.dashBoardData = dashboardSFService.dashBoardDetail;
            var commentResponse =  $rootScope.session.userModel.PPEDD.ServiceResponse[0].quantitative;
            $scope.spinnerCounter ++;
        	$scope.buildCommentsObject(commentResponse);
        } else if (dashboardSFService.dashBoardDetail == null) {
            $scope.isCommentsVisible = false;
        }
    }, true);
    
    
	
	var comments = {
		"photo" :"",
		"userName" : "",
		"weightKey": "",
		"FeedbackSubmittedDate" : "",
		"comments":""
	};
	var commentsObj = {};
	var commentsTmp = [];
	
	
	
	$scope.buildCommentsObject = function(commentResponse){
		commentsTmp = [];
		
		$.each(commentResponse, function(key, value){
			
			if(value.metricsName.toLowerCase().indexOf($scope.type) > -1){
				commentsObj = angular.copy(comments);
				commentsObj.comments  = value.comment;
				$scope.getUserOtherInfo(value);
				commentsObj.photo = value.userPhoto;
				commentsObj.userName = value.userName;
				commentsObj.weightKey = value.weight;
				commentsObj.formContentId = value.formContentId;
				//commentsObj.FeedbackSubmittedDate = value.lastModifiedDate;
					if(AppConstants.JAVA_LAYER_ENABLED){
		  				commentsObj.FeedbackSubmittedDate = Util.dateConverter(value.lastModifiedDate);
		  			}else{
		  					commentsObj.FeedbackSubmittedDate = value.lastModifiedDate;
		  			}
				commentsObj.ParticipantRatingStatus = value.ParticipantRatingStatus;
				
				if(commentsObj.ParticipantRatingStatus && commentsObj.ParticipantRatingStatus.toLowerCase() == "completed"){
					commentsTmp.push(commentsObj);
				}
			}
		});
		$scope.dashboardData = {"Comments":""};
		$scope.mergedComments = commentsTmp;
		$scope.spinnerCounter--;
	};
	
	$scope.getUserOtherInfo = function(subvalue){
		  	$.each(dashboardSFService.dashBoardDetail.RaterInfo, function(key,value){
		  		if(subvalue.formContentId == value.formContentId)
		  		{
		  			subvalue.userName = value.ParticipantName;
		  			subvalue.weight = value.Weight;
		  			subvalue.projectName = value.projectName;
		  			subvalue.userPhoto = value.photo;
		  			if(AppConstants.JAVA_LAYER_ENABLED){
		  				subvalue.FeedbackSubmittedDate = Util.dateConverter(value.lastModifiedDate);
		  			}else{
		  					subvalue.FeedbackSubmittedDate = value.lastModifiedDate;
		  			}
		  	
		  			subvalue.JobTitle =  value.JobTitle;
		  			subvalue.ParticipantRatingStatus =  value.ParticipantRatingStatus;
		  		}
		  	});
		};
      
	
	
	    $scope.checkGlobalSales = function (metricsData) {
        if (metricsData.GlobalSalesUSDConst === "" || metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesPlanUSDConst == null || metricsData.GlobalSalesPlanUSDConst === "" || metricsData.GlobalSalesPlanAchievedPct === "" || metricsData.GlobalSalesPlanAchievedPct == null) {
            return true;
        } else {
            return false;
        }
    }

    $scope.globalMarginPercentageBlock = function (metricsData) {
        if (metricsData.GlobalMarginPlanAchievedPct === "" || metricsData.GlobalMarginPlanAchievedPct == null || metricsData.GlobalMarginPct === "" || metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPlanPct === "" || metricsData.GlobalMarginPlanPct == null)
        {
            return true;
        } else {
            return false;
        }
    };

    $scope.globalTERPercentageBlock = function (metricsData) {
        if (metricsData.GlobalTERPlanAchievedPct === "" || metricsData.GlobalTERPlanAchievedPct == null || metricsData.GlobalTERUSDGlobal === "" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst === "" || metricsData.GlobalTERPlanUSDConst == null) {
            return true;
        } else {
            return false;
        }
    };

    $scope.isGlobalMarginPlanPctHidden = function (metricsData) {
        if (metricsData.GlobalMarginPlanPctActual == null || metricsData.GlobalMarginPlanPctActual === "") {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.isGlobalTERPlanPctHidden = function (metricsData) {
        if (metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanUSDConst === "") {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.isGlobalSalesPlanPctHidden = function (metricsData) {
        if (metricsData.GlobalSalesPlanUSDConst == null || metricsData.GlobalSalesPlanUSDConst === "") {
            return true;
        }
        else {
            return false;
        }
    };


    $scope.isGlobalPipelineHidden = function (metricsData) {
        if (metricsData.GlobalPipelineUSDConst == null || metricsData.GlobalPipelineUSDConst === "" || metricsData.GlobalPipelineUSDConst == null || metricsData.GlobalPipelineUSDConst === "") {
            return true;
        } else {
            return false;
        }
    };

    $scope.isGlobalMarginPctHide = function (metricsData) {
        if (metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPct === "") {
            return true;
        } else {
            return false;
        }
    }

    $scope.isGlobalSalesUSDHide = function (metricsData) {
        if (metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesUSDConst === "") {
            return true;
        } else {
            return false;
        }
    }

    
    
    
}]);