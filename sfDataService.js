myApp.factory("sfDataService",["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", function ($q, $rootScope, $http, $location, AppConstants, UserModel) {
				
	             return { 
	             	
	              getUserRole :	function(){
                    	var deferred = $q.defer();   
		                oModel.read("/getUserRolesByUserId?userId='"+ AppConstants.LOGGED_IN_USER +"'&$format=json",{
		                   filters: [],
		                   success:   function(odata){ 
		                        deferred.resolve(odata);  
		                   },
		                   error:function(errorMessage){
		                   		deferred.reject(errorMessage);  
		                   }
                        });
                        return deferred.promise;
            		},
            		
            		getUsers : function(users){
            			var deferred = $q.defer();   
		                oModel.read("/User?$filter=userId in "+users+"&$format=json",{
		                   filters: [],
		                   success:   function(odata){ 
		                        deferred.resolve(odata);  
		                   },
		                   error:function(errorMessage){
		                   		deferred.reject(errorMessage);  
		                   }
                        });
                        return deferred.promise;
            		},
            		getUserRole : function(userIds){
            			var deferred = $q.defer(); 
                        
                         var oJsonModel = new sap.ui.model.json.JSONModel(); 
                        oModel.read("/getUserRolesByUserId?userId in"+ userIds +"&$format=json",{
                           filters: [],
                           success:   function(odata){ 
                           	    deferred.resolve(odata);  
                           },
		                   error:function(errorMessage){
		                   		deferred.reject(errorMessage);  
		                   }
                		 });
                        return deferred.promise;
            		},
            		getUserPhotos :function(userId){
                         var deferred = $q.defer();  
                          oModel.read("/Photo?$filter=userId in "+ userId +"&$format=json",{
                           filters: [],
                           success:   function(odata){ 
                                deferred.resolve(odata);  
                           },
                           error : function(error){ 
									deferred.reject(error);  
                           }
                        });
                        return deferred.promise;
                    },
            		 getCounseeleeListFromApi :	function(userId, searchParam){
                    	var deferred = $q.defer();   
		              
		                var url = "";
		                if(searchParam==""){
		                	url = "/FormHeader?$format=json&$filter=formSubject/customManager/userId eq '"+userId+"'&$expand=formSubject &$select=formSubject/userId, formSubject/customManager";
		                }else{
		                	url = "/FormHeader?$format=json&$filter=formSubject/customManager/userId eq '"+userId+"' and startswith(tolower(formSubject/username), tolower('"+searchParam+"'))&$expand=formSubject &$select=formSubject/userId, formSubject/customManager";
		                }
		                
		                oModel.read(url,{
		                   filters: [],
		                   success:   function(odata){ 
		                        deferred.resolve(odata);  
		                   },
		                   error:function(errorMessage){
		                   		deferred.reject(errorMessage);  
		                   }
                        });
                        return deferred.promise;
            		},
					getCounseleeList:function(searchParam,onSuccess){
		             	var counseleeList = [];
		             	var counseleeListObject ={
		             	   "GUI" : "",
		             	    "displayName":"",
		             	    "roleId":""
		             	};
		             	var tmp ={};
		             	tmp = angular.copy(counseleeListObject);
		             	tmp.GUI = "10003001356";
		             	tmp.displayName = "Barbara";
		             	tmp.roleId  ="1";
		             	
		             	counseleeList.push(tmp);
		             	
		             	var tmp ={};
		             	tmp = angular.copy(counseleeListObject);
		             	tmp.GUI = "10003001352";
		             	tmp.displayName = "Barbara1";
		             	tmp.roleId  ="1";
		             	
		             	counseleeList.push(tmp);
		             	
		             	
		             	var tmp ={};
		             	tmp = angular.copy(counseleeListObject);
		             	tmp.GUI = "10003001352";
		             	tmp.displayName = "Barbara2";
		             	tmp.roleId  ="1";
		             	
		             	counseleeList.push(tmp);
		             	
		             	if (onSuccess && typeof (onSuccess) === "function") {
                    	   onSuccess(counseleeList);
                		}  
		             	
		             //	return counseleeList;
	             	
	             	
	            	}
	             };
	             
			}]);