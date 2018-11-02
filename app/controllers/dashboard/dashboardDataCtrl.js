/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardDataCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection",
	"AppConstants", "$filter",
	"dashboardSFService", "Idle", "jsonPath", "UserModel", "$q",
	"sfDataService", "dashboardDataService", "AppMessages", "dashboardDataService1", "dashboardHeaderDataService",
	"adalAuthenticationService", "Util",
	function($rootScope, $location, AppCommon, $scope, Connection, AppConstants, $filter,
		dashboardSFService, Idle, jsonPath, UserModel, $q,
		sfDataService, dashboardDataService, AppMessages, dashboardDataService1, dashboardHeaderDataService, adalService, Util) {

		//reset response log
		$rootScope.captureResponseLog = [];

		if (AppConstants.METRICS_GUI && AppConstants.METRICS_GUI != "") {
			$scope.currentPGUI = AppConstants.METRICS_GUI;
		} else {
			$scope.currentPGUI = $rootScope.session.userModel.gui;
		}

		$scope.mbmDataMessage = AppMessages.MBMNODATA;

		dashboardSFService.dashBoardPGUI = null;
		dashboardSFService.dashBoardChannelType = null;
		dashboardSFService.dashboardSubChannelType = null;
		dashboardSFService.dashBoardDetail = {
			"RaterInfo": ""
		};

		$scope.peerGroupEnable = AppConstants.PPEDD_PEAR_GROUP_ENABLE;

		$scope.spinnerCounter = 0;

		$scope.showPeerAverage = true;
		$scope.showSelfAssessment = true;
		$scope.showFinalAssessment = true;

		$scope.isSearchPage = false;
		$scope.isReviewerPage = false;
		$scope.isDashboardPage = false;
		$scope.dashboardMetricsData = [];
		$scope.isNoDataMessageVisible = false;
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

		/* SF integration code starts here */

		var feedbackRequestedCount = 0;
		var feedbackReceivedCount = 0;
		var feedbackRequesterDeclinedCount = 0;
		var feedbackProviderRequestedCount = 0;
		var feedbackProviderCompletedCount = 0;
		var feedbackProviderDeclinedCount = 0;

		$scope.feedbackRequestedCount = 0;
		$scope.feedbackReceivedCount = 0;
		$scope.feedbackRequesterDeclinedCount = 0;
		$scope.feedbackProviderRequestedCount = 0;
		$scope.feedbackProviderCompletedCount = 0;
		$scope.feedbackProviderDeclinedCount = 0;

		/* $scope.getAsFeedbackRequested = function(obj){
	    	$.each(obj, function(key, value){
				
				if(value.Feedback.Status == 3) 
				{ feedbackProviderCompletedCount++; } 
				else  { feedbackProviderRequestedCount++; } 
				
				if(value.Feedback.FormOriginator == AppConstants.LOGGED_IN_USER) { feedbackRequestedCount++; }
				if(value.Feedback.FormSubjectId ==  AppConstants.LOGGED_IN_USER) { feedbackReceivedCount++; } 
			
			});
			
			$scope.feedbackRequestedCount = feedbackRequestedCount;
	    	$scope.feedbackReceivedCount = feedbackReceivedCount;	
	    	$scope.feedbackProviderRequestedCount = feedbackProviderRequestedCount;
	    	$scope.feedbackProviderCompletedCount = feedbackProviderCompletedCount;
			
	    };*/

		$scope.setMax = function(arr, prop, pageUpdate) {
			var max, maxIndex;
			for (var i = 0; i < arr.length; i++) {
				arr[i].IsMax = false;

				if (!$scope.checkGlobalTER(arr[i])) {
					if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) {
						max = arr[i];
						maxIndex = i;
					}
				}
			}
			if (pageUpdate) {
				arr[0].IsMax = true;
			}
			if (angular.isUndefined(maxIndex) == false)
				arr[maxIndex].IsMax = true;

			return max;
		};

		$scope.checkGlobalTER = function(metricsData) {
			//if (metricsData.GlobalTERUSDGlobal == "" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst == "" || metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanAchievedPct == "" || metricsData.GlobalTERPlanAchievedPct == null) {
			if (metricsData.GlobalTERUSDGlobal === "" || metricsData.GlobalTERUSDGlobal == null) {
				return true;
			} else {
				return false;
			}
		}

		$scope.isSelfAssessmentDone = function() {
			$scope.isSelfFeedback = false;
			$.each($scope.raterInfo, function(key, value) {
				if (value.category.toLowerCase() == "self") {
					$scope.isSelfFeedback = true;
				}
			});
		};

		$scope.clearCounts = function() {

			$scope.feedbackRequestedCount = 0;
			$scope.feedbackReceivedCount = 0;
			$scope.feedbackProviderRequestedCount = 0;
			$scope.feedbackProviderCompletedCount = 0;
			$scope.feedbackProviderDeclinedCount = 0;
			$scope.feedbackRequesterDeclinedCount = 0;
		};

		$scope.getAsFeedbackRequested = function(response) {

			if (response.length > 0) {
				obj = response[0].FormContents;
			} else {
				return false;
			}

			$.each($scope.raterInfo, function(key, value) {
				//feedbackRequestedCount++; 

				if (value.category.toLowerCase() != "self" && value.ParticipantRatingStatus.toLowerCase() == "completed" && $rootScope.session.userModel
					.gui != value.ParticipantId) {
					feedbackReceivedCount++;
				}
				if (value.category.toLowerCase() != "self" && value.ParticipantRatingStatus.toLowerCase() == "declined" && $rootScope.session.userModel
					.gui != value.ParticipantId) {
					feedbackRequesterDeclinedCount++;
				}
				if (value.category.toLowerCase() != "self" && $rootScope.session.userModel.gui != value.ParticipantId) {
					feedbackRequestedCount++;
				}
			});

			// 	$.each(obj, function(key, value){    
			// feedbackRequestedCount++; 
			// if(value.FormContentStatus == 3) {
			// 	feedbackReceivedCount++;
			// } 
			// 	});	

			//check self assessment exists
			/*$scope.isSelfAssessmentDone();
			if($scope.isSelfFeedback == true && $scope.feedbackRequestedCount > 0){
				$scope.feedbackRequestedCount--;
			}*/
			// if($scope.isSelfFeedback == true && $scope.feedbackReceivedCount > 0){
			// 	$scope.feedbackReceivedCount--;
			// }

			$scope.feedbackRequestedCount = feedbackRequestedCount;
			$scope.feedbackReceivedCount = feedbackReceivedCount;
			$scope.feedbackRequesterDeclinedCount = feedbackRequesterDeclinedCount;
			$scope.feedbackProviderRequestedCount = feedbackProviderRequestedCount;
			$scope.feedbackProviderCompletedCount = feedbackProviderCompletedCount;
			$scope.feedbackProviderDeclinedCount = feedbackProviderDeclinedCount;

		};

		if ($rootScope.session.userModel.PPEDD) {
			$scope.yearDropDown = $rootScope.session.userModel.PPEDD.yearDropDown;
			$scope.selectedYear = $rootScope.session.userModel.PPEDD.selectedYear;
		}

		$scope.loadDashboardData = function(change) {
			$scope.spinnerCounter++;
			if ($rootScope.session.userModel.PPEDD && $rootScope.session.userModel.PPEDD.CategoryObjForRendering != "" && $rootScope.session.userModel
				.PPEDD.RaterInfo != "" && $rootScope.session.userModel.PPEDD.comments != "" && $rootScope.session.userModel.PPEDD.ServiceResponse !=
				"" && change == 0) {

				$scope.dashboardData = {
					"Categories": ""
				};
				$scope.dashboardData.Categories = $rootScope.session.userModel.PPEDD.CategoryObjForRendering;
				$scope.raterInfo = $rootScope.session.userModel.PPEDD.RaterInfo;
				$scope.getAsFeedbackRequested($rootScope.session.userModel.PPEDD.ServiceResponse);

				$scope.spinnerCounter--;
				$scope.dashboardMetricsData = $rootScope.session.userModel.PPEDD.MetricsData;

				if ($scope.dashboardMetricsData) {
					$scope.setMax($scope.dashboardMetricsData, "GlobalTERUSDGlobal", 0);
				}

				//return false;
			} else {

				$scope.noData = false;
				$rootScope.session.userModel.PPEDD = {
					"ServiceResponse": ""
				};

				//passing startdate and end date as empty - for PPEDD cycle dropdown is not availalbe 

				dashboardHeaderDataService.getDashboardHeaderData(AppConstants.LOGGED_IN_USER, "", "", $scope.selectedYear).then(function(response) {
					$scope.getDashboardData(response);
				}).catch(function(err) {
					//$scope.getPeerAverageWhenFeedbackEmpty();
					$scope.noData = Util.showErrorMessage(err);
					$scope.clearDashboardData();
					$scope.spinnerCounter--;
				});
			}

		};

		$scope.getDashboardData = function(headerResponse) {

			dashboardDataService1.getDashboardData(headerResponse).then(function(response) {
				/*
					End Session Service 
					Integration Date - 17 Aug 2018 17:07 IST
				*/
				if (AppConstants.JAVA_LAYER_ENABLED) {
					$.ajax({
						url: "/eygjava/" + AppConstants.LOGGED_IN_USER + "/es",
						method: "POST",
						success: function(data) {
							console.log("Session Terminated");
						},
						error: function(status) {
							console.log("Error in terminating session : " + status);
						}
					});
				}
				if (response.length > 0) {
					//declaration
					$rootScope.session.userModel.PPEDD.ServiceResponse = response;

					$scope.raterInfo = [];

					//remove the Removed,360Evaluation rater info details
					var raterdData = $.grep(response[0].raterInfo, function(element) {
						var isFound = true;
						if (element.ParticipantRatingStatus == 'Removed') {
							isFound = false;
						}
						if (isFound) {
							return element;
						}
					});

					$scope.raterInfo = raterdData;

					//$scope.raterInfo = response[0].raterInfo;
				} else {
					$scope.noData = AppMessages.DASHBOARD_MESSAGES.ERROR.NO_RESULTS_FROM_FORM_FIRST_PART + " " + $rootScope.session.userModel.displayName +
						". " + AppMessages.DASHBOARD_MESSAGES.ERROR.NO_RESULTS_FROM_FORM_SECOND_PART;
					//$scope.spinnerCounter--;
				}
				$scope.getAsFeedbackRequested(response);
				var dashboardData = response;

				console.log("dashboard data");
				console.log("dashboard");

				var GoalsCategory = {
					"CategoryID": "",
					"CategoryName": "",
					"YTDProgress": "",
					"PeerAverage": "",
					"SelfAssesment": "",
					"FinalAssessment": "",
					"FinalAssessmentActual": "",
					"formContentId": "",
					"formDataId": "",
					"SortOrder": "",
					"FbGoals": [],
					"Comments": [],
					"enablegreyshade": false,
					"isQuality": false
				};

				var FbGoals = {
					"GoalID": "",
					"GoalName": "",
					"GoalDescription": "",
					"YTDProgress": "",
					"PeerAverage": "",
					"SelfAssesment": "",
					"FinalAssesment": "",
					"SortOrder": ""
				};

				var Comments = {
					"Comment": "",
					"Rating": "",
					"UserId": ""
				};

				var tmpCategory = {};
				var tmpCategorySubGoals = {};
				var tmpComments = {};

				var tmpCategoryArray = [];
				var tmpCategorySubGoalsArray = [];
				var tmpCommentsArray = [];
				var obj = {};
				var goals = {};
				var sliderValue = {};
				//$scope.isQANDERMExist = false;

				var tmpCategory = {};

				$scope.selfFormType = 0;
				if (dashboardData && dashboardData.length > 0 && typeof dashboardData[0].selfFormType != "undefined") {
					$scope.selfFormType = dashboardData[0].selfFormType;
				}

				if ($scope.selfFormType == 0 && dashboardData && dashboardData.length > 0 && typeof dashboardData[0].yearEndQERMFormType !=
					"undefined") {
					$scope.selfFormType = dashboardData[0].yearEndQERMFormType;
				}

				$.each(dashboardData, function(key, value) {

					$.each(value.categories, function(subkey, subvalue) {
						if (subvalue.isCateogry == true) {

							tmpCategory = angular.copy(GoalsCategory);
							tmpCategory.CategoryID = subvalue.categoryId
							tmpCategory.CategoryName = subvalue.categoryName

							if (tmpCategory.CategoryName.toLowerCase().indexOf("quality") != -1) {
								if ($scope.selfFormType == "A") {
									$scope.divident = AppConstants.DIVIDENT_THREE;
									tmpCategory.formType = $scope.selfFormType;
								} else if ($scope.selfFormType == "B") {
									$scope.divident = AppConstants.DIVIDENT_FIVE;
									tmpCategory.formType = $scope.selfFormType;
								} else {
									$scope.divident = AppConstants.DIVIDENT_SEVEN;
								}
							} else {
								$scope.divident = AppConstants.DIVIDENT_SEVEN;
							}

							if (subvalue.YTD != "")
								tmpCategory.YTDProgress = ((subvalue.YTD / subvalue.YTDCount) / $scope.divident) * 360;

							if (subvalue.rating != "")
								tmpCategory.SelfAssesment = ((subvalue.rating / subvalue.ratingCount) / $scope.divident) * 360;

							if (subvalue.finalAssessment != "") {
								tmpCategory.FinalAssessmentActual = subvalue.finalAssessment;
							}

							if (($scope.selfFormType == "A" || $scope.selfFormType == "B") && tmpCategory.CategoryName.toLowerCase().indexOf("quality") !=
								-1) {
								if (subvalue.YTD != "") {
									tmpCategory.YTDProgress = (subvalue.YTD / subvalue.YTDCount);
									tmpCategory.YTDProgress = Util.getRadianFormTypeValue($scope.selfFormType, tmpCategory.YTDProgress);
								}

								if (subvalue.rating != "") {
									tmpCategory.SelfAssesment = (subvalue.rating / subvalue.ratingCount);
									tmpCategory.SelfAssesment = Util.getRadianFormTypeValue($scope.selfFormType, tmpCategory.SelfAssesment);
								}

								if (subvalue.finalAssessment != "") {
									tmpCategory.FinalAssessment = (subvalue.finalAssessment / subvalue.finalAssessmentCount);
									tmpCategory.FinalAssessment = Util.getRadianFormTypeValue("C", tmpCategory.FinalAssessment);
								}
							}

							tmpCategory.Comments = subvalue.comments;

							//tmpCategory.Comments.push({"userId":"adminst", "comment":"test"});

							//tmpCategory.raterInfo.push(subvalue.raterInfo);

							/*tmpCategory.raterInfo.push({"ParticipantName":"Ravi Ram",
													"Weight":"Medium",
													"JobTitle":"Senior Associate",
													"ParticipantId":"adminst",
													"ParticipantRatingStatus":"",
													"category":"Medium",
													"formContentId":"12312312"});*/

							tmpCategorySubGoalsArray = [];
							tmpCategory.FbGoals = [];
							$.each(subvalue.subCateogry, function(subcatkey, subcatvalue) {
								tmpCategorySubGoals = angular.copy(FbGoals);
								tmpCategorySubGoals.GoalID = subcatvalue.subCategoryId;
								tmpCategorySubGoals.GoalName = subcatvalue.subCategoryName;

								if (subcatvalue.subCategoryYTD != "") {
									tmpCategorySubGoals.YTDProgress = ((subcatvalue.subCategoryYTD / subcatvalue.subCategoryYTDCount) / $scope.divident) *
										100;
								}

								if (subcatvalue.subCategoryRating != "") {
									tmpCategorySubGoals.SelfAssesment = ((subcatvalue.subCategoryRating / subcatvalue.subCategoryRatingCount) / $scope.divident) *
										100;
								}

								tmpCategorySubGoalsArray.push(tmpCategorySubGoals);

								//hard code order
								if (subcatvalue.subCategoryName == "Connected") {
									tmpCategorySubGoals.SortOrder = 1;
								} else if (subcatvalue.subCategoryName == "Responsive") {
									tmpCategorySubGoals.SortOrder = 2;
								} else if (subcatvalue.subCategoryName == "Insightful") {
									tmpCategorySubGoals.SortOrder = 3;
								} else if (subcatvalue.subCategoryName == "Right mix") {
									tmpCategorySubGoals.SortOrder = 1;
								} else if (subcatvalue.subCategoryName == "Teaming") {
									tmpCategorySubGoals.SortOrder = 2;
								} else if (subcatvalue.subCategoryName == "Highest performing teams") {
									tmpCategorySubGoals.SortOrder = 3;
								}

								// tmpCommentsArray = [];
								// tmpComments = angular.copy(Comments);
								// $.each(subcatvalue.subCategoryOfficialComment, function(subcatcommentkey,subcatcommentvalue){
								// 	 tmpComments.Rating = subcatcommentvalue.Rating;
								// 	 tmpComments.Comment =	subcatcommentvalue.Comment;
								// 	 tmpComments.UserId =	subcatcommentvalue.UserId;
								// 	 tmpCommentsArray.push(tmpComments);
								// });

								// $.each(subcatvalue.subcategorySelfRatingComment, function(subcatcommentkey,subcatcommentvalue){
								// 	 tmpComments.Rating = subcatcommentvalue.Rating;
								// 	 tmpComments.Comment =	subcatcommentvalue.Comment;
								// 	 tmpComments.UserId =	subcatcommentvalue.UserId;
								// 	 tmpCommentsArray.push(tmpComments);
								// });

								// $.each(subcatvalue.subcategorySelfRatingComment, function(subcatcommentkey,subcatcommentvalue){
								// 	subcatcommentvalue.Rating
								// 	subcatcommentvalue.Comment
								// 	subcatcommentvalue.UserId
								//                      });

							});
							// tmpCategory.Comments = tmpCommentsArray;
							tmpCategory.FbGoals = tmpCategorySubGoalsArray;

							if (tmpCategory.CategoryName.indexOf("Quality and effective") > -1) {
								$scope.isQANDERMExist = true;
								tmpCategory.SortOrder = 0;
								tmpCategory.isQuality = true;
							}

							if (tmpCategory.CategoryName.indexOf("Quality and effective") > -1) {
								tmpCategory.SortOrder = 0;
							} else if (tmpCategory.CategoryName.indexOf("People engagement and teaming") > -1) {
								tmpCategory.SortOrder = 2;
							} else if (tmpCategory.CategoryName.indexOf("Exceptional client service") > -1) {
								tmpCategory.SortOrder = 1;
							}

							if (tmpCategory.CategoryName.indexOf("Instructions") > -1) {
								//do nothing
							} else {
								tmpCategoryArray.push(tmpCategory);
							}
						}
					});

				});

				obj = tmpCategoryArray

				var temp = {};
				//Add Quality static hardcoded values
				if (!$scope.isQANDERMExist && $scope.noData == false) {
					temp = angular.copy(GoalsCategory);
					temp.CategoryName = "Quality and effective risk management";
					temp.CategoryID = 99999;
					temp.SortOrder = 0;
					temp.isQuality = true;
					temp.enablegreyshade = true;
					temp.PeerAverage = 0;
					obj.push(temp);
				}
				//Add Quality static hardcoded values

				$scope.isYTDButtonVisible = false;
				$scope.isSelfAssessmentButtonVisible = false;
				$scope.isPeerAverageButtonVisible = false;

				for (var i = 0; i < obj.length; i++) {
					goals = obj[i].FbGoals;

					if (($scope.selfFormType == "A" || $scope.selfFormType == "B") && obj[i].CategoryName.toLowerCase().indexOf("quality") != -1) {
						obj[i].YTDProgress = obj[i].YTDProgress != "" ? obj[i].YTDProgress : "";
						obj[i].PeerAverage = obj[i].PeerAverage != "" ? obj[i].PeerAverage : "";
						obj[i].SelfAssesment = obj[i].SelfAssesment != "" ? obj[i].SelfAssesment : "";
						obj[i].FinalAssessment = obj[i].FinalAssessment != "" ? obj[i].FinalAssessment : "";
					} else {
						obj[i].YTDProgress = obj[i].YTDProgress != "" ? obj[i].YTDProgress - 90 : "";
						obj[i].PeerAverage = obj[i].PeerAverage != "" ? obj[i].PeerAverage - 90 : "";
						obj[i].SelfAssesment = obj[i].SelfAssesment != "" ? obj[i].SelfAssesment - 90 : "";
						obj[i].FinalAssessment = obj[i].FinalAssessment != "" ? obj[i].FinalAssessment - 90 : "";
					}

					if (obj[i].YTDProgress != "") {
						$scope.isYTDButtonVisible = true;
					}
					if (obj[i].PeerAverage != "") {
						$scope.isPeerAverageButtonVisible = true;
					}
					if (obj[i].SelfAssesment != "") {
						$scope.isSelfAssessmentButtonVisible = true;
					}

					$scope.valueExistsCounter = 0;

				}

				if (response.length > 0) {
					$scope.getPhotosOfCompletedUser().then(function(res) {
						$scope.getPeerAverage(obj);
						$scope.spinnerCounter--;
						//$scope.spinnerCounter = 0;
					}).catch(function(err) {

						$scope.noData = Util.showErrorMessage(err);
						$scope.clearDashboardData();
						$scope.spinnerCounter--;
					});
				} else {
					$scope.getPeerAverage(obj);
					$scope.spinnerCounter--;
				}

				/*	if($scope.dashboardData==undefined && obj.length>0){
	        			$scope.dashboardData = {"Categories":""};
						$scope.dashboardData.Categories =obj;
						$rootScope.session.userModel.PPEDD.CategoryObjForRendering = obj;
						$scope.spinnerCounter--;
	            	}*/

			}).catch(function(err) {

				$scope.noData = Util.showErrorMessage(err);
				$scope.clearDashboardData();
				$scope.spinnerCounter--;
			});
		}

		$scope.renderSlider = function(obj) {

			for (var i = 0; i < obj.length; i++) {
				goals = obj[i].FbGoals;
				goals = obj[i].FbGoals;

				$.each(goals, function(key, value) {
					value.sliderValue = [];
					if (value.YTDProgress != "") {
						sliderValue = {
							"title": "ytd",
							"value": value.YTDProgress,
							"color": "#4c4b4c"
						};
						$scope.valueExistsCounter++;
						value.sliderValue.push(sliderValue);
					}

					if (value.PeerAverage != "") {
						sliderValue = {
							"title": "peer-average",
							"value": value.PeerAverage,
							"color": "#7aba40"
						};
						$scope.valueExistsCounter++;
						value.sliderValue.push(sliderValue);
					}

					if (value.SelfAssesment != "") {
						sliderValue = {
							"title": "self-assessment-arrow",
							"value": value.SelfAssesment,
							"color": "#5595ff"
						};
						$scope.valueExistsCounter++;
						value.sliderValue.push(sliderValue);
					}

					if (value.FinalAssessment != "") {

						sliderValue = {
							"title": "final-assessment-arrow",
							"value": value.FinalAssesment,
							"color": "#929292"
						};
						$scope.valueExistsCounter++;
						value.sliderValue.push(sliderValue);
					}

					obj[i].valueExistsCounter = $scope.valueExistsCounter;
				});
			}
		}

		$scope.getPeerAverage = function(obj) {

			if ($scope.peerGroupEnable === false) {
				//don't call peer service - render dashboard
				$scope.spinnerCounter--;
				$scope.renderSlider(obj);
				$scope.renderDash(obj);
				return;
			}

			var getPeerAverageDataSuccess = function(response) {
				$scope.spinnerCounter--;
				$scope.appendPeerAverage(obj, response);
				$scope.renderSlider(obj);
				$scope.renderDash(obj);
				if (!($rootScope.session.userModel && $rootScope.session.userModel.PPEDDpeerGroup)) {
					$scope.$apply();
				}
				$rootScope.session.userModel.PPEDDpeerGroup = response;
				$rootScope.session.userModel.PPEDDpeerGroup.FY = $scope.selectedYear;
			};
			var getPeerAverageDataSuccessSession = function(response) {
				$rootScope.session.userModel.PPEDDpeerGroup = response;
				$rootScope.session.userModel.PPEDDpeerGroup.FY = $scope.selectedYear;
				$scope.spinnerCounter--;
				$scope.appendPeerAverage(obj, response);
				$scope.renderSlider(obj);
				$scope.renderDash(obj);
			};
			var getPeerAverageDataError = function(response) {
				$scope.spinnerCounter--;
				$scope.renderSlider(obj);
				$scope.renderDash(obj);
				$scope.$apply();
			};
			$scope.spinnerCounter++;

			if ($rootScope.session.userModel && $rootScope.session.userModel.PPEDDpeerGroup) {
				/*
					Calling of Peer Average Service on Year change fixed - 16/08/2018
				*/
				if ($rootScope.session.userModel.PPEDDpeerGroup.FY === $scope.selectedYear) {
					getPeerAverageDataSuccessSession($rootScope.session.userModel.PPEDDpeerGroup);
				} else {
					dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
				}
			} else {
				dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
			}
		};

		$scope.getPeerAverageWhenFeedbackEmpty = function() {
			var getPeerAverageDataSuccess = function(response) {
				$rootScope.session.userModel.PPEDDpeerGroup = response;
				$scope.spinnerCounter--;
				$scope.$apply();

			};
			var getPeerAverageDataError = function(response) {
				$scope.spinnerCounter--;
				$scope.$apply();
			};
			$scope.spinnerCounter++;
			if ($rootScope.session.userModel && $rootScope.session.userModel.PPEDDpeerGroup) {
				getPeerAverageDataSuccess($rootScope.session.userModel.PPEDDpeerGroup);
			} else {
				dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
			}
		};

		$scope.appendPeerAverage = function(obj, peerArray) {
			$.each(obj, function(key, val) {
				val.PeerAverage = $scope.getPeerValue(val.CategoryName, peerArray, key, 0);
				if (val.FbGoals && val.FbGoals.length > 0) {
					$.each(val.FbGoals, function(key1, val1) {
						val1.PeerAverage = $scope.getPeerValue(val1.GoalName, peerArray, key1, 1);
					});
				}
			});
		}

		//$scope.categoryNames = [{"CategoryName"}];

		$scope.getPeerIndex = function(peerArray) {
			var res = 0;
			$(peerArray).each(function(key, val) {
				if (val.CycleEnd === val.Cyclestart) {
					res = key;
				}
			});
			return res;
		}

		function getCategoryCodeFromPeerServiceMapping(categoryName) {
			var res = "";
			var categoryMappingArray = AppConstants.PEER_GROUP_MAPPING;
			$(categoryMappingArray).each(function(key, value) {
				if (value.categoryName.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
					res = value.peerCategoryCode;
				}
			});
			return res;
		}

		function getPeerValueFromArray(peerArray, peerCode) {
			var res = "";
			$(peerArray).each(function(key, value) {
				if (value.CategoryName === peerCode) {
					res = value.Value;

					if (parseInt(res) === 0) {
						res = "";
					}

				}
			});
			return res;
		}

		$scope.getPeerValue = function(name, peerArray, key, subCategory) {

			//determine the cycle dates
			//get fy18 index
			var index = $scope.getPeerIndex(peerArray);
			var resPeerCode = '';
			var val = '';

			if (subCategory == 0) {
				resPeerCode = getCategoryCodeFromPeerServiceMapping(name);
				val = getPeerValueFromArray(peerArray[index].CycleData, resPeerCode);

				if (val === "") {
					return "";
				}

				//if QERM different logic
				if (($scope.selfFormType == "A" || $scope.selfFormType == "B") && name.toLowerCase().indexOf("quality") != -1) {
					val = Util.getRadianFormTypeValue($scope.selfFormType, val);
					if (typeof val != "undefined")
						return val;
					else
						return "";
				}

				val = (val / AppConstants.DIVIDENT_SEVEN) * 360;
				return val !== "" ? val - 90 : "";
			} else {
				//slider
				resPeerCode = getCategoryCodeFromPeerServiceMapping(name);
				val = getPeerValueFromArray(peerArray[index].CycleData, resPeerCode);
				if (val === "") {
					return "";
				}

				return (val / AppConstants.DIVIDENT_SEVEN) * 100;
			}

		}

		$scope.renderDash = function(obj) {
			$scope.dashboardData = {
				"Categories": ""
			};
			$scope.dashboardData.Categories = obj;
			$rootScope.session.userModel.PPEDD.CategoryObjForRendering = obj;
		}

		$scope.clearDashboardData = function() {
			$scope.dashboardData = {
				"Categories": ""
			};
			//$scope.getPeerAverageWhenFeedbackEmpty();
		};

		$scope.getYearData = function() {
			if ($rootScope.session.userModel.PPEDD) {
				$scope.yearDropDown = $rootScope.session.userModel.PPEDD.yearDropDown;
				$scope.selectedYear = $rootScope.session.userModel.PPEDD.selectedYear;
			} else {
				$scope.selectedYear = AppConstants.SELECTED_YEAR;
				var yearArray = Object.keys(AppConstants.GENERIC_CYCLE_DATES);
				var yearDropDown = [];
				for (var j = 0; j < yearArray.length; j++) {
					var yearConfigObject = {
						"value": "",
						"displayName": "",
						"selected": "",
						"year": ""
					};
					yearConfigObject.value = yearArray[j];
					yearConfigObject.displayName = yearArray[j];
					yearConfigObject.year = parseInt(AppConstants.YEAR_HEAD + yearArray[j].slice(-2));
					if (AppConstants.SELECTED_YEAR === yearConfigObject.value) {
						yearConfigObject.selected = 1;
					} else {
						yearConfigObject.selected = 0;
					}
					yearDropDown.push(yearConfigObject);
				}
				$scope.yearDropDown = yearDropDown;
			}
			$scope.loadDashboardData(0);
		};

		$scope.getSelectedIndex = function() {
			$scope.selectedIndex = 0;
			$.each(AppConstants.YEAR_CONFIG, function(key, val) {
				if (val.selected === 1) {
					$scope.selectedIndex = key;
				}
			});
		};

		$scope.getYearData();

		$scope.onYearChange = function() {
			$scope.spinnerCounter = 0;
			//$scope.spinnerCounter++;
			$scope.noData = false;
			$scope.clearCounts();
			$scope.loadDashboardData(1);

		};

		$scope.getPhotosOfCompletedUser = function() {
			var deferred = $q.defer();
			//var itemObj = jsonPath(competencyResult,'$..[?(@.itemId=='+ competenciesData.itemId +')]');
			var userArr = [];
			$.each($scope.raterInfo, function(k, v) {
				if (v.ParticipantRatingStatus == "Completed") {
					userArr.push("'" + v.ParticipantId + "'");
				}
			});

			if (userArr.length > 0) {
				var usercommaseparated = userArr.join();
				sfDataService.getUserPhotos(usercommaseparated).then(function(response) {
					$scope.userPhotos = response;
					$scope.appendUserPhotoToRater();
					deferred.resolve();
				}).catch(function(err) {
					$scope.noData = Util.showErrorMessage(err);
					$scope.clearDashboardData();
					$scope.spinnerCounter--;
				});
			} else {
				deferred.resolve();
			}

			return deferred.promise;
		};

		$scope.appendUserPhotoToRater = function() {
			$.each($scope.raterInfo, function(k, v) {
				v.photo = "";
				$.each($scope.userPhotos.results, function(sk, sv) {
					if (v.ParticipantId == sv.userId) {
						v.photo = sv.photo;
					}
				});
			});
		};

		$scope.metricsURL = AppConstants.METRICS_URL;

		dashboardSFService.showDashboard = true;
		dashboardSFService.showDashboardDetails = false;

		$scope.gotoQuantitativeDetail = function(metricsData, type) {
			var data = {};
			data.metricsData = metricsData;
			data.type = type;
			$rootScope.session.userModel.PPEDD.currentMBMDataTapped = data;

			dashboardSFService.dashBoardDetail.RaterInfo = $scope.raterInfo;
			dashboardSFService.dashBoardDetail.pgui = $scope.currentPGUI;

			//store it in session
			$rootScope.session.userModel.PPEDD.RaterInfo = $scope.raterInfo;
			$rootScope.session.userModel.PPEDD.selectedYear = $scope.selectedYear;
			$rootScope.session.userModel.PPEDD.yearDropDown = $scope.yearDropDown;

			$location.path("/quantitative-detail");
		};

		$scope.gotoDetailPage = function(obj) {
			dashboardSFService.dashBoardDetail = null;
			setTimeout(function() {
				dashboardSFService.dashBoardDetail = obj;
				//dashboardSFService.dashBoardDetail = {"RaterInfo":""};
				dashboardSFService.dashBoardDetail.RaterInfo = $scope.raterInfo;
				dashboardSFService.dashBoardDetail.pgui = $scope.currentPGUI;

				//store it in session
				$rootScope.session.userModel.PPEDD.RaterInfo = $scope.raterInfo;
				$rootScope.session.userModel.PPEDD.yearDropDown = $scope.yearDropDown;
				$rootScope.session.userModel.PPEDD.selectedYear = $scope.selectedYear;

				$scope.$apply();
			}, 60);

			$rootScope.isVisible = true;
			if ($scope.isDashboardPage) {
				$location.path("/dashboard-detail");
			} else {
				dashboardSFService.showDashboardDetails = true;
				dashboardSFService.showDashboard = false;
			}
		};

		$scope.getDashboardMetricsData = function(pgui, pageUpdate) {

			if ($rootScope.session.userModel.PPEDD.MetricsData) {
				return false;
			}

			var getDashboardMetricsDataSuccess = function(res) {

				// var newResponseObj = {
				// 	"EmployeeID" : "",
				// 	"FirstLastName" : "",
				// 	"RoleType" : "",
				// 	"RoleName" : "",
				// 	"MarketSegment" : "",
				// 	"ServiceLine" : "",
				// 	"GlobalMarginPlanAchievedPct" : "",
				// 	"GlobalMarginPlanPctActual" : "",
				// 	"GlobalMarginPct" : "",
				// 	"GlobalSalesUSDConst" : "",
				// 	"GlobalPipelineUSDConst" : "",
				// 	"GlobalSalesPlanAchievedPct" : "",
				// 	"GlobalSalesPlanUSDConst" : "",
				// 	"GlobalTERPlanAchievedPct" : "",
				// 	"GlobalTERUSDGlobal" : "",
				// 	"GlobalTERPlanUSDConst" : "",
				// 	"DimMonthEndingDateKey" : "",
				// 	"DimWeekEndingDateKey" : ""
				// };

				var ResponseObj = {
					"Area": "",
					"Region": "",
					"EmployeeGUI": "",
					"EmployeeName": "",
					"RoleType": "",
					"RoleName": "",
					"MarketSegment": "",
					"ServiceLine": "",
					"GlobalMarginAchievedPct": "",
					"GlobalMarginPlanPct": "",
					"GlobalMarginActualPct": "",
					"GlobalSalesActual": "",
					"GlobalPipelineActual": "",
					"GlobalSalesAchievedPct": "",
					"GlobalSalesPlan": "",
					"GlobaTERAchievedPct": "",
					"GlobalTERActual": "",
					"GlobalTERPlan": "",
					"DimMonthEndinzgDateKey": "",
					"DimWeekEndingDateKey": ""
				};

				var convertObj = [];
				var tmpCategory = {};
				$.each(res, function(key, value) {
					tmpCategory = angular.copy(ResponseObj);
					tmpCategory.Area = value.Area;
					tmpCategory.Region = value.Region;
					tmpCategory.EmployeeID = value.EmployeeGUI;
					tmpCategory.FirstLastName = value.EmployeeName;
					tmpCategory.RoleType = value.RoleType;
					tmpCategory.RoleName = value.RoleName;
					tmpCategory.MarketSegment = value.MarketSegment;
					tmpCategory.ServiceLine = value.ServiceLine;
					tmpCategory.GlobalMarginPlanAchievedPct = value.GlobalMarginAchievedPct;
					tmpCategory.GlobalMarginPlanPct = value.GlobalMarginPlanPct;
					tmpCategory.GlobalMarginPct = value.GlobalMarginActualPct;
					tmpCategory.GlobalSalesUSDConst = value.GlobalSalesActual;
					tmpCategory.GlobalPipelineUSDConst = value.GlobalPipelineActual;
					tmpCategory.GlobalSalesPlanAchievedPct = value.GlobalSalesAchievedPct;
					tmpCategory.GlobalSalesPlanUSDConst = value.GlobalSalesPlan;
					tmpCategory.GlobalTERPlanAchievedPct = value.GlobaTERAchievedPct;
					tmpCategory.GlobalTERUSDGlobal = value.GlobalTERActual;
					tmpCategory.GlobalTERPlanUSDConst = value.GlobalTERPlan;
					tmpCategory.DimMonthEndingDateKey = value.DimMonthEndingDateKey;
					tmpCategory.DimWeekEndingDateKey = value.DimWeekEndingDateKey;
					convertObj.push(tmpCategory);
				});

				var response = convertObj;

				if (response != null && response.length > 0) {
					for (var i = 0; i < response.length; i++) {

						if (response[i].GlobalTERPlanAchievedPct < 0) {
							response[i].cssGlobalTERPlanAchievedPct = {
								'width': '0%'
							};
						} else if (response[i].GlobalTERPlanAchievedPct > 100) {
							response[i].cssGlobalTERPlanAchievedPct = {
								'width': '100%'
							};
						} else
							response[i].cssGlobalTERPlanAchievedPct = {
								'width': response[i].GlobalTERPlanAchievedPct + '%'
							};

						if (response[i].GlobalMarginPlanAchievedPct < 0) {
							response[i].cssGlobalMarginPlanAchievedPct = {
								'width': '0%'
							};
						} else if (response[i].GlobalMarginPlanAchievedPct > 100) {
							response[i].cssGlobalMarginPlanAchievedPct = {
								'width': '100%'
							};
						} else if (response[i].GlobalMarginPlanAchievedPct == "" || response[i].GlobalMarginPlanAchievedPct == null) {
							response[i].cssGlobalMarginPlanAchievedPct = 0;
						} else
							response[i].cssGlobalMarginPlanAchievedPct = {
								'width': response[i].GlobalMarginPlanAchievedPct + '%'
							};

						if (response[i].GlobalSalesPlanAchievedPct < 0) {
							response[i].cssGlobalSalesPlanAchievedPct = {
								'width': '0%'
							};
						} else if (response[i].GlobalSalesPlanAchievedPct > 100) {
							response[i].cssGlobalSalesPlanAchievedPct = {
								'width': '100%'
							};
						} else
							response[i].cssGlobalSalesPlanAchievedPct = {
								'width': response[i].GlobalSalesPlanAchievedPct + '%'
							};

						if (response[i].GlobalMarginPct == null) {
							response[i].GlobalMarginPct = null;
						} else if (response[i].GlobalMarginPct < 0) {
							response[i].GlobalMarginPct = "(" + Math.abs(response[i].GlobalMarginPct) + "%)";
						} else {
							response[i].GlobalMarginPct = response[i].GlobalMarginPct + "%";
						}

						response[i].GlobalMarginPlanPctActual = response[i].GlobalMarginPlanPct;
						if (response[i].GlobalMarginPlanPct == null) {
							response[i].GlobalMarginPlanPct = null;
						} else if (response[i].GlobalMarginPlanPct < 0) {
							response[i].GlobalMarginPlanPct = "(" + Math.abs(response[i].GlobalMarginPlanPct) + ")";
							//response[i].GlobalMarginPlanPct = "(" + Math.abs(response[i].GlobalMarginPlanPct) + "%)";
						} else {
							response[i].GlobalMarginPlanPct = response[i].GlobalMarginPlanPct;
							//response[i].GlobalMarginPlanPct = response[i].GlobalMarginPlanPct + "%";
						}

						if (response[i].MarketSegment != "" && response[i].RoleType == "MSL" && response[i].RoleName == "Market segment leader" &&
							response[i].ServiceLine == "") {
							response[i].RoleName = response[i].RoleName + " - " + response[i].MarketSegment;
						}

						if (response[i].MarketSegment != "" && response[i].ServiceLine != "" && response[i].RoleType == "MSL" && response[i].RoleName ==
							"Market segment leader") {
							response[i].RoleName = response[i].MarketSegment + " SL " + response[i].RoleName + " - " + response[i].ServiceLine;
						}

						if (response[i].RoleType == "BUL" && response[i].RoleName == "Business Unit Leader") {
							var roleName = "Executive leadership";

							if (typeof response[i].Area != undefined && response[i].Area != null && response[i].Area != "") {
								roleName = roleName + " - " + response[i].Area;
							}

							if (typeof response[i].Region != undefined && response[i].Region != null && response[i].Region != "") {
								roleName = roleName + " - " + response[i].Region;
							}

							if (typeof response[i].ServiceLine != undefined && response[i].ServiceLine != null && response[i].ServiceLine != "") {
								roleName = roleName + " - " + response[i].ServiceLine;
							}
							response[i].RoleName = roleName;

						}

						//if (response[i].GlobalSalesPlanUSDConst < 0) {
						//    response[i].GlobalSalesPlanUSDConst = "(" + response[i].GlobalSalesPlanUSDConst + ")";
						//}
						//if (response[i].GlobalPipelineUSDConst < 0) {
						//    response[i].GlobalPipelineUSDConst = "(" + response[i].GlobalPipelineUSDConst + ")";
						//}
					}

					$scope.dashboardMetricsData = response;

					$rootScope.session.userModel.PPEDD.MetricsData = $scope.dashboardMetricsData;

					$scope.setMax($scope.dashboardMetricsData, "GlobalTERUSDGlobal", pageUpdate);

					setTimeout(function() {
						if ($('[data-toggle="popover"]')) {
							//$('[data-toggle="popover"]').popover("enable");
						}
					}, 200);
				} else {

					$scope.isNoDataMessageVisible = true;

				}
				$scope.spinnerCounter--;

				//$rootScope.showspinner = false;
			};

			var getDashboardMetricsDataError = function(response) {
				//$rootScope.showspinner = false;
				$scope.spinnerCounter--;
				$scope.isNoDataMessageVisible = true;

				if (response && response === "counselee_view") {
					$scope.mbmDataMessage = AppMessages.COMING_SOON;
				} else {
					$scope.$apply();
				}
			};

			//$rootScope.showspinner = true;

			var params = {};
			//params.PartnerGui = "10002151";
			params.PartnerGui = $scope.currentPGUI;
			$scope.spinnerCounter++;
			dashboardSFService.dashboardMetricsData(params, getDashboardMetricsDataSuccess, getDashboardMetricsDataError);
			//dashboardSFServiceData.dashboardMetricsData(params,getDashboardMetricsDataSuccess, getDashboardMetricsDataError)
		};

		$scope.getTodayUTCDate = function() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth(); //January is 0!
			var yyyy = today.getFullYear();
			var TodayDate = "";
			TodayDate = new Date(Date.UTC(yyyy, mm, dd, 0, 0, 0));
			return TodayDate;
		}

		$scope.testMessage = "";
		$scope.init = function() {
			$scope.testMessage = "";
		};

		$scope.logout = function() {
			adalService.logOut();
		};

		$scope.login = function() {
			adalService.login();
		};

		//azureService.getItems();

		// optional
		$scope.$on("adal:loginSuccess", function() {
			$scope.testMessage = "loginSuccess";
			//adalService.login();
			//$scope.getDashboardMetricsData($scope.currentPGUI, 0);
		});

		// optional
		$scope.$on("adal:loginFailure", function() {
			$scope.testMessage = "loginFailure";
			$location.path("/login");
		});

		// optional
		$scope.$on("adal:notAuthorized", function(event, rejection, forResource) {
			$scope.testMessage = "It is not Authorized for resource:" + forResource;
		});

		// $scope.checkDashboardDateAndFetchDashboardData();
		if ($scope.isDashboardPage || $scope.isReviewerPage || $scope.BU_LEADER) {
			//$scope.login();
			if ($rootScope.session.userModel.PPEDD && $rootScope.session.userModel.PPEDD.MetricsData) {
				//$scope.dashboardMetricsData = $rootScope.session.userModel.PPEDD.MetricsData;
			} else {
				// if($rootScope.windowsLoggedInUser == AppConstants.LOGGED_IN_USER )
				// {
				$scope.getDashboardMetricsData($scope.currentPGUI, 0);
				//}
			}
		}

		setTimeout(function() {
			$("html, body").animate({
				scrollTop: 0
			}, 0);
		}, 200);

		$scope.ytdProgress = function() {
			$(".ytd").toggle();
			$(".slider-ytd").toggle();
		};

		$scope.hidePeerAverage = function() {
			$(".peer-average").toggle();
			$(".slider-peer-average").toggle();
			$scope.showPeerAverage = !$scope.showPeerAverage;
		};

		$scope.hideSelfAssessment = function() {
			$(".self-assessment-arrow").toggle();
			$(".slider-self-assessment-arrow").toggle();
			$scope.showSelfAssessment = !$scope.showSelfAssessment;
		};

		$scope.finalSelfAssessment = function() {
			$(".final").toggle();
			$scope.showFinalAssessment = !$scope.showFinalAssessment;
		};

		$scope.onAccordionClick = function() {
			console.log("from directive, called click event after manipulate the DOM");
		};

		$scope.printDashboard = function() {

			window.print();

			// var getReportSuccess = function () {
			//     console.log("printDashboard web request succeeded!");
			//     $rootScope.showspinner = false;

			// };
			// var getError = function () {
			//     console.log("printDashboard web request failed!");
			//     $rootScope.showspinner = false;

			// };
			// $rootScope.showspinner = true;
			// var params = {};
			// //params.PartnerGUI = $rootScope.session.userModel.gui;
			// //params.GlobalUniqueIdentifier = $rootScope.session.userModel.gui;
			// params.ReportTypeID = 4;
			// Connection.GetReport(params, getReportSuccess, getError);
		};

		$scope.metricsData = {};
		$scope.addPlan = function(obj) {
			$scope.errorPlanMessage = false;
			$rootScope.overlay = true;
			$scope.IsAddPlanPopupVisible = true;
			$scope.metricsData = obj;

			if (obj.GlobalMarginPlanPctActual != null) {
				$scope.metricValue = parseInt(obj.GlobalMarginPlanPctActual);
			}
		}

		$scope.closePopup = function() {
			$rootScope.overlay = false;
			$scope.IsAddPlanPopupVisible = false;
		};

		$scope.errorPlanMessage = false;
		$scope.updatePlan = function() {
			$scope.errorPlanMessage = false;
			if (!($scope.isNumber($scope.metricValue) && $scope.metricValue > 0 && $scope.metricValue <= 100)) {
				//validate its a number
				$scope.errorPlanMessage = true;
				return false;
			}

			var getUpdatePlanSuccess = function() {
				$scope.closePopup();
				$scope.getDashboardMetricsData($scope.currentPGUI, 1);
				$scope.spinnerCounter--;
			};

			var getUpdatePlanError = function() {
				$scope.spinnerCounter--;
			};

			var params = {};
			params.PartnerGUI = $scope.currentPGUI;
			params.RoleType = $scope.metricsData.RoleType
			params.MetricType = "GlobalMarginPlanPct";
			params.MetricValue = $scope.metricValue;
			$scope.spinnerCounter++;
			Connection.updatePlan(params, getUpdatePlanSuccess, getUpdatePlanError);
		};

		$scope.isNumber = function(n) {
			if (!isNaN(parseFloat(n)) && isFinite(n)) {

				if (n % 1 === 0) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		// $scope.checkGlobalTER = function (metricsData) {
		//     if (metricsData.GlobalTERUSDGlobal == "" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst == "" || metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanAchievedPct == "" || metricsData.GlobalTERPlanAchievedPct == null) {
		//         return true;
		//     } else {
		//         return false;
		//     }
		// }

		$scope.checkGlobalSales = function(metricsData) {
			if (metricsData.GlobalSalesUSDConst === "" || metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesPlanUSDConst == null ||
				metricsData.GlobalSalesPlanUSDConst === "" || metricsData.GlobalSalesPlanAchievedPct === "" || metricsData.GlobalSalesPlanAchievedPct ==
				null) {
				return true;
			} else {
				return false;
			}
		}

		$scope.globalMarginPercentageBlock = function(metricsData) {
			if (metricsData.GlobalMarginPlanAchievedPct === "" || metricsData.GlobalMarginPlanAchievedPct == null || metricsData.GlobalMarginPct ===
				"" || metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPlanPct === "" || metricsData.GlobalMarginPlanPct == null) {
				return true;
			} else {
				return false;
			}
		};

		$scope.globalTERPercentageBlock = function(metricsData) {
			if (metricsData.GlobalTERPlanAchievedPct === "" || metricsData.GlobalTERPlanAchievedPct == null || metricsData.GlobalTERUSDGlobal ===
				"" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst === "" || metricsData.GlobalTERPlanUSDConst ==
				null) {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalMarginPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalMarginPlanPctActual == null || metricsData.GlobalMarginPlanPctActual === "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalTERPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanUSDConst === "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalSalesPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalSalesPlanUSDConst == null || metricsData.GlobalSalesPlanUSDConst === "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalPipelineHidden = function(metricsData) {
			if (metricsData.GlobalPipelineUSDConst == null || metricsData.GlobalPipelineUSDConst === "" || metricsData.GlobalPipelineUSDConst ==
				null || metricsData.GlobalPipelineUSDConst === "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalMarginPctHide = function(metricsData) {
			if (metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPct === "") {
				return true;
			} else {
				return false;
			}
		}

		$scope.isGlobalSalesUSDHide = function(metricsData) {
			if (metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesUSDConst === "") {
				return true;
			} else {
				return false;
			}
		}

	}
]);

angular.module('myApp.dashboard').filter('absNumberFormat', function() {
	return function(val) {
		return Math.abs(val).toLocaleString();
	}
});

angular.module('myApp.dashboard').filter('abs', function() {
	return function(val) {
		return Math.abs(val);
	}
});