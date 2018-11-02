'use strict';

/**
 * Created by Ravi Raman on 08/21/2017.
 */
angular.module('myApp.dashboard').controller('DashboardNonPPEDDDataSrCtrl', ["$rootScope", "$location", "AppCommon", "$scope", "Connection",
	"AppConstants", "dashboardSFService", "$filter", "UserModel", "$q",
	"sfDataService", "dashboardDataService", "AppMessages", "dashboardDataService1", "dashboardHeaderDataService",
	"adalAuthenticationService", "Util", "$window",
	function($rootScope, $location, AppCommon, $scope, Connection,
		AppConstants, dashboardSFService, $filter,
		UserModel, $q, sfDataService, dashboardDataService, AppMessages, dashboardDataService1, dashboardHeaderDataService, adalService, Util,
		$window) {

		$scope.onCycleChange = function() {
			//$scope.spinnerCounter=0;	
			//$scope.spinnerCounter++;	
			$scope.clearCounts();
			$scope.noData = false;
			$scope.getDashboardHeaderdetail(1);
			//if($rootScope.windowsLoggedInUser == AppConstants.LOGGED_IN_USER )
			//{
			$scope.dashboardTopEngagementHours($scope.currentPGUI, 0);
			//}
		};

		$scope.onYearChange = function() {
			//$scope.spinnerCounter=0;	
			//$scope.spinnerCounter++;	
			var cycleArr = AppConstants.GENERIC_CYCLE_DATES[$scope.selectedYear];
			var cycleDropDown = [];
			for (var i = 0; i < cycleArr.length; i++) {
				var obj = {};
				obj.cycleDate = cycleArr[i].cycleDate;
				obj.cycleDisplayName = cycleArr[i].cycleDisplayName;
				cycleDropDown.push(obj);
			}
			$scope.cycleList = cycleDropDown;
			$scope.selectedCycle = "0";

			$scope.noData = false;
			$scope.clearCounts();
			$scope.getDashboardHeaderdetail(1);
			//if($rootScope.windowsLoggedInUser == AppConstants.LOGGED_IN_USER )
			//{
			$scope.dashboardTopEngagementHours($scope.currentPGUI, 0);
			//}
		};

		//for hiding the Metrics section based on login BU
		/*  $scope.BU_LEADER = fbDataShareSvc.isPartnerBULeader;
		  fbDataShareSvc.isPartnerBULeader = null;*/

		$scope.currentPGUI = $rootScope.session.userModel.gui;
		$scope.rankDesc = $rootScope.session.userModel.rankDesc;
		dashboardSFService.dashBoardPGUI = null;
		dashboardSFService.dashBoardChannelType = null;
		dashboardSFService.dashboardSubChannelType = null;
		dashboardSFService.dashBoardDetail = {
			"RaterInfo": ""
		};

		$scope.topEngNoData = AppMessages.TOPENGHOURS_NODATA;
		//$rootScope.session.userModel.nonPPEDD = {"CategoryObjForRendering":""};

		$scope.spinnerCounter = 0;

		$scope.showPeerAverage = true;
		$scope.showSelfAssessment = true;

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

		$scope.getMax = function(arr, prop) {
			var max;
			for (var i = 0; i < arr.length; i++) {
				if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
					max = arr[i];
			}
			return max;
		};

		if ($rootScope.session.userModel.nonPPEDD) {
			$scope.yearDropDown = $rootScope.session.userModel.nonPPEDD.yearDropDown;
			$scope.selectedYear = $rootScope.session.userModel.nonPPEDD.selectedYear;
			$scope.cycleList = $rootScope.session.userModel.nonPPEDD.cycleList;
			$scope.selectedCycle = $rootScope.session.userModel.nonPPEDD.selectedCycle;

			if ($rootScope.session.userModel.nonPPEDD.TopEngHours) {
				var maxPpg = $scope.getMax($rootScope.session.userModel.nonPPEDD.TopEngHours, "ChargedHours");
				$scope.heighestValue = maxPpg.ChargedHours;

				$scope.engHours = $rootScope.session.userModel.nonPPEDD.TopEngHours;
			}
			//$scope.tempYearArray = $scope.yearDropDown;
		}

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

		$scope.getFeedbackCycle = function() {
			/*
    	cycle 1=10/1/2017-12/31/2017
		cycle=1/3/2018-3/31/2018
		cycle 3=4/2/2018-6/30/2018
       */

			var cycleArray = [];
			var obj = {};
			var currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			// $scope.cycleList = (){}($scope.selected);
			if (!$scope.selectedCycle) {
				//	$scope.selectedCycle = AppConstants.CYCLE_CONFIG[0].cycleDate;
				$scope.selectedCycle = "0";
			}
			//$scope.getDashboardHeaderdetail();
		};

		/* SF integration code starts here */
		//$scope.spinnerCounter++;	 

		$scope.clearCounts = function() {
			$scope.feedbackRequestedCount = 0;
			$scope.feedbackReceivedCount = 0;
			$scope.feedbackRequesterDeclinedCount = 0;
			$scope.feedbackProviderRequestedCount = 0;
			$scope.feedbackProviderCompletedCount = 0;
			$scope.feedbackProviderDeclinedCount = 0;
		};

		$scope.feedbackRequestedCount = 0;
		$scope.feedbackReceivedCount = 0;
		$scope.feedbackRequesterDeclinedCount = 0;
		$scope.feedbackProviderRequestedCount = 0;
		$scope.feedbackProviderCompletedCount = 0;
		$scope.feedbackProviderDeclinedCount = 0;

		$scope.getAsFeedbackRequested = function(response) {

			var feedbackRequestedCount = 0;
			var feedbackReceivedCount = 0;
			var feedbackRequesterDeclinedCount = 0;
			var feedbackProviderRequestedCount = 0;
			var feedbackProviderCompletedCount = 0;
			var feedbackProviderDeclinedCount = 0;

			var obj = {};
			if (response.length > 0) {
				obj = response[0].FormContents;
			} else {
				return false;
			}

			$.each($scope.raterInfo, function(key, value) {
				//feedbackRequestedCount++; 

				if (value.category.toLowerCase() != "self" && value.ParticipantRatingStatus.toLowerCase() == "completed") {
					feedbackReceivedCount++;
				}
				if (value.category.toLowerCase() != "self" && value.ParticipantRatingStatus.toLowerCase() == "declined") {
					feedbackRequesterDeclinedCount++;
				}
				if (value.category.toLowerCase() != "self") {
					feedbackRequestedCount++;
				}
			});

			// $.each(obj, function(key, value){    
			// 	feedbackRequestedCount++; 
			// 	if(value.FormContentStatus == 3) {
			// 		feedbackReceivedCount++;
			// 	} 
			// 	if(value.FormContentStatus == 8) {
			// 		feedbackRequesterDeclinedCount++;
			// 	} 
			//});	

			$scope.feedbackRequestedCount = feedbackRequestedCount;
			$scope.feedbackReceivedCount = feedbackReceivedCount;

			//check self assessment exists
			//$scope.isSelfAssessmentDone();
			//if($scope.isSelfFeedback == true && $scope.feedbackRequestedCount > 0){
			//	$scope.feedbackRequestedCount--;
			//}
			// 	if($scope.isSelfFeedback == true && $scope.feedbackReceivedCount > 0){
			// 	$scope.feedbackReceivedCount--;
			// }

			$scope.feedbackRequesterDeclinedCount = feedbackRequesterDeclinedCount;
			$scope.feedbackProviderRequestedCount = feedbackProviderRequestedCount;
			$scope.feedbackProviderCompletedCount = feedbackProviderCompletedCount;
			$scope.feedbackProviderDeclinedCount = feedbackProviderDeclinedCount;

		};
		$scope.isSelfAssessmentDone = function() {
			$scope.isSelfFeedback = false;
			$.each($scope.raterInfo, function(key, value) {
				if (value.category.toLowerCase() == "self") {
					$scope.isSelfFeedback = true;
				}
			});
		};

		$scope.gotoDetailPage = function(obj) {
			dashboardSFService.nonPPEDDdashBoardDetail = null;
			//dashboardSFService.nonPPEDDdashBoardDetail = {"Comments" : ""};
			//dashboardSFService.nonPPEDDdashBoardDetail = {"isDetailClicked" : null};
			setTimeout(function() {
				dashboardSFService.nonPPEDDdashBoardDetail = obj;
				dashboardSFService.nonPPEDDdashBoardDetail.RaterInfo = $scope.raterInfo;
				dashboardSFService.nonPPEDDdashBoardDetail.Comments = $scope.comments;

				//store it in session
				$rootScope.session.userModel.nonPPEDD.RaterInfo = $scope.raterInfo;
				$rootScope.session.userModel.nonPPEDD.comments = $scope.comments;
				//dashboardSFService.nonPPEDDdashBoardDetail = {"isDetailClicked" : true};

				$rootScope.session.userModel.nonPPEDD.yearDropDown = $scope.yearDropDown;
				$rootScope.session.userModel.nonPPEDD.selectedYear = $scope.selectedYear;
				$rootScope.session.userModel.nonPPEDD.cycleList = $scope.cycleList;
				$rootScope.session.userModel.nonPPEDD.selectedCycle = $scope.selectedCycle;
				//$rootScope.session.userModel.nonPPEDD.yearDropDown=$scope.tempYearArray;
				$scope.createComments();
				dashboardSFService.nonPPEDDdashBoardDetail.dashboardComments = $scope.dashboardComments;
				$scope.$apply();
			}, 60);
			$rootScope.backPage = "dashboard-non-ppedd-sr";
			$location.path("/comments");
			//$location.path("/comments");
		};

		$scope.createComments = function() {
			$scope.dashboardComments = [];
			var tmp = [];
			var obj = {
				"userName": "",
				"userId": "",
				"userPhoto": "",
				"weight": "",
				"comments": [],
				"projectName": "",
				"projectNameDir": "ltr",
				"JobTitle": ""
			};
			var tmpObj = {};
			$.each(dashboardSFService.nonPPEDDdashBoardDetail.RaterInfo, function(key, value) {
				if (value.ParticipantRatingStatus == "Completed") {
					tmpObj = angular.copy(obj);
					tmpObj.userId = value.ParticipantId;
					tmpObj.formContentId = value.formContentId;
					tmpObj.comments = [];
					$scope.getUserOtherInfo(value, tmpObj);
					$scope.getCommentsFromUser(tmpObj, value);
					if (tmpObj.comments && tmpObj.comments.length > 0) {
						tmp.push(tmpObj);
					}
				}
			});
			$scope.dashboardComments = tmp;
		};

		$scope.getUserOtherInfo = function(userObj, subvalue) {
			$.each(dashboardSFService.nonPPEDDdashBoardDetail.RaterInfo, function(key, value) {
				if (userObj.ParticipantId == value.ParticipantId && userObj.formContentId == value.formContentId) {
					subvalue.userName = value.ParticipantName;
					subvalue.weight = value.Weight;
					subvalue.projectName = value.projectName;

					if (subvalue.projectName) {
						var ltr = Util.commentDirection(value.projectName);
						subvalue.projectNameDir = ltr;
					}

					subvalue.userPhoto = value.photo;
					if (AppConstants.JAVA_LAYER_ENABLED) {
						subvalue.FeedbackSubmittedDate = Util.dateConverter(value.lastModifiedDate);
					} else {
						subvalue.FeedbackSubmittedDate = value.lastModifiedDate;
					}
					subvalue.JobTitle = value.JobTitle;
				}
			});
		};

		$scope.getCommentsFromUser = function(tmpObj, userObj) {
			$.each(dashboardSFService.nonPPEDDdashBoardDetail.Comments, function(key, value) {
				if (userObj.ParticipantId == value.userId && userObj.formContentId == value.formContentId && !($rootScope.session.userModel.gui ==
						userObj.ParticipantId && value.CategoryName == "Recommendation")) {

					var ltr = Util.commentDirection(value.comment);

					tmpObj.comments.push({
						"commentName": value.CategoryName,
						"comments_items": value.comment,
						"dir": ltr
					});

				}
			});
		};

		$scope.getDashboardHeaderdetail = function(change) {
			$scope.noData = false;
			var selectedCycle = $scope.selectedCycle;
			var selectedYear = $scope.selectedYear;
			var startDate;
			var endDate;

			$scope.startDateForPeer = "";
			$scope.endDateForPeer = "";
			/*	cycle 1=10/1/2017-12/31/2017
		cycle=1/3/2018-3/31/2018
		cycle 3=4/2/2018-6/30/2018*/
			if (selectedCycle != "0") {
				var currentFullYearSelected = "";
				currentFullYearSelected = $scope.selectedYear.slice(-2);
				currentFullYearSelected = AppConstants.YEAR_HEAD + currentFullYearSelected;
				var selectedYearKey = $scope.selectedYear;
				if (selectedYearKey === "FY18") {
					selectedCycle = (parseInt(selectedCycle) - 1).toString();
					$scope.startDateForPeer = AppConstants.GENERIC_CYCLE_DATES[selectedYearKey][parseInt(selectedCycle)].startDate;
					$scope.endDateForPeer = AppConstants.GENERIC_CYCLE_DATES[selectedYearKey][parseInt(selectedCycle)].endDate;
					startDate = $scope.startDateForPeer;
					endDate = $scope.endDateForPeer;
				} else {
					$scope.startDateForPeer = AppConstants.GENERIC_CYCLE_DATES[selectedYearKey][parseInt(selectedCycle)].startDate;
					$scope.endDateForPeer = AppConstants.GENERIC_CYCLE_DATES[selectedYearKey][parseInt(selectedCycle)].endDate;
					startDate = $scope.startDateForPeer;
					endDate = $scope.endDateForPeer;
				}
			}

			if ($rootScope.session.userModel.nonPPEDD && change == 0) {
				$scope.spinnerCounter++;
				$scope.dashboardData = {
					"Categories": ""
				};
				$scope.dashboardData.Categories = $rootScope.session.userModel.nonPPEDD.CategoryObjForRendering;
				$scope.raterInfo = $rootScope.session.userModel.nonPPEDD.RaterInfo;
				$scope.comments = $rootScope.session.userModel.nonPPEDD.comments;
				$scope.getAsFeedbackRequested($rootScope.session.userModel.nonPPEDD.ServiceResponse);

				$scope.spinnerCounter--;

				if ($rootScope.session.userModel.nonPPEDD.noDataMessage) {
					$scope.noData = $rootScope.session.userModel.nonPPEDD.noDataMessage;
				}

				return false;
			} else {
				//declaration
				$rootScope.session.userModel.nonPPEDD = {
					"ServiceResponse": ""
				};
			}

			$scope.spinnerCounter++;

			//code change based on new query
			function getDashboardData(formHeaderResponse) {
				//TODO need to check why it's fail here
				//dashboardDataService.getDashboardData(AppConstants.LOGGED_IN_USER,startDate,endDate,selectedYear).then(function(response)
				dashboardDataService1.getDashboardData(formHeaderResponse).then(function(response) {
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

						$scope.raterInfo = [];
						//$scope.raterInfo = response[0].raterInfo;
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

						$rootScope.session.userModel.nonPPEDD.ServiceResponse = response;

						$scope.getAsFeedbackRequested(response);
					} else {
						$scope.noData = AppMessages.DASHBOARD_MESSAGES.ERROR.NO_RESULTS_FROM_FORM_FIRST_PART + " " + $rootScope.session.userModel.displayName +
							". " + AppMessages.DASHBOARD_MESSAGES.ERROR.NO_RESULTS_FROM_FORM_SECOND_PART;
						$rootScope.session.userModel.nonPPEDD.noDataMessage = $scope.noData;
						$scope.dashboardData = {
							"Categories": ""
						};
						$scope.dashboardData.Categories = [];
						$scope.raterInfo = [];
						$scope.comments = [];
						$scope.userPhotos = [];
						$rootScope.session.userModel.nonPPEDD.CategoryObjForRendering = [];
						$scope.feedbackRequestedCount = 0;
						$scope.feedbackReceivedCount = 0;
						$scope.feedbackRequesterDeclinedCount = 0;
						$scope.feedbackProviderRequestedCount = 0;
						$scope.feedbackProviderCompletedCount = 0;
						$scope.feedbackProviderDeclinedCount = 0;
						$scope.getPeerAverageWhenFeedbackEmpty();
						$scope.spinnerCounter--;
						return;
					}

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
						"formContentId": "",
						"formDataId": "",
						"SortOrder": "",
						"FbGoals": [],
						"Comments": [],
						"enablegreyshade": false,
						"isQuality": false,
						"raterInfo": []
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
					$scope.comments = [];
					$.each(dashboardData, function(key, value) {
						$.each(value.categories, function(subkey, subvalue) {
							if (subvalue.isCateogry == true) {

								$.each(subvalue.comments, function(key, value) {
									value.CategoryName = subvalue.categoryName;
									$scope.comments.push(value);
								});

								$.each(subvalue.subCateogry, function(subcatkey, subcatvalue) {
									//tmpCategorySubGoals = angular.copy(FbGoals);
									tmpCategory = angular.copy(GoalsCategory);
									tmpCategory.CategoryID = subcatvalue.subCategoryId;
									tmpCategory.CategoryName = subcatvalue.subCategoryName;

									if (subcatvalue.subCategoryYTD != "") {
										tmpCategory.YTDProgress = ((subcatvalue.subCategoryYTD / subcatvalue.subCategoryYTDCount) / 7) * 360;
									}

									if (subcatvalue.subCategoryRating != "") {
										tmpCategory.SelfAssesment = ((subcatvalue.subCategoryRating / subcatvalue.subCategoryRatingCount) / 7) * 360;
									}

									if (tmpCategory.CategoryName.indexOf("Quality") > -1) {
										//tmpCategory.CategoryName = "Quality, risk management & technical excellence leadership";
										if ($scope.selectedYear === "FY18") {
											tmpCategory.CategoryName = "Quality, risk management & technical excellence leadership";
										} else {
											tmpCategory.CategoryName = "Quality, risk management & technical excellence";
										}
										tmpCategory.SortOrder = 0;
									} else if (tmpCategory.CategoryName.indexOf("Client leadership") > -1) {
										tmpCategory.SortOrder = 1;
									} else if (tmpCategory.CategoryName.indexOf("Team leadership") > -1) {
										tmpCategory.SortOrder = 2;
									} else if (tmpCategory.CategoryName.indexOf("Personal leadership") > -1) {
										tmpCategory.SortOrder = 4;
									} else if (tmpCategory.CategoryName.indexOf("Business leadership") > -1) {
										tmpCategory.SortOrder = 3;
									} else if (tmpCategory.CategoryName.toLowerCase().indexOf("engagement/project") > -1) {
										tmpCategory.CategoryName = "Engagement/project metrics";
										tmpCategory.SortOrder = 5;
									} else if (tmpCategory.CategoryName.indexOf("Recommendation") > -1) {
										tmpCategory.SortOrder = 6;
										tmpCategory.CategoryName = tmpCategory.CategoryName.replace("(not applicable for self-assessment)", "");
									}

									if (tmpCategory.CategoryName != "Project / Engagement Name (not applicable for self-assessment)") {
										tmpCategoryArray.push(tmpCategory);
									}
								});

							}
						});

					});

					obj = tmpCategoryArray;
					var temp = {};
					//Add Quality static hardcoded values
					// if(!$scope.isQANDERMExist){
					// 		temp  = angular.copy(GoalsCategory);
					// 	temp.CategoryName = "Quality and effective risk management";
					// 	temp.CategoryID   = 99999;
					// 	temp.SortOrder = 0;
					// 	temp.isQuality = true;
					// 	temp.enablegreyshade = true;
					// 	obj.push(temp);
					// }
					//Add Quality static hardcoded values

					$scope.isYTDButtonVisible = false;
					$scope.isSelfAssessmentButtonVisible = false;
					$scope.isPeerAverageButtonVisible = false;

					for (var i = 0; i < obj.length; i++) {
						goals = obj[i].FbGoals;
						obj[i].YTDProgress = obj[i].YTDProgress != "" ? obj[i].YTDProgress - 90 : "";
						obj[i].PeerAverage = obj[i].PeerAverage != "" ? obj[i].PeerAverage - 90 : "";
						obj[i].SelfAssesment = obj[i].SelfAssesment != "" ? obj[i].SelfAssesment - 90 : "";

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
									"value": value.SelfAssessment,
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

					$scope.getPhotosOfCompletedUser().then(function(res) {
						$scope.getPeerAverage(obj);
						$scope.spinnerCounter--;
					}).catch(function(err) {
						$scope.noData = Util.showErrorMessage(err);
						$rootScope.session.userModel.nonPPEDD.noDataMessage = $scope.noData;
						$scope.clearDashboardData();
						$scope.spinnerCounter--;
					});

					/*	if($scope.dashboardData==undefined && obj.length>0){
            			$scope.dashboardData = {"Categories":""};
						$scope.dashboardData.Categories =obj;
						$rootScope.session.userModel.nonPPEDD.CategoryObjForRendering = obj;
						$scope.spinnerCounter--;
            	}*/

				}).catch(function(err) {
					$scope.noData = Util.showErrorMessage(err);
					$rootScope.session.userModel.nonPPEDD.noDataMessage = $scope.noData;
					$scope.clearDashboardData();
					$scope.spinnerCounter--;
				});
			}

			$scope.startDate = startDate;
			$scope.endDate = endDate;

			dashboardHeaderDataService.getDashboardHeaderData(AppConstants.LOGGED_IN_USER, startDate, endDate, selectedYear).then(function(
				response) {
				getDashboardData(response);
			}).catch(function(err) {
				$scope.noData = Util.showErrorMessage(err);
				$rootScope.session.userModel.nonPPEDD.noDataMessage = $scope.noData;
				$scope.clearDashboardData();

				$scope.spinnerCounter--;
			});

			$scope.clearDashboardData = function() {
				$scope.dashboardData = {
					"Categories": ""
				};
				$scope.getPeerAverageWhenFeedbackEmpty();
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
						$rootScope.session.userModel.nonPPEDD.noDataMessage = $scope.noData;
						$scope.clearDashboardData();
						$scope.spinnerCounter--;
					});
				} else {
					deferred.resolve();
				}

				return deferred.promise;
			};

			$scope.renderDash = function(obj) {
				$scope.dashboardData = {
					"Categories": ""
				};
				$scope.dashboardData.Categories = obj;
				$rootScope.session.userModel.nonPPEDD.CategoryObjForRendering = obj;
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

		};

		$scope.getYearData = function() {

			if ($rootScope.session.userModel.nonPPEDD) {
				$scope.yearDropDown = $rootScope.session.userModel.nonPPEDD.yearDropDown;
				$scope.selectedYear = $rootScope.session.userModel.nonPPEDD.selectedYear;
				$scope.cycleList = $rootScope.session.userModel.nonPPEDD.cycleList;
				$scope.selectedCycle = $rootScope.session.userModel.nonPPEDD.selectedCycle;
			} else {
				$scope.selectedYear = AppConstants.SELECTED_YEAR;
				$scope.selectedCycle = "0";
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
				var cycleArr = AppConstants.GENERIC_CYCLE_DATES[AppConstants.SELECTED_YEAR];
				var cycleDropDown = [];
				for (var i = 0; i < cycleArr.length; i++) {
					var obj = {};
					obj.cycleDate = cycleArr[i].cycleDate;
					obj.cycleDisplayName = cycleArr[i].cycleDisplayName;
					cycleDropDown.push(obj);
				}
				$scope.cycleList = cycleDropDown;
			}
			$scope.getDashboardHeaderdetail(0);
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
		$scope.getFeedbackCycle();

		dashboardSFService.showDashboard = true;
		dashboardSFService.showDashboardDetails = false;

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
			if ($rootScope.windowsLoggedInUser == AppConstants.LOGGED_IN_USER) {
				$scope.dashboardTopEngagementHours($scope.currentPGUI, 0);
			}
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

		$scope.engHours = [];

		$scope.dashboardTopEngagementHours = function(pgui, pageUpdate) {

			$scope.isNoDataMessageVisible = true;

			var getDashboardTopEngagementHoursDataSuccess = function(response) {
				$rootScope.session.userModel.nonPPEDD.TopEngHours = [];
				$scope.engHours = [];
				$rootScope.session.userModel.nonPPEDD.TopEngHours = response;

				var maxPpg = $scope.getMax(response, "ChargedHours");
				$scope.heighestValue = maxPpg.ChargedHours;

				$.each($rootScope.session.userModel.nonPPEDD.TopEngHours, function(key, val) {
					val.progressWidth = ((val.ChargedHours / $scope.heighestValue) * 100) + "%";
				});

				$scope.engHours = $rootScope.session.userModel.nonPPEDD.TopEngHours;
				$scope.spinnerCounter--;
				$scope.$apply();
			};

			var getDashboardTopEngagementHoursDataError = function(response) {
				//$rootScope.showspinner = false;
				$scope.spinnerCounter--;
				$scope.isNoDataMessageVisible = true;
				$scope.engHours = [];
				// if(response===404){
				// 	$scope.topEngNoData = AppMessages.COMING_SOON;
				// }

				if (response && response === "counselee_view") {
					$scope.topEngNoData = AppMessages.TOPENGHOURS_NODATA;
				} else {
					$scope.$apply();
				}
				// if(response == "404")
				// {
				// 	$scope.engHours = [];
				// }

			};

			//$rootScope.showspinner = true;

			var params = {};
			//params.PartnerGui = "10002151";
			params.PartnerGui = $scope.currentPGUI;
			$scope.spinnerCounter++;
			dashboardSFService.dashboardTopEngagementHours(params, getDashboardTopEngagementHoursDataSuccess,
				getDashboardTopEngagementHoursDataError, $scope.selectedYear, $scope.selectedCycle);

		};

		// $scope.checkDashboardDateAndFetchDashboardData();

		if ($scope.isDashboardPage || $scope.isReviewerPage || $scope.BU_LEADER) {
			//$scope.login();
			if ($rootScope.session.userModel.nonPPEDD && $rootScope.session.userModel.nonPPEDD.TopEngHours) {
				var maxPpg = $scope.getMax($rootScope.session.userModel.nonPPEDD.TopEngHours, "ChargedHours");
				$scope.heighestValue = maxPpg.ChargedHours;
				$scope.engHours = $rootScope.session.userModel.nonPPEDD.TopEngHours;
			} else {
				//if($rootScope.windowsLoggedInUser == AppConstants.LOGGED_IN_USER )
				//{
				$scope.dashboardTopEngagementHours($scope.currentPGUI, 0);
				//}
			}
		}

		$scope.gotoCommentsPage = function() {
			$rootScope.backPage = "dashboard-non-ppedd-sr";
			$location.path("/comments");
		};

		$scope.redirectToQRM = function() {
			//$window.open(AppConstants.QRM_LINK+"?filter=Employee/GUI eq '"+$rootScope.session.userModel.gui+"'");
			var str = AppConstants.QRM_LINK;
			var res = str.replace("REPLACEGUI", $rootScope.session.userModel.gui);
			res = encodeURI(res);
			console.log("QERM URL - " + res);
			$window.open(res);
		};

		$scope.getPeerAverageWhenFeedbackEmpty = function() {
			var getPeerAverageDataSuccess = function(response) {
				$scope.spinnerCounter--;
				if (!($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup)) {
					$scope.$apply();
				}
				$rootScope.session.userModel.nonPPEDDpeerGroup = response;
				$rootScope.session.userModel.nonPPEDDpeerGroupResponseError = undefined;
			};
			var getPeerAverageDataError = function(response) {
				$scope.spinnerCounter--;
				$rootScope.session.userModel.nonPPEDDpeerGroupResponseError = response;
				$scope.$apply();
			};
			$scope.spinnerCounter++;
			//	if ($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup) {
			//		getPeerAverageDataSuccess($rootScope.session.userModel.nonPPEDDpeerGroup);
			//	} else {
			dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
			//	}
		};

		$scope.getPeerAverage = function(obj) {
			var getPeerAverageDataSuccess = function(response) {
				$scope.spinnerCounter--;
				$scope.appendPeerAverage(obj, response);
				$scope.renderDash(obj);
				if (!($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup)) {
					$scope.$apply();
				}
				$rootScope.session.userModel.nonPPEDDpeerGroup = response;
				$rootScope.session.userModel.nonPPEDDpeerGroup.FY = $scope.selectedYear;
				$rootScope.session.userModel.nonPPEDDpeerGroupResponseError = undefined;
			};
			var getPeerAverageDataSuccessSession = function(response) {
				$scope.spinnerCounter--;
				$rootScope.session.userModel.nonPPEDDpeerGroupResponseError = undefined;
				$rootScope.session.userModel.nonPPEDDpeerGroup.FY = $scope.selectedYear;
				$rootScope.session.userModel.nonPPEDDpeerGroup = response;
				$scope.appendPeerAverage(obj, response);
				$scope.renderDash(obj);
			};
			var getPeerAverageDataError = function(response) {
				$scope.spinnerCounter--;
				$rootScope.session.userModel.nonPPEDDpeerGroupResponseError = response;
				$scope.renderDash(obj);
				$scope.$apply();
			};
			$scope.spinnerCounter++;

			if ($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup) {
				/*
					Calling of Peer Average Service on Year change fixed - 16/08/2018
				*/
				if ($rootScope.session.userModel.nonPPEDDpeerGroup.FY === $scope.selectedYear) {
					getPeerAverageDataSuccessSession($rootScope.session.userModel.nonPPEDDpeerGroup);
				} else {
					dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
				}
			} else {
				dashboardSFService.getPeerAverage(getPeerAverageDataSuccess, getPeerAverageDataError, $scope.selectedYear, $scope.currentPGUI);
			}
		};

		$scope.appendPeerAverage = function(obj, peerArray) {
			$.each(obj, function(key, val) {
				val.PeerAverage = $scope.getPeerValue(val.CategoryName, peerArray, key);
			});
		};

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
				if (value.CategoryName.trim() === peerCode.trim()) {
					res = value.Value;

					if (parseInt(res) === 0) {
						res = "";
					}

				}
			});
			return res;
		}

		$scope.getPeerIndex = function(peerArray) {
			var res = "";

			var resPeerStartDate = [];
			var resPeerEndDate = [];

			var selectedStartDate = [];
			var selectedEndDate = [];

			if ($scope.endDateForPeer == "" && $scope.startDateForPeer == "") {
				$(peerArray).each(function(key, val) {
					if (val.Cyclestart === val.CycleEnd) {
						res = key;
					}
				});
			} else {
				$(peerArray).each(function(key, val) {

					resPeerStartDate = val.Cyclestart.split("T");
					resPeerEndDate = val.CycleEnd.split("T");
					selectedStartDate = $scope.startDateForPeer.split("T");
					selectedEndDate = $scope.endDateForPeer.split("T");

					if ((resPeerStartDate[0] === selectedStartDate[0]) && (resPeerEndDate[0] === selectedEndDate[0])) {
						res = key;
					}

				});
			}

			return res;
		};

		$scope.getPeerValue = function(name, peerArray, key) {
			//console.log($scope.selectedCycle);
			console.log($scope.startDateForPeer);
			console.log($scope.endDateForPeer);

			var index = $scope.selectedCycle;
			if (parseInt(index) === 0) {
				index = peerArray.length - 1;
			} else {
				index = $scope.getPeerIndex(peerArray);
			}

			var resPeerCode = "";
			var val = "";
			if (peerArray && peerArray.length > 0 && peerArray[index]) {
				resPeerCode = getCategoryCodeFromPeerServiceMapping(name);
				val = getPeerValueFromArray(peerArray[index].CycleData, resPeerCode);
				//val = peerArray[$scope.selectedCycle].CycleData[key].Value;

				if (val === "") {
					return "";
				}

				val = (val / AppConstants.DIVIDENT_SEVEN) * 360;
				return val !== "" ? val - 90 : "";

			} else {
				return "";
			}
		};

		$scope.gotoDefinitionsPage = function() {
			$rootScope.session.userModel.nonPPEDD.yearDropDown = $scope.yearDropDown;
			$rootScope.session.userModel.nonPPEDD.selectedYear = $scope.selectedYear;
			$rootScope.session.userModel.nonPPEDD.cycleList = $scope.cycleList;
			$rootScope.session.userModel.nonPPEDD.selectedCycle = $scope.selectedCycle;

			$rootScope.session.userModel.nonPPEDD.RaterInfo = $scope.raterInfo;
			$rootScope.session.userModel.nonPPEDD.comments = $scope.comments;

			if ($rootScope.session.userModel.region && $rootScope.session.userModel.region != null && $rootScope.session.userModel.region.toLowerCase()
				.indexOf("gsa") > -1) {
				$rootScope.isGSAForm = true;
			} else {
				$rootScope.isNonGSAForm = true;
			}

			// if($rootScope.session.userModel.nonPPEDD.ServiceResponse.length >0){

			// 	if($rootScope.session.userModel.nonPPEDD.ServiceResponse[0].formTitle.toLowerCase().indexOf("gsa") > -1){
			// 		$rootScope.isGSAForm = true;
			// 	}else{
			// 		$rootScope.isNonGSAForm = true;
			// 	}

			// }else {
			// 	$rootScope.isNonGSAForm = true;
			// }

			//set Peer Group index
			if ($rootScope.session.userModel && $rootScope.session.userModel.nonPPEDDpeerGroup) {
				$rootScope.session.userModel.nonPEERindex = $scope.getPeerIndex($rootScope.session.userModel.nonPPEDDpeerGroup);
			} else {
				$rootScope.session.userModel.nonPEERindex = "";
			}

			$rootScope.backPage = "dashboard-non-ppedd-sr";
			$location.path("/definitions");
		};

		$scope.getTodayUTCDate = function() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth(); //January is 0!
			var yyyy = today.getFullYear();
			var TodayDate = "";
			TodayDate = new Date(Date.UTC(yyyy, mm, dd, 0, 0, 0));
			return TodayDate;
		};

		// $scope.checkDashboardDateAndFetchDashboardData = function () {
		//     var onGetPerformanceYearSuccess = function (data) {
		//         $scope.dashboardStartdate = data.dashBoardStartDate == '' || data.dashBoardStartDate == undefined ? null : new Date(data.dashBoardStartDate);
		//         $scope.dashboardEnddate = data.dashBoardEndDate == '' || data.dashBoardEndDate == undefined ? null : new Date(data.dashBoardEndDate);
		//         //if ($scope.getTodayUTCDate() >= $scope.dashboardStartdate && $scope.getTodayUTCDate()<=$scope.dashboardEnddate) {
		//         if ($scope.getTodayUTCDate() >= $scope.dashboardEnddate) {
		//             $scope.getDashboardData(false);
		//         } else {
		//             $scope.getDashboardData(true);
		//         }
		//         $scope.spinnerCounter--;
		//     }
		//     $scope.spinnerCounter++;
		//     Connection.getPerformanceYear(onGetPerformanceYearSuccess);
		// };

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

		$scope.onAccordionClick = function() {
			console.log("from directive, called click event after manipulate the DOM");
		};

		$scope.printDashboard = function() {
			dashboardSFService.nonPPEDDdashBoardDetail = {};
			dashboardSFService.nonPPEDDdashBoardDetail.RaterInfo = $scope.raterInfo;
			dashboardSFService.nonPPEDDdashBoardDetail.Comments = $scope.comments;
			$scope.createComments();

			setTimeout(function() {
				window.print();
			}, 600);

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
		};

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
			params.RoleType = $scope.metricsData.RoleType;
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
		};

		$scope.checkGlobalTER = function(metricsData) {
			if (metricsData.GlobalTERUSDGlobal == "" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst == "" ||
				metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanAchievedPct == "" || metricsData.GlobalTERPlanAchievedPct ==
				null) {
				return true;
			} else {
				return false;
			}
		};

		$scope.checkGlobalSales = function(metricsData) {
			if (metricsData.GlobalSalesUSDConst == "" || metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesPlanUSDConst == null ||
				metricsData.GlobalSalesPlanUSDConst == "" || metricsData.GlobalSalesPlanAchievedPct == "" || metricsData.GlobalSalesPlanAchievedPct ==
				null) {
				return true;
			} else {
				return false;
			}
		};

		$scope.globalMarginPercentageBlock = function(metricsData) {
			if (metricsData.GlobalMarginPlanAchievedPct == "" || metricsData.GlobalMarginPlanAchievedPct == null || metricsData.GlobalMarginPct ==
				"" || metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPlanPct == "" || metricsData.GlobalMarginPlanPct == null) {
				return true;
			} else {
				return false;
			}
		};

		$scope.globalTERPercentageBlock = function(metricsData) {
			if (metricsData.GlobalTERPlanAchievedPct == "" || metricsData.GlobalTERPlanAchievedPct == null || metricsData.GlobalTERUSDGlobal ==
				"" || metricsData.GlobalTERUSDGlobal == null || metricsData.GlobalTERPlanUSDConst == "" || metricsData.GlobalTERPlanUSDConst == null
			) {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalMarginPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalMarginPlanPctActual == null || metricsData.GlobalMarginPlanPctActual == "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalTERPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalTERPlanUSDConst == null || metricsData.GlobalTERPlanUSDConst == "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalSalesPlanPctHidden = function(metricsData) {
			if (metricsData.GlobalSalesPlanUSDConst == null || metricsData.GlobalSalesPlanUSDConst == "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalPipelineHidden = function(metricsData) {
			if (metricsData.GlobalPipelineUSDConst == null || metricsData.GlobalPipelineUSDConst == "" || metricsData.GlobalPipelineUSDConst ==
				null || metricsData.GlobalPipelineUSDConst == "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalMarginPctHide = function(metricsData) {
			if (metricsData.GlobalMarginPct == null || metricsData.GlobalMarginPct == "") {
				return true;
			} else {
				return false;
			}
		};

		$scope.isGlobalSalesUSDHide = function(metricsData) {
			if (metricsData.GlobalSalesUSDConst == null || metricsData.GlobalSalesUSDConst == "") {
				return true;
			} else {
				return false;
			}
		};

		// $scope.$watch(function () {

		//     	return $scope.spinnerCounter;

		// },
		// function (newVal, oldVal) {
		// 	console.log("new val" + newVal);
		// 	console.log("old val" + oldVal);
		// }, true);

	}
]);

angular.module('myApp.dashboard').filter('absNumberFormat', function() {
	return function(val) {
		return Math.abs(val).toLocaleString();
	};
});

angular.module('myApp.dashboard').filter('abs', function() {
	return function(val) {
		return Math.abs(val);
	}
});