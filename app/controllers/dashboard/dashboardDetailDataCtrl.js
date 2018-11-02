'use strict';
/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardDetailDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", 
"Connection", "AppConstants", "dashboardSFService", "Util",  function ($rootScope, $location, AppCommon, $scope, Connection, 
AppConstants, dashboardSFService, Util) {
    $scope.spinnerCounter = 0;

    $scope.isSearchPage = false;
    $scope.isReviewerPage = false;
    $scope.isDashboardPage = false;

    $scope.showPeerAverage = true;
    $scope.showSelfAssessment = true;

    $scope.isCommentsVisible = false;

    //Disable or Show Top buttons
    $scope.isYTDButtonVisible = false;
    $scope.isSelfAssessmentButtonVisible = false;
    $scope.isPeerAverageButtonVisible = false;

	$scope.peerGroupEnable = AppConstants.PPEDD_PEAR_GROUP_ENABLE;

    if ($location.path().indexOf("lead-reviewer-detail") != -1) {
        //for hiding the metrics link
        $scope.isReviewerPage = true;
    }
    if ($location.path().indexOf("dashboard") != -1) {
        //for preventing the redirection from detail page to new page
        $scope.isDashboardPage = true;
    }

    if ($location.path().indexOf("search") != -1) {
        //for hiding the metric section
        $scope.isSearchPage = true;
    }
    
    $scope.currentUser = $rootScope.session.userModel;

    $scope.$watch(function () {
    	if(dashboardSFService.dashBoardDetail && dashboardSFService.dashBoardDetail.RaterInfo){
        	return dashboardSFService.dashBoardDetail.RaterInfo;
    	}
    },
    function (newVal, oldVal) {
        //alert("Inside watch");
        if (dashboardSFService.dashBoardDetail && dashboardSFService.dashBoardDetail.RaterInfo!=null) {
        	
			$scope.isCommentsVisible = true;
            if (typeof $scope.dashBoardData != "undefined") {
                if ($scope.dashBoardData.YTDProgress != "") {
                    $scope.isYTDButtonVisible = true;
                }
                if ($scope.dashBoardData.PeerAverage != "") {
                    $scope.isPeerAverageButtonVisible = true;
                }
                if ($scope.dashBoardData.SelfAssesment != "") {
                    $scope.isSelfAssessmentButtonVisible = true;
                }
            }
            
            $scope.dashBoardData = dashboardSFService.dashBoardDetail;
            var commentResponse =  dashboardSFService.dashBoardDetail.Comments;
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
		"comments":"",
		"dir" : "ltr"
	};
	var commentsObj = {};
	var commentsTmp = [];
	$scope.buildCommentsObject = function(commentResponse){
		commentsTmp = [];
		
		$.each(commentResponse, function(key, value){
			commentsObj = angular.copy(comments);
			
			var ltr = Util.commentDirection(value.comment);
			
			commentsObj.comments  = value.comment;
			commentsObj.dir  = ltr;
			$scope.getUserOtherInfo(value, value);
			commentsObj.photo = value.photo;
			commentsObj.userName = value.userName;
			commentsObj.weightKey = value.weightKey;
			commentsObj.FeedbackSubmittedDate = value.FeedbackSubmittedDate;
			commentsTmp.push(commentsObj);
		});
		$scope.dashboardData = {"Comments":""};
		$scope.mergedComments = commentsTmp;
		$scope.spinnerCounter--;
	};
	
	$scope.getUserOtherInfo = function(userObj, subvalue){
      		$.each(dashboardSFService.dashBoardDetail.RaterInfo, function(key,value){
      			if(userObj.userId == value.ParticipantId || userObj.formContentId == value.formContentId)
      			{
      				subvalue.userName = value.ParticipantName;
      				subvalue.weightKey = value.Weight;
      				subvalue.photo = value.photo;
      				
      				if(AppConstants.JAVA_LAYER_ENABLED){
		  				subvalue.FeedbackSubmittedDate = Util.dateConverter(value.lastModifiedDate);
		  			}else{
		  					subvalue.FeedbackSubmittedDate = value.lastModifiedDate;
		  			}
      				
      			}
      		});
      };

    $scope.hidePeerAverage = function () {
        $(".peer-average").toggle();
        $(".slider-peer-average").toggle();
        $scope.showPeerAverage = !$scope.showPeerAverage;
    };

    $scope.hideSelfAssessment = function () {
        $(".self-assessment-arrow").toggle();
        $(".slider-self-assessment-arrow").toggle();
        $scope.showSelfAssessment = !$scope.showSelfAssessment;
    };
    
    $scope.ytdProgress = function () {
        $(".ytd").toggle();
        $(".slider-ytd").toggle();
    };

    $scope.redirectTo = function (redirectURL) {
        if ($scope.isDashboardPage) {
            $location.path("/" + redirectURL);
        }
        else {
            dashboardSFService.showDashboardDetails = false;
            dashboardSFService.showDashboard = true;
        }
    };



    //goalService.dashBoardDetail = null;
}]);