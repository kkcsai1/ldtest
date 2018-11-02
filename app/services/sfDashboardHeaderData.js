myApp.factory("dashboardHeaderDataService",["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", "sfDataService","jsonPath",
			function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util,sfDataService,jsonPath) {
				
				return {
				  getDashboardHeaderData : function(userId,startDate,endDate,selectedYear){
				  	   var deferred = $q.defer();   
				  	    
				  	   sfDataService.getDashboardHeaderDetail(userId,startDate,endDate,selectedYear).then(function(response){
				  	   	  var frmContentArray = [];
				  	   	 if(typeof response!=undefined && response.results.length>0){
				  	   	  
				  	   	   
				  	   	   var frmContentArrayObject = {
				  	   	   	"formSubjectId" :"",
				  	   	   	"formDataId" :"",
				  	   	   	"formContentId":"",
				  	   		"status":"",
				  	   		"formTitle":""
				  	   	   };
				  	   	   var iCount =0;
				  	   	   
				  	   	   $.each(response.results,function(index,data){
				  	   	   	  
				  	   	   	var frmContentArrayObjectResponse = angular.copy(frmContentArrayObject);
				  	   	   	var formContentId="";
				  	   	   	var formContentStatus = "";
			  	   	   		if(data.formContents.results.length>0){
			  	   	   			
			  	   	   			var IsFeedbackExists = Util.isFormFoundwithTitle(data.formTitle,AppConstants.FEEDBACK_TEXT);
			  	   	   			var IsInterimExists = Util.isFormFoundwithTitle(data.formTitle,AppConstants.INTERIM_TEXT);
			  	   	   			var IsSelfAssessmentExists = Util.isFormFoundwithTitle(data.formTitle,AppConstants.SELF_ASSESSMENT_TEXT);
			  	   	   			var IsYearEndExists = Util.isFormFoundwithTitle(data.formTitle,AppConstants.QERM_YEAR_END_TEXT);
			  	   	   			var IsFinalizationExists = Util.isFormFoundwithTitle(data.formTitle,AppConstants.FINALIZATION_TEXT);
			  	   	   			
			  	   	   			if((IsFeedbackExists) && (!IsInterimExists) &&  (!IsSelfAssessmentExists)) 
			  	   	   			{ 
				  	   	   			$.each(data.formContents.results,function(item,iValue){ 
				  	   	   				 if(iValue.status!="-1"){
					  	   	   			   formContentId = formContentId + "'" + iValue.formContentId + "',";
					  	   	   			   formContentStatus= formContentStatus + iValue.status + "~" + iValue.formContentId + ",";
				  	   	   				 }
				  	   	   			}); 
			  	   	   					
		  	   	   					var lastChar = formContentId.slice(-1);
									if(lastChar == ',') {
									  formContentId = formContentId.slice(0, -1);
									}
									
									lastChar = formContentStatus.slice(-1);
									if(lastChar == ',') {
									  formContentStatus = formContentStatus.slice(0, -1);
									}
									
									if(formContentId!=""){	
										frmContentArrayObjectResponse = {
							  	   	   			formSubjectId : data.formSubjectId,	
							  	   	   			formDataId :data.formDataId,
					  	   	   					formContentId:formContentId,
						  	   					status : formContentStatus,
						  	   					formTitle:data.formTitle.toLowerCase()
				  	   	   				};
				  	   	   				frmContentArray.push(frmContentArrayObjectResponse);  
									} 
			  	   	   					
				  	   	   		}
				  	   	   		
				  	   	 
				  	   	   		if(data.formDataStatus=="3" && ((IsSelfAssessmentExists)) || (IsYearEndExists) || (IsFinalizationExists)){
			  	   	   				if(data.formLastContent.formContentId!=""){	
										frmContentArrayObjectResponse = {
							  	   	   			formSubjectId : data.formSubjectId,	
							  	   	   			formDataId :data.formDataId,
					  	   	   					formContentId:data.formLastContent.formContentId,
						  	   					status : formContentStatus,
						  	   					formTitle:data.formTitle.toLowerCase()
				  	   	   				};
				  	   	   				frmContentArray.push(frmContentArrayObjectResponse);  
									} 	
			  	   	   			}
				  	   	   		
				  	   	   	 
				  	   	   		
			  	   	   		}
				  	   	   	//	frmContentArray.push(frmContentArrayObjectResponse);              
				  	   	   	  
				  	   	   	iCount++;
				  	   	   }); 
				  	   	   if(iCount==response.results.length ||  response.length == 0){
				  	   			deferred.resolve(frmContentArray);
				  	   	   }
				  	   	 }else{
				  	   	 	deferred.resolve(frmContentArray);
				  	   	 }
				  	   }).catch(function(err){
				  	   		deferred.reject(err);  
				  	   });
				  	    return deferred.promise; 
				  }	
				};
			}]);