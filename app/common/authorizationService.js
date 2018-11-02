'use strict'

/**
 * Created by Ravi Raman on 08/21/2017.
 */

myApp.factory('authorizationService', ["$http", "$resource", "$q", "$rootScope", "$location", "AppConstants", "Session", "UserModel", "AppMessages", "$timeout","Connection", "sfDataService", "$routeParams","$crypto", "adalAuthenticationService", function ($http, $resource, $q, $rootScope, $location, AppConstants, Session, UserModel, AppMessages, $timeout, Connection, sfDataService, $routeParams, $crypto, adalService) {
    $rootScope.showspinner = true;

    return {

        // We would cache the permission for the session,
        //to avoid roundtrip to server
        //for subsequent requests

        permissionModel: {
            permission: {},
            isPermissionLoaded: false
        },
        permissionCheck: function (route) {
            // we will return a promise .
            var deferred = $q.defer();
            var promiseArray = [];
        	
        	if(route.current.params.userId){
        		sessionStorage.setItem('counseleeId', route.current.params.userId);
        	}
            
            if((!sessionStorage.getItem('id_token') || sessionStorage.getItem('id_token') == "") && AppConstants.AZURE_CODE_ENABLE == true){
            	adalService.login();
            	return false;
            }
            
            // if(route.current.params.userId){
            // 	$rootScope.showspinner = true;
            // 	AppConstants.LOGGED_IN_USER = route.current.params.userId;
            // }
            
             var getLoggedInuserInfo = function(){
             	$rootScope.showspinner = true;
             	var deferred = $q.defer(); 
             	
               	var userData ={
             		"userId":"",
					"GUI":"", 
					"isCounsellor":"",
					"displayName" :""
             	};
             
            	var url_encode = "";
             
            	if(sessionStorage.getItem('counseleeId') && sessionStorage.getItem('counseleeId')!=""){
            		$rootScope.showspinner = true;
            		url_encode = sessionStorage.getItem('counseleeId').replace(/slash/g, '/');
            		url_encode = url_encode.replace(/ /g, '+');
            		AppConstants.LOGGED_IN_USER = $crypto.decrypt(url_encode);
            		userData.userId = AppConstants.LOGGED_IN_USER;
            		sessionStorage.setItem('counseleeId', '');
            		
            		//get windows logged in user
            		var oJsonModel = userApiModel; 
	             	oJsonModel.attachRequestCompleted(function() {
					var data = oJsonModel.getData();
						$rootScope.windowsLoggedInUser = data.name; 
	             		deferred.resolve(userData);
							//counselee check when accessing from counselee search page
							// sfDataService.getCounselees($rootScope.windowsLoggedInUser).then(function(counseleeData){
												
							// 		var counseleeExist = 0; 
									
							// 		$(counseleeData.results).each(function(key,value){
							// 			if(value.userId == userData.userId){
							// 				deferred.resolve(userData);
							// 				counseleeExist = 1;
							// 			}
							// 		});
									
							// 		if(counseleeExist == 0) {
    			// 						$rootScope.showspinner = false;
							// 			$rootScope.showUserError = true;
							// 			$rootScope.showView = true;
							// 			$location.path("usererror");
							// 			$rootScope.dataTest = "Not accessible";
							//     		deferred.reject("Not accessible");
							// 		}
            									
							// }).catch(function(err){
							// 		$rootScope.showspinner = false;
							// 		$rootScope.showUserError = true;
							// 		$rootScope.showView = true;
							// 		$location.path("usererror");
							// 		$rootScope.dataTest = "User Info not found";
						 //   		deferred.reject(err);
							// });
							//counselee check when accessing from counselee search page
						
					});
             		
            	}else{
	             	var oJsonModel = userApiModel; 
	             	oJsonModel.attachRequestCompleted(function() {
					var data = oJsonModel.getData();
						console.log(data);
						userData.userId = data.name;
						
						
						if(route.current.params.userId){
							url_encode = route.current.params.userId.replace(/slash/g, '/');
            				url_encode = url_encode.replace(/ /g, '+');
            				AppConstants.LOGGED_IN_USER = $crypto.decrypt(url_encode);
						}else{
						    //AppConstants.LOGGED_IN_USER = "16090247";
							AppConstants.LOGGED_IN_USER = userData.userId;
							$rootScope.windowsLoggedInUser = userData.userId;
						}
						
	             		userData.GUI = data.gui; 
	             		userData.isCounsellor = false;
	             		userData.displayName = data.displayName;
						deferred.resolve(userData);
					});
            	}
             	
             	
             	// console.log(oJsonModel.oData.oData.email);
             	// if(userData.GUI!=null && userData.GUI!=""){
             	// 	deferred.resolve(userData);
             	// } 
             	 return deferred.promise;
             };
			
            var getSFUserData = function(){
                    var deferred = $q.defer(); 
                         var oJsonModel = new sap.ui.model.json.JSONModel();
                          	var url = "/User('"+AppConstants.LOGGED_IN_USER+"')?$format=json&$expand=manager,customManager&$select=userId,defaultFullName,custom08,custom04,custom05,location,custom06,custom15,manager/firstName,manager/lastName,customManager/firstName,customManager/lastName";
                        	
                        	if(AppConstants.JAVA_LAYER_ENABLED){
                        		url = url.replace(AppConstants.LOGGED_IN_USER, "<<subjectId>>");
		                    	$http({
								        url: AppConstants.JAVA_SERVICE_CALL,
								        method: "POST",
								        data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : sfDataService.getCounseleeID() }
								    }).then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    						deferred.reject(error);  
								});
                        	}	
                            else{
	                             oModel.read(url,{
	                               filters: [],
	                               success:   function(odata){ 
	                                    deferred.resolve(odata);
	                               },error: function(response){
	                               		var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	deferred.reject(obj);  
	                               }
	                        	});
                            }
                        return deferred.promise;
             }
             
             var getUserData = function(userId){
                    var deferred = $q.defer(); 
                        
                         //var oJsonModel = new sap.ui.model.json.JSONModel();
                        
                         //   //oModel.read("/User('1133940')?$format=json&$select=userId,defaultFullName,custom08,custom04,custom05,location,custom06,hireDate",{
                         //   oModel.read("/getUserRolesByUserId?userId='"+ AppConstants.LOGGED_IN_USER +"'&$format=json",{
                         //      filters: [],
                         //      success:   function(odata){ 
                               	    var user ={
                               	    	"userData":"",
                               	    	"userRole":"",
                               	    	"userImage":""
                               	    }
                               		getSFUserData().then(function(userData){
                               			//user.userRole = odata;
                               			user.userData = userData;
                               			
										sfDataService.getUserPhoto(AppConstants.LOGGED_IN_USER).then(function(imageResponse){
											if(imageResponse!=typeof(undefined) && imageResponse.results.length>0){
												user.userImage = imageResponse.results[0].photo;
												
												// $.each(imageResponse.results, function(key,value){
												// 	user.userImage = value.photo;
												// });
												
												deferred.resolve(user);  
											}	
										});  
                               		}).catch(function(err){
											$rootScope.showspinner = false;
											$rootScope.showUserError = true;
											$rootScope.showView = true;
											$rootScope.dataTest = "User Info not found";
											$location.path("usererror");
											
								    		deferred.reject(err);
	    							});
                               //},error: function(response){
                               //		deferred.reject(response);  
                               //}
                       // });
                        return deferred.promise;
             }
             
            //this is just to keep a pointer to parent scope from within promise scope.
            var parentPointer = this;

            var authenticateUserAndGetRoles = function(loggedInUserInfo) {
				 
				 getUserData(AppConstants.LOGGED_IN_USER).then(function(roleResponse){
                 
	                
	                        
                            //UserModel.gpn = "IT010070515";
                            UserModel.gui = roleResponse.userData.userId;
                            //UserModel.gui = loggedInUserInfo.gui;
                            UserModel.roles = roleResponse.userRole.results;
                            //UserModel.data = roleResponse.userData.results;
                            
                            UserModel.location = roleResponse.userData.location;
                            UserModel.hireDate = roleResponse.userData.custom15;
                            //UserModel.hireDate = roleResponse.userData.custom08;

                            UserModel.displayName = roleResponse.userData.defaultFullName;

                            UserModel.imageURL = roleResponse.userImage;
                            UserModel.rankDesc = roleResponse.userData.custom08;
                            UserModel.firstName = "Not available";
                            UserModel.lastName = "";
                            UserModel.connectLeaderFirstName ="Not available";
                            UserModel.connectLeaderLastName ="";
                            UserModel.region = roleResponse.userData.custom05;
                            if(roleResponse.userData.manager!=null && roleResponse.userData.manager!=""){
                            	UserModel.firstName = roleResponse.userData.manager.firstName;
                            	UserModel.lastName = roleResponse.userData.manager.lastName;
                            }
                            
                             if(roleResponse.userData.customManager!=null && roleResponse.userData.customManager!=""){
                          
                        		if(roleResponse.userData.customManager.results.length>0){
	                            	if(roleResponse.userData.customManager.results[0].firstName)
	                            	{
	                            		UserModel.connectLeaderFirstName = roleResponse.userData.customManager.results[0].firstName;
	                            	}
	                            	
	                            	if(roleResponse.userData.customManager.results[0].lastName){
	                            		UserModel.connectLeaderLastName = roleResponse.userData.customManager.results[0].lastName;
	                            	}
                        		}
                          
                            }
                            
                            //UserModel.channelType = "Channel2";// response[0].ChannelType;
                            $rootScope.isUserLoaded = true;

	
	                        Session.userModel = UserModel;
	                        $rootScope.session = Session;
	                       
	
	                        if ($rootScope != undefined && $rootScope.session != undefined && $rootScope.session.userModel != undefined) {
									  
									  
										$rootScope.session.userModel.privacyContent = "";
	                                    $rootScope.session.userModel.IsPrivacyChecked = true;
	                                    $rootScope.session.userModel.PrivacyAgreementID = "";
										$rootScope.menuRole.DASHBOARD = true;
	                                    $rootScope.menuRole.DASHBOARD_READ_ONLY = true;
	                                    $rootScope.showspinner = false;
										$rootScope.showView = true;
										
									if(loggedInUserInfo.isCounsellor==true){
										$location.path("dashboardCounsellor");
									}else{
										
									   if(roleResponse.userData.custom08 == null){
									   		$location.path("usererror");
									   }
									   
									   if(roleResponse.userData.custom08!=null && (roleResponse.userData.custom08.toLowerCase().indexOf("11") > -1 || roleResponse.userData.custom08.toLowerCase().indexOf("13") > -1  || roleResponse.userData.custom08.toLowerCase().indexOf("61") > -1)){
									   	$rootScope.session.userModel.feedbackType = AppConstants.PPEDD_RATING_WEIGHT;
									   	$rootScope.session.userModel.userType = "PPEDD";
									   	$location.path("dashboard");
									   }else{
									   	$rootScope.session.userModel.feedbackType = AppConstants.NON_PPEDD_RATING_WEIGHT;
									   	$rootScope.session.userModel.userType = "NONPPEDD";
									   	$location.path("dashboard-non-ppedd-sr");
									   }
									}
										/*if($routeParams.type == "ppedd"){
	                                     $location.path("dashboard");	
	                                    }else if($routeParams.type == "non-ppedd"){
	                                    	$location.path("dashboard-non-ppedd-sr");
	                                    }*/
									  //Connection.getPartnerChannelType($rootScope.session.userModel.gui, onSuccess);
	                        }
	
	                    
	                
	
	                promiseArray.push(deferred.promise);
	                
        		 }).catch(function(err){
        		 	$rootScope.showspinner = false;
        		 	$rootScope.showUserError = true;
        		 	$rootScope.showView = true;
        		 	$rootScope.userErrorMessage = "User Info not found";
        		 	if(err.status == "401"){
        		 		$rootScope.userErrorMessage = "You are not authorized to view this page.";
        		 	}
        		 	$location.path("usererror");
        		 	
					deferred.reject(err);
	    		 });
	    		 
	    		 return $q.all(promiseArray);
            }
           
			getLoggedInuserInfo().then(function(response){
				authenticateUserAndGetRoles(response);	
			}).catch(function(err){
					//alert(err);
					console.log(err);
	    	});
			
		
        }
    };
}]);