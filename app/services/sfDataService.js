myApp.factory("sfDataService",["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", 
			function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util) {
				
	             return { 
	             	getCounseleeID: function(){
	             	
		             	var counseleeGUI = "";
		             	if($rootScope.windowsLoggedInUser != AppConstants.LOGGED_IN_USER ){
	        				counseleeGUI = AppConstants.LOGGED_IN_USER;
		             	}
	             		return counseleeGUI;
	             	},
            		getUserPhoto :function(userId){
                         var deferred = $q.defer(); 
                         
                         
                         var url = "/Photo?$filter=userId eq '"+ userId +"'&$format=json";
                         
                        	
        //                 	if(AppConstants.JAVA_LAYER_ENABLED){
        //                 		url = url.replace(userId, "<<subjectId>>");
		      //              	$http({
								//         url: AppConstants.JAVA_SERVICE_CALL,
								//         method: "POST",
								//         data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID() }
								//     }).then(function(response) {
		    		// 					deferred.resolve(response.data.d);  
								// 	}, function(error) {
										
								// 		var obj = {};
							 //       	obj.message = "";
							 //       	obj.response = "";
							 //       	obj.response = {"status":""};
							 //       	obj.response.statusCode = error.status;
							 //       	obj.body = "";
							 //       	obj.statusText = error.statusText;
								// 	   	Util.captureResponseLog(obj);
								// 		deferred.reject(obj);  
								// });
        //                 	}	
        //                     else{
								oModel.read(url,{
									filters: [],
									success:   function(odata){ 
									    deferred.resolve(odata);  
									},
									error : function(error){ 
										var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	Util.captureResponseLog(obj);
										deferred.reject(obj);  
									}
								});
                            //}
                        
                        
                        return deferred.promise;
                    },getUserPhotos :function(userId){
                         var deferred = $q.defer();  
                         
                         
        //                   if(AppConstants.JAVA_LAYER_ENABLED){
                          	
        //                   	   //var usrArr = userId.split(",");
        //                   	   //if($.inArray("'"+AppConstants.LOGGED_IN_USER+"'", usrArr) == -1){
        //                   	   //	 usrArr.push("'"+AppConstants.LOGGED_IN_USER+"'");
        //                   	   //	 userId = usrArr.join(",");
        //                   	   //}
        //                   	   var url = "/Photo?$filter=userId in '"+ userId +"'&$format=json";
        //                   	   url = url.replace(userId, "<<subjectId>>");
        //                   	   //url = url.replace(AppConstants.LOGGED_IN_USER, "<<subjectId>>");
                          	   
		      //              	$http({
								//         url: AppConstants.JAVA_SERVICE_CALL,
								//         method: "POST",
								//         data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID() }
								//     }).then(function(response) {
		    		// 				deferred.resolve(response.data.d);  
								// }, function(error) {
								// 		var obj = {};
							 //       	obj.message = "";
							 //       	obj.response = "";
							 //       	obj.response = {"status":""};
							 //       	obj.response.statusCode = error.status;
							 //       	obj.body = "";
							 //       	obj.statusText = error.statusText;
								// 	   	Util.captureResponseLog(obj);
								// 		deferred.reject(obj);  
								// });
        //                 	}	
        //                     else{
                            	var url = "/Photo?$filter=userId in "+ userId +"&$format=json";
								oModel.read(url,{
									filters: [],
									success:   function(odata){ 
									    deferred.resolve(odata);  
									},
									error : function(error){ 
									   	Util.captureResponseLog(error);
										deferred.reject(error);  
									}
								});
                            //}
                         
                         
                        return deferred.promise;
                    },getCounselees :function(userId){
                         var deferred = $q.defer();  
                         
                         
                           var url = "User?$format=json&$expand=manager&$filter=manager/userId eq '"+userId+"' &$select=userId, username, firstName, lastName&$orderby=firstName, lastName asc&$top=30";
                          if(AppConstants.JAVA_LAYER_ENABLED){
                          	    url = url.replace(userId, "<<subjectId>>");
		                    	$http({
								        url: AppConstants.JAVA_SERVICE_CALL,
								        method: "POST",
								        data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID() }
								    }).then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    							var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	Util.captureResponseLog(obj);
										deferred.reject(obj);  
								});
                        	}	
                            else{
								oModel.read(url,{
									filters: [],
									success:   function(odata){ 
									    deferred.resolve(odata);  
									},
									error : function(error){ 
									   	Util.captureResponseLog(error);
										deferred.reject(error);  
									}
								});
                            }
                         
                          
                        return deferred.promise;
                    },
                    // Get the whole form response in single method including header and formContents etc
            		getDashboardData:function(userId,startDate,endDate,selectedYear){
            			//userId ="SM3";
        				var deferred = $q.defer();   
        				//var url ="/FormHeader?$format=json&$filter=formSubjectId eq '"+userId+"'and startswith(formTitle, 'FY18') and formDataStatus ne '1'&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment, formContents/form360ReviewContentDetail/competencySections/competencies/officialRating&$select=formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/rating,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/fullName";
        				/*var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and startswith(formTitle, 'FY18') and formDataStatus ne '1' and formContents/status ne '-1'&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment, formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment";
        				
        				if(selectedYear!="" && selectedYear!=undefined){
        					var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and startswith(formTitle, '"+selectedYear+"') and formDataStatus ne '1' and formContents/status ne '-1'&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment, formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment";
        				}
						
						if(startDate!=undefined && endDate!=undefined && startDate!="" && endDate!="" && selectedYear!=""){
							url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and startswith(formTitle, '"+selectedYear+"') and formDataStatus ne '1' and formContents/status ne '-1' and formContents/lastModifiedDate ge datetime'"+startDate+"' and formContents/lastModifiedDate le datetime'"+endDate+"'&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment, formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment";
						}*/
						
						//var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and startswith(formTitle, 'FY18') and formDataStatus ne '1' and formContents/status ne '-1'";
						//var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and formTitle like '%25 feedback %25' and formDataStatus ne '1' and formContents/status ne '-1'";
        				
        				//var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and (tolower(formTitle) like '%25 feedback %25' or tolower(formTitle) like '%25self-assessment%25' or tolower(formTitle) like '%25interim%25')";
        				//var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and (tolower(formTitle) like '%25 feedback %25' or tolower(formTitle) like '%25self-assessment%25')";
        				var url="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and (tolower(formTitle) like '%25 feedback %25')";
        				
        				if(selectedYear!="" && selectedYear!=undefined){
        				 url= url + " and startswith(formTitle, '"+selectedYear+"')";
        				}
						
						if(startDate!=undefined && endDate!=undefined && startDate!="" && endDate!="" && selectedYear!=""){
							url=url + " and formReviewStartDate ge datetime'"+startDate+"' and formReviewEndDate le datetime'"+endDate+"'";
						}
						
						//url = url + "&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment&$select= formSubjectId,formContents/formContentId,formContents/status,formContents/lastModifiedDate,formContents/form360ReviewContentDetail/competencySections/othersRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/comment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment/rating,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/rating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/category,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/category,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment/rating,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement/value,formContents/form360ReviewContentDetail/competencySections/sectionName,formContents/form360ReviewContentDetail/competencySections/sectionIndex,formContents/form360ReviewContentDetail/competencySections/competencies/name,formContents/form360ReviewContentDetail/competencySections/competencies/itemId,formContents/form360ReviewContentDetail/competencySections/competencies/itemIndex";
						url = url + "&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,&$select= formSubjectId,formContents/formContentId,formContents/status,formContents/lastModifiedDate,formContents/form360ReviewContentDetail/competencySections/othersRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/sectionName,formContents/form360ReviewContentDetail/competencySections/sectionIndex,formContents/form360ReviewContentDetail/competencySections/competencies/name,formContents/form360ReviewContentDetail/competencySections/competencies/itemId,formContents/form360ReviewContentDetail/competencySections/competencies/itemIndex,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/rating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/category,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,formContents/form360ReviewContentDetail/competencySections/competencies/customElement/value,formContents/form360ReviewContentDetail/competencySections/competencies/customElement/elementKey ";
					
					
						  if(AppConstants.JAVA_LAYER_ENABLED){
		                    	$http.get(AppConstants.JAVA_SERVICE_CALL+ '"' +url +'"').then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    						Util.captureResponseLog(error);
									deferred.reject(error);  
								});
                        	}	
                            else{
								oModel.read(url,{
									filters: [],
									success:   function(odata){ 
									    deferred.resolve(odata);  
									},
									error : function(error){ 
									   	Util.captureResponseLog(error);
										deferred.reject(error);  
									}
								});
                            }
					
                      
                        return deferred.promise;
            		},
            		getYearData :function(url){ 
					  return $http({
							method: "GET",
							url:url,
							responseType: "json",
                    		withCredentials: true
						});  
            		},
            		//get only the header info (formDataid, formContentId etc)
            		getDashboardHeaderDetail : function(userId,startDate,endDate,selectedYear){
            			var deferred = $q.defer();   
        			 
        			    /*Recent old UAT code for URL*/
        				//var url ="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and formDataStatus ne '1' and (tolower(formTitle) like '%25 feedback %25' or tolower(formTitle) like '%25 self-assessment %25' or tolower(formTitle) like '%25 year-end %25')"; //and formDataStatus ne '1' and formContents/status ne '-1'
        				
        				var feedback_languages = AppConstants.LANGUAGE_FEEDBACK_TEXT;
						var query_string_for_feedback_language = "";
						$.each(feedback_languages, function(key, val){
							var languageText = encodeURI(val.value).toLowerCase();  
								if(query_string_for_feedback_language==""){
									query_string_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+ languageText +" %25' or tolower(formTitle) like '"+ languageText +" %25' ";
									//query_string_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+ languageText +" %25' ";
								}else{
									query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+ languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25' ";
									//query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+ languageText+" %25' ";
								}  
						});
						
						var self_assessment_language =  AppConstants.LANGUAGE_SELF_ASSESSMENT_TEXT;
						$.each(self_assessment_language, function(key, val){
							
							var languageText = encodeURI(val.value).toLowerCase();  
							
							if(query_string_for_feedback_language==""){
								query_stzring_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";
								//query_string_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+languageText+" %25' ";
							}else{
								query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";
								//query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+languageText+" %25' ";
							} 
						});
						
						// var year_end_language =  AppConstants.LANGUAGE_QERM_YEAR_END_TEXT;
						// $.each(year_end_language, function(key, val){
							
						// 	//var languageText = encodeURI(val.value).toLowerCase();  
						// 	var languageText = val.value.toLowerCase();  
						// 	if(query_string_for_feedback_language===""){
						// 		query_string_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";
						// 	}else{
						// 		query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";	
						// 	} 
						// }); 
						
						
						var finalization_language =  AppConstants.LANGUAGE_FINALIZATION_TEXT;
						$.each(finalization_language, function(key, val){
							
							//var languageText = encodeURI(val.value).toLowerCase();  
							var languageText = val.value.toLowerCase();  
							if(query_string_for_feedback_language===""){
								query_string_for_feedback_language=query_string_for_feedback_language + " tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";
							}else{
								query_string_for_feedback_language=query_string_for_feedback_language + " or tolower(formTitle) like '%25 "+languageText+" %25' or tolower(formTitle) like '"+ languageText +" %25'";	
							} 
						}); 
        				 
        				var url ="/FormHeader?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and formDataStatus ne '1' and ("+ query_string_for_feedback_language + ")";  
        			
        				if(selectedYear!="" && selectedYear!=undefined){
        					
        					url= url + " and (startswith(formTitle, '"+selectedYear+"') or (formTitle) like '%25 "+selectedYear+" %25' or startswith(formTitle, '"+selectedYear.replace('FY','l%E2%80%99E20')+"') or (formTitle) like '%25 "+selectedYear.replace('FY','l%E2%80%99E20')+" %25')";
        					//url= url + " and (startswith(formTitle, '"+selectedYear+"') or (formTitle) like '%25 "+selectedYear+" %25')";
        					//url= url + " and (  startswith(formTitle, '"+selectedYear+"') or (formTitle) like '%25 "+selectedYear+" %25' or startswith(formTitle, '"+selectedYear.replace('FY','l’E20')+"') or (formTitle) like '%25 "+selectedYear.replace('FY','l’E20')+" %25' )";
        					//url= url + " (formTitle) like '%25 "+selectedYear+" %25')";
        				}
						
						if(startDate!=undefined && endDate!=undefined && startDate!="" && endDate!=""){
							url= url + " and formReviewStartDate ge datetime'"+startDate+"' and formReviewEndDate le datetime'"+endDate+"'";
						}
						
						//url = url + "&$expand=formContents/form360ReviewContentDetail/competencySections/othersRatingComment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment&$select= formSubjectId,formContents/formContentId,formContents/status,formContents/lastModifiedDate,formContents/form360ReviewContentDetail/competencySections/othersRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/comment,formContents/form360ReviewContentDetail/competencySections/selfRatingComment/rating,formContents/form360ReviewContentDetail/competencySections/competencies/officialRating/rating,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/category,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/category,formContents/form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/selfRatingComment/rating,formContents/form360ReviewContentDetail/competencySections/competencies/othersRatingComment/comment,formContents/form360ReviewContentDetail/competencySections/competencies/customElement/value,formContents/form360ReviewContentDetail/competencySections/sectionName,formContents/form360ReviewContentDetail/competencySections/sectionIndex,formContents/form360ReviewContentDetail/competencySections/competencies/name,formContents/form360ReviewContentDetail/competencySections/competencies/itemId,formContents/form360ReviewContentDetail/competencySections/competencies/itemIndex";
						url = url + "&$expand=formContents,formLastContent&$select=formSubjectId,formDataId,formTitle,formDataStatus,formReviewStartDate,formReviewEndDate,formContents/formContentId,formContents/status,formLastContent/formContentId";
						
						console.log("headerquery : " + url);
					
						if(AppConstants.JAVA_LAYER_ENABLED){
                    		    url = url.replace(userId, "<<subjectId>>");
		                    	$http({
								        url: AppConstants.JAVA_SERVICE_CALL,
								        method: "POST",
								        data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID()  }
								    }).then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    							var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	Util.captureResponseLog(obj);
										deferred.reject(obj);  
								});
                        	}	else{
					
		                        oModel.read(url,{
		                           filters: [],
		                           success:   function(odata){ 
		                                deferred.resolve(odata);  
		                           },
		                           error : function(error){ 
		                           			Util.captureResponseLog(error);
											deferred.reject(error);  
		                           }
		                    	});
                    	
                        	}
                        return deferred.promise;
            		},
            		//get only the feedback form response
            		getDashboardData_feedback:function(formDataId,formContentId){
            			//userId ="SM3";
        				var deferred = $q.defer();   
        				var url="/FormContent?$format=json&$filter=status ne '-1' and formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and formDataId eq '"+formDataId+"' and formContentId in "+formContentId+"";
						//url = url + "&$expand=form360ReviewContentDetail/competencySections/othersRatingComment,form360ReviewContentDetail/form360RaterSection/form360Raters,form360ReviewContentDetail/competencySections/competencies/officialRating,form360ReviewContentDetail/competencySections/competencies/customElement,&$select=formContentId,lastModifiedDate,form360ReviewContentDetail/competencySections/othersRatingComment/comment,form360ReviewContentDetail/competencySections/sectionName,form360ReviewContentDetail/competencySections/sectionIndex,form360ReviewContentDetail/competencySections/competencies/name,form360ReviewContentDetail/competencySections/competencies/itemId,form360ReviewContentDetail/competencySections/competencies/itemIndex,form360ReviewContentDetail/competencySections/competencies/officialRating/rating,form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,form360ReviewContentDetail/form360RaterSection/form360Raters/category,form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,form360ReviewContentDetail/competencySections/competencies/customElement/value,form360ReviewContentDetail/competencySections/competencies/customElement/elementKey";
						url = url + "&$expand=form360ReviewContentDetail/competencySections/othersRatingComment,form360ReviewContentDetail/form360RaterSection/form360Raters,form360ReviewContentDetail/competencySections/competencies/officialRating,form360ReviewContentDetail/competencySections/competencies/customElement,form360ReviewContentDetail/competencySections/competencies/othersRatingComment,form360ReviewContentDetail/customSections,form360ReviewContentDetail/customSections/othersRatingComment&$select=formContentId,lastModifiedDate,status,form360ReviewContentDetail/competencySections/othersRatingComment/comment,form360ReviewContentDetail/competencySections/sectionName,form360ReviewContentDetail/competencySections/sectionIndex,form360ReviewContentDetail/competencySections/competencies/name,form360ReviewContentDetail/competencySections/competencies/itemId,form360ReviewContentDetail/competencySections/competencies/itemIndex,form360ReviewContentDetail/competencySections/competencies/officialRating/rating,form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,form360ReviewContentDetail/form360RaterSection/form360Raters/category,form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,form360ReviewContentDetail/competencySections/competencies/customElement/value,form360ReviewContentDetail/competencySections/competencies/customElement/elementKey,form360ReviewContentDetail/competencySections/competencies/othersRatingComment/comment,form360ReviewContentDetail/customSections/sectionName,form360ReviewContentDetail/customSections/sectionDescription,form360ReviewContentDetail/customSections/othersRatingComment/comment";
					
					if(AppConstants.JAVA_LAYER_ENABLED){
								url = url.replace(AppConstants.LOGGED_IN_USER, "<<subjectId>>");
		                    	$http({
								        url: AppConstants.JAVA_SERVICE_CALL,
								        method: "POST",
								        data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID() }
								    }).then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    							var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	Util.captureResponseLog(obj);
										deferred.reject(obj);  
								});
                        	}	
                            else{
		                        oModel.read(url,{
		                           filters: [],
		                           success:   function(odata){ 
		                                deferred.resolve(odata);  
		                           },
		                           error : function(error){ 
		                           			Util.captureResponseLog(error);
											deferred.reject(error);  
		                           }
		                    	});
                            }
                        return deferred.promise;
            		},
            		//this methold used to get the both self assessment and interim reponse
            		getDashboardData_self_Interim:function(formDataId,formContentId){
            			var deferred = $q.defer();   
            			//todo add status ne '-1'
        				var url="/FormContent?$format=json&$filter=formSubjectId eq '"+AppConstants.LOGGED_IN_USER+"' and formDataId eq '"+formDataId+"' and formContentId in "+formContentId+"";
						//url = url + "&$expand=form360ReviewContentDetail/competencySections/othersRatingComment,form360ReviewContentDetail/form360RaterSection/form360Raters,form360ReviewContentDetail/competencySections/competencies/officialRating,form360ReviewContentDetail/competencySections/competencies/customElement,&$select=formContentId,lastModifiedDate,form360ReviewContentDetail/competencySections/othersRatingComment/comment,form360ReviewContentDetail/competencySections/sectionName,form360ReviewContentDetail/competencySections/sectionIndex,form360ReviewContentDetail/competencySections/competencies/name,form360ReviewContentDetail/competencySections/competencies/itemId,form360ReviewContentDetail/competencySections/competencies/itemIndex,form360ReviewContentDetail/competencySections/competencies/officialRating/rating,form360ReviewContentDetail/form360RaterSection/form360Raters/participantID,form360ReviewContentDetail/form360RaterSection/form360Raters/participantName,form360ReviewContentDetail/form360RaterSection/form360Raters/category,form360ReviewContentDetail/form360RaterSection/form360Raters/jobTitle,form360ReviewContentDetail/form360RaterSection/form360Raters/participantRatingStatus,form360ReviewContentDetail/form360RaterSection/form360Raters/formContentId,form360ReviewContentDetail/competencySections/competencies/customElement/value,form360ReviewContentDetail/competencySections/competencies/customElement/elementKey";
						url = url + "&$expand=pmReviewContentDetail/customSections,pmReviewContentDetail/customSections/customElement,pmReviewContentDetail/customSections/selfRatingComment,pmReviewContentDetail/customSections/othersRatingComment,pmReviewContentDetail/userInformationSection,pmReviewContentDetail,pmReviewContentDetail/competencySections,pmReviewContentDetail/competencySections/othersRatingComment,pmReviewContentDetail/competencySections/competencies,pmReviewContentDetail/competencySections/competencies/officialRating,pmReviewContentDetail/competencySections/competencies/othersRatingComment,pmReviewContentDetail/customSections,pmReviewContentDetail/customSections/othersRatingComment,pmReviewContentDetail/objCompSummarySection,pmReviewContentDetail/objCompSummarySection/overallCompRating&$select=formContentId,lastModifiedDate,status,pmReviewContentDetail/competencySections/othersRatingComment/comment,pmReviewContentDetail/competencySections/sectionName,pmReviewContentDetail/competencySections/sectionIndex,pmReviewContentDetail/competencySections/competencies/name,pmReviewContentDetail/competencySections/competencies/itemId,pmReviewContentDetail/competencySections/competencies/itemIndex,pmReviewContentDetail/competencySections/competencies/officialRating/rating,pmReviewContentDetail/customSections/sectionName,pmReviewContentDetail/customSections/sectionDescription,pmReviewContentDetail/customSections/othersRatingComment/comment,pmReviewContentDetail/objCompSummarySection,pmReviewContentDetail/objCompSummarySection/overallCompRating";
					
						if(AppConstants.JAVA_LAYER_ENABLED){
                       		    url = url.replace(AppConstants.LOGGED_IN_USER, "<<subjectId>>");
		                    	$http({
								        url: AppConstants.JAVA_SERVICE_CALL,
								        method: "POST",
								        data: { 'url' : AppConstants.ODATA_VERSION + url, subjectId : this.getCounseleeID() }
								    }).then(function(response) {
		    						deferred.resolve(response.data.d);  
								}, function(error) {
		    							var obj = {};
							        	obj.message = "";
							        	obj.response = "";
							        	obj.response = {"status":""};
							        	obj.response.statusCode = error.status;
							        	obj.body = "";
							        	obj.statusText = error.statusText;
									   	Util.captureResponseLog(obj);
										deferred.reject(obj);  
								});
                        	}	
                            else{
		                        oModel.read(url,{
		                           filters: [],
		                           success:   function(odata){ 
		                                deferred.resolve(odata);  
		                           },
		                           error : function(error){ 
		                           			Util.captureResponseLog(error);
											deferred.reject(error);  
		                           }
		                    	});
                            }
                        return deferred.promise;
            		}  
	             }; 
			}]);