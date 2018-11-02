myApp.factory("dashboardDataService",["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", "sfDataService","jsonPath",
			function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util,sfDataService,jsonPath) {
				
				return {
				  getDashboardData : function(userId,startDate,endDate,selectedYear){
				  	   var deferred = $q.defer();   
				  	   var dashBoardData =[];
				  	  
				  	   
				  	   	var goalsCategoryObjectTemplate={
				  	   		"FormContents":[],
				  	   		"categories":[], 
				  	   		"raterInfo":[]
						};
						
						 var formContentObjectTemplate={
						 	"FormContentId":"",
						 	"FormContentStatus":"",
						 	"lastModifiedDate":"", 
						 	 "Category":[],
						 	 "RaterSection":[]
						 }; 
						
						var ratingObjectTemplate ={
						     "Rating":"",
				  	   	     "Comment":"",
				  	   	     "UserId":"" 
						}; 
				 
						
						var form360RatersObjectTemplate={
							"ParticipantName":"",
							"Weight":"",
							"JobTitle":"",
							"ParticipantId":"",
							"ParticipantRatingStatus":"",
							"category":"",
							"formContentId":"",
							"projectName":"",
							"lastModifiedDate":""
						};
						var goalsCategory={};
						var form360RatersObject={}; 
						var ratingObject={}; 
						var formContentObject={}; 
	 
						var mainCategoryObjectTemplate ={
							"categoryId":"",
							"categoryName":"",
							"subCateogry":[],
							"isCateogry":true,
							"projectName":"", 
							"rating":"",
							"ratingCount":"",
							"YTD":"",
							"YTDCount":"",
							"comments":[], 
							"raterInfo" :[]
						};
						
						var subCategoryObjectTemplate={
						   "subCategoryId":"",
						   "subCategoryName":"",
						   "subCategoryRating":"", 
						   "subCategoryRatingCount":"",
						   "subCategoryYTD" :"",
						   "subCategoryYTDCount":"",
						   "subcategoryComment":[] 
						};
						
						 var mainCategoryObject={};
						 var subCategoryObject={};
						 var isRaterListAdded = false;
				  	   
				  	   sfDataService.getDashboardData(userId,startDate,endDate,selectedYear).then(function(response){
				  	   	 if(typeof response!=undefined && response.results.length>0){
				  	   	   
				  	   	  	
				  	   	 	var formContents= false;
				  	   	 	var ratingCategory; 
				  	   		var raterInfo=[];
				  	   		
				  	   		var  getRatingObject=function(raringObject,raterId){
					  	   			var obj={};
					  	   			if(raringObject.comment!=null && raringObject.comment!=""){
	  							 		obj.comment = raringObject.comment;
	  							 		obj.userId = raterId; 
					  	   			}
	  							 	return obj;
				  	   		 }; 
				  	   	 
				  	   		goalsCategory = angular.copy(goalsCategoryObjectTemplate);
				  	   	 	
				  	   	 	$.each(response.results,function(index,data){  
				  	   	 	  
				  	   	 	  	var subjectUserId=""; 
				  	   		   
				  	   	 		//Form Header
				  	   	 		
				  	   	 		subjectUserId =data.formSubjectId;
				  	   	 		
				  	   	 		formContents=data.formContents;
				  	   	 		if(typeof formcontents!=undefined && formContents.results.length>0){
				  	   	 			$.each(formContents.results,function(formContentIndex,formCotentData){  
				  	   	 				
				  	   	 				
				  	   	 				 var currentUserId=""; 
				  	   	 				if(formCotentData.status=="-1"){
				  	   	 					return;
				  	   	 				} 
				  	   	 				
				  	   	 				//formContent Detail
				  	   	 				formContentObject = angular.copy(formContentObjectTemplate);
				  	   	 				formContentObject.FormContentId = formCotentData.formContentId;
				  	   	 				formContentObject.FormContentStatus=formCotentData.status;
				  	   	 				formContentObject.lastModifiedDate =formCotentData.lastModifiedDate;
													  	   	 				
				  	   	 				if(typeof formCotentData.form360ReviewContentDetail!=undefined && formCotentData.form360ReviewContentDetail.results.length>0){ 
				  	   	 					//form360 rater detail
				  	   	 					var form360RaterSection = formCotentData.form360ReviewContentDetail.results[0].form360RaterSection;
				  	   	 					var weightValue=1;
				  	   	 					
				  	   	 					if(typeof form360RaterSection!=undefined && form360RaterSection!=null){
				  	   	 						
				  	   	 						if(typeof form360RaterSection.form360Raters!=null && form360RaterSection.form360Raters.results.length>0){
				  	   	 							
				  	   	 							//var formContentRaterSection = jsonPath(form360RaterSection.form360Raters.results,'$..[?(@.formContentId=='+formCotentData.formContentId+')]');
				  	   	 							//if((formContentRaterSection)&&formContentRaterSection.length>0){
				  	   	 							 
// 				  	   	 							 /*isRaterListAdded = false;
// 				  	   	 							  if(goalsCategory.raterInfo.length>0){
// 				  	   	 							  		var formContentRaterSection = jsonPath(goalsCategory.raterInfo,'$..[?(@.formContentId=='+formCotentData.formContentId+')]');
// 				  	   	 							  		if((formContentRaterSection) && formContentRaterSection.length>0){
// 				  	   	 							  			isRaterListAdded = true;
// 				  	   	 							  		}
// 				  	   	 							  } */
				  	   	 								
// 				  	   	 							 //if(!isRaterListAdded){
					  	   	 							$.each(form360RaterSection.form360Raters.results,function(raterIndex,raterData){
					  	   	 								form360RatersObject=angular.copy(form360RatersObjectTemplate);
					  	   	 								form360RatersObject.ParticipantName=raterData.participantName;
															form360RatersObject.Weight=raterData.category;
															form360RatersObject.JobTitle=raterData.jobTitle;
															form360RatersObject.ParticipantId=raterData.participantID;
															form360RatersObject.ParticipantRatingStatus=raterData.participantRatingStatus;
															form360RatersObject.category=raterData.category;
															form360RatersObject.formContentId = raterData.formContentId;
															formContentObject.RaterSection.push(form360RatersObject); 
															raterInfo.push(form360RatersObject);	

															 if(goalsCategory.raterInfo.length>0){
																var formContentRaterSection = jsonPath(goalsCategory.raterInfo,'$..[?(@.formContentId=='+raterData.formContentId+')]');
																if((formContentRaterSection) && formContentRaterSection.length>0){
																	
																}else{
																	goalsCategory.raterInfo.push(form360RatersObject);
																}
				  	   	 							  		} else{
				  	   	 							  			goalsCategory.raterInfo.push(form360RatersObject);
				  	   	 							  		}
															
					  	   	 							}); 
// 				  	   	 							 //}
				  	   	 							//}
				  	   	 							
				  	   	 							//get current UserId for the form contents
				  	   	 							var userLastModifiedDate = new Array();
				  	   	 							var formContentRaterSection = jsonPath(form360RaterSection.form360Raters.results,'$..[?(@.formContentId=='+formCotentData.formContentId+')]');
				  	   	 							if((formContentRaterSection)&&formContentRaterSection.length>0){
			  	   	 									$.each(formContentRaterSection,function(raterIndex,raterData){
			  	   	 										currentUserId = raterData.participantID;   
			  	   	 										var weightText = raterData.category.toLowerCase();
			  	   	 										weightValue = parseInt($rootScope.session.userModel.feedbackType[weightText]); 
			  	   	 									}); 
				  	   	 							}
				  	   	 						}
				  	   	 					}
				  	   	 					
				  	   	 					if(raterInfo.length>0){
				  	   	 						$.each(raterInfo,function(raterIndex,raterData){
				  	   	 							if(raterData.ParticipantId == currentUserId){
				  	   	 								raterInfo[raterIndex].lastModifiedDate = formCotentData.lastModifiedDate;
				  	   	 							}
				  	   	 						});
				  	   	 					}
				  	   	 					
				  	   	 					/*if(goalsCategory.raterInfo.length>0){
				  	   	 						isRaterListAdded = true;
				  	   	 					}*/
				  	   	 					 
				  	   	 					//category section
				  	   	 					var categorySection = formCotentData.form360ReviewContentDetail.results[0].competencySections;
				  	   	 					if(typeof categorySection!=undefined && categorySection.results.length>0){
				  	   	 						$.each(categorySection.results,function(categorySectionIndex,categoryData){
				  	   	 							 
				  	   	 							 var isNewCategory=true;
				  	   	 							 var categoryArrayIndex;
				  	   	 							 var ratingValue=0;
				  	   	 							 var selfRatingValue=0;
				  	   	 							 var currentRatingValue=0;
				  	   	 							 var categorySelfRatingValue=0;
				  	   	 							 
				  	   	 							 
				  	   	 							 if(goalsCategory.categories.length>0){
				  	   	 							 	var filterBySectionId = jsonPath(goalsCategory.categories,'$..[?(@.categoryId=='+ categoryData.sectionIndex +')]');	
										  	   	  		if((filterBySectionId) && filterBySectionId.length>0){
										  	   	  			//goalsCategory.categories.findIndex(x=>x.categoryId==categoryData.sectionIndex);
															$.each(goalsCategory.categories,function(arrayIndex,arrayValue){
																if(arrayValue.categoryId==categoryData.sectionIndex){
																	categoryArrayIndex = arrayIndex;
																	isNewCategory =false; 
																	return false;
																}
															});
										  	   	  		} 
				  	   	 							 } 
				  	   	 							 
				  	   	 							 ratingCategory ="self";
				  	   	 							 if(subjectUserId != currentUserId){
				  	   	 							    ratingCategory ="ytd";
				  	   	 							 }  
				  	   	 							
				  	   	 							 //new
				  	   	 							 if(isNewCategory){ 
				  	   	 							 	mainCategoryObject = angular.copy(mainCategoryObjectTemplate); 
			  	   	 									mainCategoryObject.categoryId = categoryData.sectionIndex; 
			  	   	 								  	if(categoryData.sectionName =="Project / Engagement name"){
			  	   	 								  	    mainCategoryObject.isCateogry =false;	
			  	   	 								  	}
			  	   	 								  	mainCategoryObject.categoryName = categoryData.sectionName; 
			  	   	 								  	mainCategoryObject.raterInfo.push(raterInfo);
				  	   	 							   
				  	   	 							 	
				  	   	 								if(formCotentData.status==3 ){
				  	   	 								
				  	   	 								if(categoryData.othersRatingComment !=null && categoryData.othersRatingComment.results.length>0){
					  	   	 							 	$.each(categoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){ 
						  	   	 							    ratingObject = getRatingObject(otherRatingData,currentUserId);   
							  	   	 							mainCategoryObject.comments.push(ratingObject); 
					  	   	 							 	}); 
					  	   	 							 }
				  	   	 								
					  	   	 							 /*if(categoryData.selfRatingComment !=null){  
				  	   	 							   		if(categoryData.selfRatingComment.comment!=null && categoryData.selfRatingComment.comment!=""){
				  	   	 							   			ratingObject = getRatingObject(categoryData.selfRatingComment,currentUserId); 
					  	   	 									mainCategoryObject.comments.push(ratingObject);	
				  	   	 									}  
				  	   	 							 		ratingValue = (categoryData.selfRatingComment.rating==null) ? 0 : 
				  	   	 							 					  (categoryData.selfRatingComment.rating=="") ? 0 : 
				  	   	 							 					  (categoryData.selfRatingComment.rating.toLowerCase()=="not observed") ? 0 : 
				  	   	 							 					  categoryData.selfRatingComment.rating*weightValue; 
				  	   	 							 					  
				  	   	 									if(ratingCategory =="self"){
				  	   	 										mainCategoryObject.rating = ratingValue;
					  	   	 							 		mainCategoryObject.ratingCount = weightValue;
				  	   	 									}else{
				  	   	 										mainCategoryObject.YTD = ratingValue;
					  	   	 							 		mainCategoryObject.YTDCount = weightValue;
				  	   	 									} 
					  	   	 							 } 
					  	   	 							 
					  	   	 							 if(typeof categoryData.officialRating!=undefined && categoryData.officialRating !=null){  
					  	   	 							   	  if(categoryData.officialRating.comment!=null && categoryData.officialRating.comment!=""){ 
					  	   	 							   	  	 ratingObject = getRatingObject(categoryData.officialRating,currentUserId); 
					  	   	 							 		 mainCategoryObject.comments.push(ratingObject); 
					  	   	 							   	  }
					  	   	 							 	  ratingValue = (categoryData.officialRating.rating==null) ? 0 : 
					  	   	 							 					(categoryData.officialRating.rating=="") ? 0 : 
					  	   	 							 					(categoryData.officialRating.rating.toLowerCase()=="not observed") ? 0 : 
					  	   	 							 					categoryData.officialRating.rating*weightValue;  
					  	   	 							 					
					  	   	 								  if(ratingCategory =="self"){
					  	   	 									mainCategoryObject.rating = ratingValue;
						  	   	 								mainCategoryObject.ratingCount = weightValue;
					  	   	 								   }else{
					  	   	 								 	mainCategoryObject.YTD = ratingValue;
						  	   	 								mainCategoryObject.YTDCount = weightValue;
					  	   	 								  } 
					  	   	 							 }
				  	   	 								*/
				  	   	 									
				  	   	 								}
				  	   	 							 } 	 
					  	   	 							//edit 
			  	   	 								 if(!isNewCategory){   
			  	   	 										
		  	   	 										if(categoryData.othersRatingComment !=null && categoryData.othersRatingComment.results.length>0){
					  	   	 							 	$.each(categoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){
					  	   	 							 		if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
					  	   	 							 		   ratingObject = getRatingObject(otherRatingData,currentUserId);  
				  	   	 											goalsCategory.categories[categoryArrayIndex].comments.push(ratingObject); 
					  	   	 							 		}  
					  	   	 							 	}); 
				  	   	 								 } 
				  	   	 									
				  	   	 									/*if(categoryData.selfRatingComment !=null){
					  	   	 									
					  	   	 									if(categoryData.selfRatingComment.comment!=null && categoryData.selfRatingComment.comment!=""){
					  	   	 										ratingObject = getRatingObject(categoryData.selfRatingComment,currentUserId);   
					  	   	 							 			goalsCategory.categories[categoryArrayIndex].comments.push(ratingObject);
					  	   	 									}
					  	   	 							 		ratingValue=0;
				  	   	 										currentRatingValue=0;
				  	   	 										
				  	   	 										ratingValue = (categoryData.selfRatingComment.rating==null) ? 0 : 
				  	   	 													  (categoryData.selfRatingComment.rating=="") ? 0 : 
				  	   	 													  (categoryData.selfRatingComment.rating.toLowerCase()=="not observed") ? 0 : 
				  	   	 													  categoryData.selfRatingComment.rating*weightValue;
				  	   	 										
				  	   	 										if(ratingValue>0){
			  	   	 												if(ratingCategory=="self"){ 
			  	   	 													
			  	   	 													if(goalsCategory.categories[categoryArrayIndex].rating!=""){
			  	   	 														currentRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating);
			  	   	 													}
			  	   	 													
			  	   	 													goalsCategory.categories[categoryArrayIndex].rating = ratingValue + currentRatingValue;
			  	   	 													if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
			  	   	 														goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount) + weightValue; 
			  	   	 													}else{
			  	   	 														goalsCategory.categories[categoryArrayIndex].ratingCount =weightValue;
			  	   	 													}
			  	   	 												}else{
			  	   	 													if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
			  	   	 														currentRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD);
			  	   	 													}
			  	   	 													
			  	   	 													goalsCategory.categories[categoryArrayIndex].YTD = ratingValue + currentRatingValue;
			  	   	 													if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
			  	   	 														goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount) + weightValue; 
			  	   	 													}else{
			  	   	 														goalsCategory.categories[categoryArrayIndex].YTDCount=weightValue;
			  	   	 													}
			  	   	 												}
				  	   	 							 			} 
					  	   	 								}  
					  	   	 								
					  	   	 								if(typeof categoryData.officialRating!=undefined && categoryData.officialRating !=null){ 
					  	   	 									
					  	   	 									if(categoryData.officialRating.comment!=null && categoryData.officialRating.comment!=""){
					  	   	 										ratingObject = getRatingObject(categoryData.officialRating,currentUserId);   
					  	   	 							 			goalsCategory.categories[categoryArrayIndex].comments.push(ratingObject);
					  	   	 									}
					  	   	 							 		ratingValue=0;
				  	   	 										currentRatingValue=0;  
				  	   	 										
				  	   	 										ratingValue = (categoryData.officialRating.rating==null) ? 0 : 
				  	   	 													  (categoryData.officialRating.rating=="") ? 0 : 
				  	   	 													  (categoryData.officialRating.rating.toLowerCase()=="not observed") ? 0 : 
				  	   	 													  categoryData.officialRating.rating*weightValue; 
				  	   	 							   			
				  	   	 							   			if(ratingCategory=="self"){ 
				  	   	 							   				if(goalsCategory.categories[categoryArrayIndex].rating!=""){
			  	   	 													currentRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating);
			  	   	 													goalsCategory.categories[categoryArrayIndex].rating = ratingValue + currentRatingValue;
			  	   	 													if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
				  	   	 													goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount) + weightValue;
			  	   	 													}else{
			  	   	 														goalsCategory.categories[categoryArrayIndex].ratingCount=weightValue;
			  	   	 													}
			  	   	 												}
				  	   	 							   			}else{
				  	   	 							   				if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
				  	   	 												currentRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD);
				  	   	 												goalsCategory.categories[categoryArrayIndex].YTD = ratingValue + currentRatingValue;
				  	   	 												if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
				  	   	 													goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount) + weightValue;
				  	   	 												}else{
				  	   	 													goalsCategory.categories[categoryArrayIndex].YTDCount=weightValue;
				  	   	 												}
				  	   	 											}
				  	   	 							   			}		 
					  	   	 								}  */
			  	   	 									}  
				  	   	 						
				  	   	 							 
				  	   	 							 var competencies = categoryData.competencies;
				  	   	 							 if(typeof competencies != undefined && competencies.results.length>0){
				  	   	 							 	$.each(competencies.results,function(subCategoryIndex,subCategoryData){ 
															
															if(isNewCategory){
																subCategoryObject= angular.copy(subCategoryObjectTemplate);
																subCategoryObject.subCategoryId = subCategoryData.itemId;
																subCategoryObject.subCategoryName = subCategoryData.name;
																subCategoryObject.itemIndex=subCategoryData.itemIndex;
															} 
															if(formCotentData.status==3){
																if(isNewCategory){
																	if(subCategoryData.othersRatingComment !=null && subCategoryData.othersRatingComment.results.length>0){
								  	   	 							 	$.each(subCategoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){  
								  	   	 									if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
								  	   	 										ratingObject = getRatingObject(otherRatingData,currentUserId);   
								  	   	 							 			subCategoryObject.subcategoryComment.push(ratingObject);
								  	   	 							 		}  
								  	   	 							 	}); 
								  	   	 							} 
																	
																	 /*if(subCategoryData.selfRatingComment !=null){  
								  	   	 							 		
							  	   	 							 		if(subCategoryData.selfRatingComment.comment!=null && subCategoryData.selfRatingComment.comment!=""){ 
							  	   	 							 			ratingObject = getRatingObject(subCategoryData.selfRatingComment,currentUserId);  
							  	   	 							 			subCategoryObject.subcategoryComment.push(ratingObject); 
							  	   	 							 		}
						  	   	 							 			 currentRatingValue = (subCategoryData.selfRatingComment.rating==null) ? 0 : 
						  	   	 							 								  (subCategoryData.selfRatingComment.rating=="") ? 0: 
						  	   	 							 								  (subCategoryData.selfRatingComment.rating.toLowerCase()=="not observed") ? 0 : 
						  	   	 							 								  parseFloat(subCategoryData.selfRatingComment.rating)*weightValue;
							  	   	 							 		 
							  	   	 							 		 if(currentRatingValue>0){
					  	   	 							   					
					  	   	 							   					if(ratingCategory=="self"){ 
					  	   	 							   						subCategoryObject.subCategoryRating = currentRatingValue;
							  	   	 							 				subCategoryObject.subCategoryRatingCount = weightValue;	
							  	   	 							 				
							  	   	 							 				if(mainCategoryObject.rating!=""){
							  	   	 							 					selfRatingValue = parseFloat(mainCategoryObject.rating);
								  	   	 							 			} 
								  	   	 							 			
								  	   	 							 			mainCategoryObject.rating = selfRatingValue + currentRatingValue;
									  	   	 							 		if(mainCategoryObject.ratingCount!=""){
									  	   	 							 		  mainCategoryObject.ratingCount = parseFloat(mainCategoryObject.ratingCount)+weightValue;
									  	   	 							 		}else{
									  	   	 							 			mainCategoryObject.ratingCount = weightValue;
									  	   	 							 		} 
							  	   	 							 				
					  	   	 							   					}else{
					  	   	 							   						subCategoryObject.subCategoryYTD = currentRatingValue;
							  	   	 							 				subCategoryObject.subCategoryYTDCount = weightValue;	
							  	   	 							 				
							  	   	 							 				if(mainCategoryObject.YTD!=""){
							  	   	 							 					selfRatingValue = parseFloat(mainCategoryObject.YTD);
								  	   	 							 			} 
								  	   	 							 			
								  	   	 							 			mainCategoryObject.YTD = selfRatingValue + currentRatingValue;
									  	   	 							 		if(mainCategoryObject.YTDCount!="'"){
									  	   	 							 		  mainCategoryObject.YTDCount = parseFloat(mainCategoryObject.YTDCount)+weightValue;
									  	   	 							 		}else{
									  	   	 							 			mainCategoryObject.YTDCount = weightValue;
									  	   	 							 		}  
					  	   	 							   					}  
						  	   	 							   			} 
								  	   	 							 	 
								  	   	 							 } */
								  	   	 							 
								  	   	 							 if(typeof(subCategoryData.officialRating) !=undefined && subCategoryData.officialRating !=null){ 
								  	   	 							 		
							  	   	 							 		if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){ 
							  	   	 							 			ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId);   
							  	   	 							 			subCategoryObject.subCategoryComment.push(ratingObject);
							  	   	 									} 
							  	   	 							 		
							  	   	 							 		currentRatingValue = (subCategoryData.officialRating.rating==null) ? 0 : 
							  	   	 							 							 (subCategoryData.officialRating.rating=="") ? 0: 
							  	   	 							 							 (subCategoryData.officialRating.rating.toLowerCase()=="not observed") ? 0 : 
							  	   	 							 							 parseFloat(subCategoryData.officialRating.rating)*weightValue;
							  	   	 							 		
							  	   	 							 		if(currentRatingValue >0){
							  	   	 							 		
							  	   	 							 			if(ratingCategory=="self"){
							  	   	 							 				subCategoryObject.subCategoryRating = currentRatingValue;
							  	   	 							 				subCategoryObject.subCategoryRatingCount=weightValue;
							  	   	 							 				
							  	   	 							 				if(mainCategoryObject.rating!=""){
								  	   	 							 			  selfRatingValue = parseFloat(mainCategoryObject.rating);
									  	   	 							 		} 
									  	   	 							 			
									  	   	 							 		mainCategoryObject.rating = selfRatingValue + currentRatingValue;
										  	   	 							 	if(mainCategoryObject.ratingCount!=""){
										  	   	 							 	  mainCategoryObject.ratingCount = parseFloat(mainCategoryObject.ratingCount)+weightValue;
										  	   	 							 	}else{
										  	   	 							 		mainCategoryObject.ratingCount =weightValue;
										  	   	 							 	} 
							  	   	 							 				
							  	   	 							 			}else{
							  	   	 							 				subCategoryObject.subCategoryYTD = currentRatingValue;
							  	   	 							 				subCategoryObject.subCategoryYTDCount=weightValue;
							  	   	 							 				
							  	   	 							 				if(mainCategoryObject.YTD!=""){
								  	   	 							 			  selfRatingValue = parseFloat(mainCategoryObject.YTD);
									  	   	 							 		} 
									  	   	 							 			
									  	   	 							 		mainCategoryObject.YTD = selfRatingValue + currentRatingValue;
										  	   	 							 	if(mainCategoryObject.YTDCount!=""){
										  	   	 							 	  mainCategoryObject.YTDCount = parseFloat(mainCategoryObject.YTDCount)+weightValue;
										  	   	 							 	}else{
										  	   	 							 		mainCategoryObject.YTDCount =weightValue;
										  	   	 							 	} 
							  	   	 							 			} 
							  	   	 							 		} 
								  	   	 							  
								  	   	 							 }  
																}
							  	   	 							if(!isNewCategory){
																	var subItemIndex=0;
																	var itemFilterBySubCategory = jsonPath(goalsCategory.categories[categoryArrayIndex].subCateogry,'$..[?(@.subCategoryId=='+subCategoryData.itemId+')]');
																	if((itemFilterBySubCategory) && itemFilterBySubCategory.length>0){
																		$.each(goalsCategory.categories[categoryArrayIndex].subCateogry,function(itemIndex,subCategoryItem){
																			if(subCategoryData.itemId==subCategoryItem.subCategoryId){
																				subItemIndex =itemIndex;
																				return false;
																			}	
																		});
																		
																		 /*if(subCategoryData.selfRatingComment !=null){ 
																		 	
																		 	if(subCategoryData.selfRatingComment.comment!=null && subCategoryData.selfRatingComment.comment!=""){
																		 		ratingObject = getRatingObject(subCategoryData.selfRatingComment,currentUserId); 
								  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subcategoryComment.push(ratingObject); 
																		 	} 
								  	   	 							 		
								  	   	 							 		if(subCategoryData.selfRatingComment.rating!=null && subCategoryData.selfRatingComment.rating!=""){
								  	   	 							 			selfRatingValue=0;
								  	   	 							 			
								  	   	 							 			currentRatingValue = (subCategoryData.selfRatingComment.rating==null) ? 0 : 
							  	   	 							 							 (subCategoryData.selfRatingComment.rating=="") ? 0: 
							  	   	 							 							 (subCategoryData.selfRatingComment.rating.toLowerCase()=="not observed") ? 0 : 
							  	   	 							 							 parseFloat(subCategoryData.selfRatingComment.rating)*weightValue;
								  	   	 							 			
								  	   	 							 			//currentRatingValue = parseFloat(subCategoryData.selfRatingComment.rating)*weightValue; 
								  	   	 							 			
								  	   	 							 			if(ratingCategory=="self"){
								  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating!=""){
								  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating);
									  	   	 							 			}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating =selfRatingValue+currentRatingValue;
									  	   	 							 			
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount!=""){
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount)+weightValue;
									  	   	 							 			}
									  	   	 							 			else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount=weightValue;
									  	   	 							 			} 
									  	   	 							 			
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].rating!=""){
									  	   	 							 				categorySelfRatingValue =0;
									  	   	 							 				categorySelfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating);
									  	   	 							 			}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].rating=categorySelfRatingValue+currentRatingValue;
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount)+weightValue;
									  	   	 							 			}else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].ratingCount =weightValue;
									  	   	 							 			} 
								  	   	 							 			}else{
								  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD!=""){
								  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD);
									  	   	 							 			}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD =selfRatingValue+currentRatingValue;
									  	   	 							 			
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount!=""){
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount)+weightValue;
									  	   	 							 			}
									  	   	 							 			else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount=weightValue;
									  	   	 							 			} 
									  	   	 							 			
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
									  	   	 							 				categorySelfRatingValue =0;
									  	   	 							 				categorySelfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD);
									  	   	 							 			}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].YTD=categorySelfRatingValue+currentRatingValue;
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount)+weightValue;
									  	   	 							 			}else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].YTDCount =weightValue;
									  	   	 							 			}  
								  	   	 							 			} 
								  	   	 							 		  }
								  	   	 							 		}*/
								  	   	 							 		
									  	   	 						 
										  	   	 							 
										  	   	 						 if(subCategoryData.officialRating !=null){    
							  	   	 										
							  	   	 										if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){
							  	   	 											ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId);   
							  	   	 											goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryComment.push(ratingObject); 
							  	   	 										} 
									  	   	 							  
									  	   	 							 	if(subCategoryData.officialRating.rating!=null && subCategoryData.officialRating.rating!=""){
									  	   	 							 		selfRatingValue=0;
									  	   	 							 		categorySelfRatingValue =0;
									  	   	 							 		//currentRatingValue = parseFloat(subCategoryData.officialRating.rating)*weightValue;
									  	   	 							 		
									  	   	 							 			currentRatingValue = (subCategoryData.officialRating.rating==null) ? 0 : 
							  	   	 							 							 (subCategoryData.officialRating.rating=="") ? 0: 
							  	   	 							 							 (subCategoryData.officialRating.rating.toLowerCase()=="not observed") ? 0 : 
							  	   	 							 							 parseFloat(subCategoryData.officialRating.rating)*weightValue;
									  	   	 							 		
									  	   	 							 		
									  	   	 							 		if(ratingCategory=="self"){
										  	   	 							 		if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating!=""){
										  	   	 							 			selfRatingValue =parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating); 
										  	   	 							 		}
										  	   	 							 		goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRating = currentRatingValue+selfRatingValue;
										  	   	 							 		if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount!="")
										  	   	 							 		{
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount)+weightValue;
										  	   	 							 		}else{
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryRatingCount =weightValue;
										  	   	 									}
										  	   	 									
										  	   	 									if(goalsCategory.categories[categoryArrayIndex].rating!=""){
								  	   	 							 					categorySelfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating); 
										  	   	 							 		}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].rating=categorySelfRatingValue+currentRatingValue;
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
								  	   	 							 					goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount)+weightValue;
									  	   	 							 			}else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].ratingCount =weightValue;
									  	   	 							 			}
									  	   	 							 		}else{
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD!=""){
										  	   	 							 			selfRatingValue =parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD); 
										  	   	 							 		}
										  	   	 							 		goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTD = currentRatingValue+selfRatingValue;
										  	   	 							 		if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount!="")
										  	   	 							 		{
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount)+weightValue;
										  	   	 							 		}else{
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryYTDCount =weightValue;
										  	   	 									}
										  	   	 									
										  	   	 									if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
								  	   	 							 					categorySelfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD); 
										  	   	 							 		}
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].YTD=categorySelfRatingValue+currentRatingValue;
									  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
								  	   	 							 					goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount)+weightValue;
									  	   	 							 			}else{
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].YTDCount =weightValue;
									  	   	 							 			}
									  	   	 							 		}
									  	   	 							 	}   
									  	   	 							 }  
																		 
																	}else{
																		//new sub category
																		subCategoryObject= angular.copy(subCategoryObjectTemplate);
																		subCategoryObject.subCategoryId = subCategoryData.itemId;
																		subCategoryObject.subCategoryName = subCategoryData.name;
																		subCategoryObject.itemIndex=subCategoryData.itemIndex;
																		
																		//if(isNewCategory){
																			
																			 /*if(subCategoryData.selfRatingComment !=null){ 
																			  
																			 	if(subCategoryData.selfRatingComment.comment!=null && subCategoryData.selfRatingComment.comment!=""){
								  	   	 											ratingObject = getRatingObject(subCategoryData.selfRatingComment,currentUserId);   
									  	   	 							 			subCategoryObject.subCategoryComment.push(ratingObject);
																			 	}
									  	   	 							 		
									  	   	 							 		if(subCategoryData.selfRatingComment.rating!=null && subCategoryData.selfRatingComment.rating!=""){ 
									  	   	 							 			
									  	   	 							 			currentRatingValue=0;
									  	   	 							 			selfRatingValue=0;
									  	   	 							 			
									  	   	 							 			currentRatingValue = (subCategoryData.selfRatingComment.rating==null) ? 0 : 
							  	   	 							 							 (subCategoryData.selfRatingComment.rating=="") ? 0: 
							  	   	 							 							 (subCategoryData.selfRatingComment.rating.toLowerCase()=="not observed") ? 0 : 
							  	   	 							 							 parseFloat(subCategoryData.selfRatingComment.rating)*weightValue;
									  	   	 							 			
									  	   	 							 			//currentRatingValue = subCategoryData.selfRatingComment.rating*weightValue;
									  	   	 							 			
									  	   	 							 			if(ratingCategory=="self"){
									  	   	 							 				subCategoryObject.subCategoryRating = currentRatingValue;
									  	   	 							 				subCategoryObject.subCategoryRatingCount = weightValue; 
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].rating!=""){
									  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating);
										  	   	 							 			}
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].rating = currentRatingValue + selfRatingValue ; 
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount)+weightValue;
									  	   	 							 				}
									  	   	 							 				else{
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].ratingCount=weightValue;
									  	   	 							 				} 
									  	   	 							 			}
									  	   	 							 			else{
									  	   	 							 				
									  	   	 							 				subCategoryObject.subCategoryYTD = currentRatingValue;
									  	   	 							 				subCategoryObject.subCategoryYTDCount =weightValue; 
									  	   	 							 				
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
									  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD);
									  	   	 							 				}
										  	   	 							 			goalsCategory.categories[categoryArrayIndex].YTD = currentRatingValue + selfRatingValue ; 
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount)+weightValue;
									  	   	 							 				}
									  	   	 							 				else{
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].YTDCount=weightValue;
									  	   	 							 					} 
										  	   	 							 		} 
									  	   	 							 		} 
																			 }*/
										  	   	 							 
										  	   	 							 if(subCategoryData.officialRating !=null){   
										  	   	 							 	
							  	   	 											if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){
							  	   	 												 ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId);   
							  	   	 												 subCategoryObject.subCategoryComment.push(ratingObject);
							  	   	 											}
									  	   	 							 		
									  	   	 							 		if(subCategoryData.officialRating.rating!=null && subCategoryData.officialRating.rating!=""){  
									  	   	 							 			//currentRatingValue = subCategoryData.officialRating.rating*weightValue;
									  	   	 							 			
									  	   	 							 			currentRatingValue = (subCategoryData.officialRating.rating==null) ? 0 : 
							  	   	 							 							 (subCategoryData.officialRating.rating=="") ? 0: 
							  	   	 							 							 (subCategoryData.officialRating.rating.toLowerCase()=="not observed") ? 0 : 
							  	   	 							 							 parseFloat(subCategoryData.officialRating.rating)*weightValue;
									  	   	 							 			
									  	   	 							 			if(ratingCategory=="self"){
										  	   	 							 			subCategoryObject.subCategoryRating = currentRatingValue;
										  	   	 							 			subCategoryObject.subCategoryRatingCount=weightValue;  
										  	   	 							 			
										  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].rating!=""){
									  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].rating);
										  	   	 							 			}
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].rating = currentRatingValue + selfRatingValue;
									  	   	 							 				
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].ratingCount!=""){
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].ratingCount = parseFloat(goalsCategory.categories[categoryArrayIndex].ratingCount)+weightValue;
									  	   	 							 				}else{
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].ratingCount=weightValue;
									  	   	 							 				}
									  	   	 							 			}
									  	   	 							 			else
									  	   	 							 			{
									  	   	 							 				subCategoryObject.subCategoryYTD = currentRatingValue;
										  	   	 							 			subCategoryObject.subCategoryYTDCount=weightValue;  
										  	   	 							 			
										  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].YTD!=""){
									  	   	 							 					selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].YTD);
										  	   	 							 			}
									  	   	 							 				goalsCategory.categories[categoryArrayIndex].YTD = currentRatingValue + selfRatingValue;
									  	   	 							 				
									  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].YTDCount!=""){
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].YTDCount = parseFloat(goalsCategory.categories[categoryArrayIndex].YTDCount)+weightValue;
									  	   	 							 				}else{
									  	   	 							 					goalsCategory.categories[categoryArrayIndex].YTDCount=weightValue;
									  	   	 							 				}
									  	   	 							 			} 
									  	   	 							 		}
										  	   	 							 }
										  	   	 							 
										  	   	 							 //get the project/engagement name
									  	   	 							 	if(typeof subCategoryData.customElement!=undefined && subCategoryData.customElement.results.length>0){
										  	   	 								$.each(subCategoryData.customElement.results,function(customeElementIndex,customElementData){ 
										  	   	 									if(customElementData.elementKey =="project" && customElementData.value!="") {
										  	   	 										goalsCategory.categories[categoryArrayIndex].projectName =customElementData.value;
										  	   	 										//categories[categoryArrayIndex].isCateogry =false;	
										  	   	 										
										  	   	 										if(goalsCategory.raterInfo.length>0){
										  	   	 											$.each(goalsCategory.raterInfo,function(iIndex,dData){
										  	   	 												if(dData.ParticipantId==currentUserId){
										  	   	 													goalsCategory.raterInfo[iIndex].projectName=customElementData.value;
										  	   	 													return false;
										  	   	 												}
										  	   	 											});
									  	   	 											}  
										  	   	 									}
										  	   	 								});
										  	   	 							}
																			 
																		//}  
																	   goalsCategory.categories[categoryArrayIndex].subCateogry.push(subCategoryObject);	
																	} 
																}  
																
																//get the project/engagement name 
							  	   	 							if(typeof subCategoryData.customElement!=undefined && subCategoryData.customElement.results.length>0){
							  	   	 								$.each(subCategoryData.customElement.results,function(customeElementIndex,customElementData){ 
							  	   	 									if(customElementData.elementKey =="project" && customElementData.value!="") {
							  	   	 										mainCategoryObject.projectName =customElementData.value;
							  	   	 										//mainCategoryObject.isCateogry =false;
							  	   	 										
							  	   	 										if(goalsCategory.raterInfo.length>0){
							  	   	 											$.each(goalsCategory.raterInfo,function(iIndex,dData){
							  	   	 												if(dData.ParticipantId==currentUserId){
							  	   	 													goalsCategory.raterInfo[iIndex].projectName=customElementData.value;
							  	   	 												}
							  	   	 											});
							  	   	 										} 
							  	   	 									}
							  	   	 								});
							  	   	 							}  
															}  
															 if(isNewCategory){
																mainCategoryObject.subCateogry.push(subCategoryObject); 
															 } 
				  	   	 							 	});
				  	   	 							 } 
				  	   	 							 if(isNewCategory){
				  	   	 							  goalsCategory.categories.push(mainCategoryObject);
				  	   	 							 } 
				  	   	 						});
				  	   	 					} 
				  	   	 				} 
				  	   	 				
				  	   	 			});
				  	   	 		} 
				  	   	 	});
				  	   	 	
				  	   	 	if(goalsCategory.categories.length>0){  
				  	   	 		goalsCategory.FormContents.push(formContentObject);
				  	   	 		dashBoardData.push(goalsCategory);
				  	   	 	}
				  	   	 } 
				  	   	 
				  	   	 console.log(dashBoardData);
				  	   	 deferred.resolve(dashBoardData);  
				  	   }).catch(function(err){
				  	   		deferred.reject(err);  
				  	   });
				  	    return deferred.promise; 
				  }	
				};
			}]);