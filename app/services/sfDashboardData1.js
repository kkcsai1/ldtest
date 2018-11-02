myApp.factory("dashboardDataService1",["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", "sfDataService","jsonPath",
			function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util,sfDataService,jsonPath) {
				
				return {
				  getDashboardData : function(headerResponse){
				  	   var deferred = $q.defer();   
				  	   var dashBoardData =[];
				  	  
				  	   
				  	   	var goalsCategoryObjectTemplate={ 
				  	   		"categories":[], 
				  	   		"raterInfo":[],
				  	   		"quantitative" :[],
				  	   	    "selfFormType" : "",
				  	   	    "yearEndQERMFormType":"",
				  	   	    "formTitle" :""
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
							"finalAssessment" : "",
							"finalAssessmentCount" : "",
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
						   "subCategoryFinalAssessment":"",
						   "subCategoryFinalAssessmentCount" : "",
						   "subCategoryComment":[] 
						}; 
						
						var quantitativeTemplate ={
						  "metricsName" : "",
						  "comment":"",
						  "lastModifiedDate":"",
						  "formContentId":""
						};
						
						 var mainCategoryObject={};
						 var subCategoryObject={};
					
						 if(headerResponse.length<=0){
						 	deferred.resolve(dashBoardData);   
						 	return deferred.promise; 
						 }
						 
					 	goalsCategory = angular.copy(goalsCategoryObjectTemplate);
			  	   	 	var iCount =0;
			  	   	 	
			  	   	 	//get the current rating value
			  	   	 	var getCurrentRating = function(officialRating){
						  	var currentRatingValue =0;
						  	currentRatingValue = (officialRating.rating==null) ? 0 : 
		  			 							 (officialRating.rating==="") ? 0: 
		  			 							 (officialRating.rating.toLowerCase()==="not observed") ? 0 : 
		  			 							 parseFloat(officialRating.rating);
						  	return currentRatingValue;
						}
						  
						//create the comment object
						var  getRatingObject=function(raringObject,raterId, formContentId){
				  	   			var obj={};
				  	   			if(raringObject.comment!=null && raringObject.comment!==""){
  							 		obj.comment = raringObject.comment;
  							 		obj.userId = raterId; 
  							 		obj.formContentId = formContentId;
				  	   			}
  							 	return obj;
				  	   	};  
				  	   	
				  	   	var getProjectName = function(customElement){
				  	   	  var projectName ="";
				  	   	  
				  	   	  	if(typeof customElement!="undefined" && customElement.results.length>0){
  								$.each(customElement.results,function(customeElementIndex,customElementData){ 
  									if(customElementData.elementKey =="project" && customElementData.value!="") {
  										projectName =customElementData.value;
  										return false;
  									}
  								});
  							}   
				  	   	  return projectName;
				  	   	};
				  	   	
				  	   	 var getCompetencySection = function(categorySection,formContentStatus,currentUserId,subjectUserId,
				  											formContentId,weightValue,formTitle){
				  	   	 		if(typeof categorySection!="undefined" && categorySection.results.length>0){
				  	   	 				
				  	   	 				var IsYearEndExists = Util.isFormFoundwithTitle(formTitle,AppConstants.QERM_YEAR_END_TEXT); 
				  	   	 				var IsFinalizationExists = Util.isFormFoundwithTitle(formTitle,AppConstants.FINALIZATION_TEXT); 
				  	   	 			
		  	   	 						$.each(categorySection.results,function(categorySectionIndex,categoryData){
		  	   	 							 
		  	   	 							 var isNewCategory=true;
		  	   	 							 var categoryArrayIndex; 
		  	   	 							 var selfRatingValue=0;
		  	   	 							 var currentRatingValue=0;
		  	   	 							 var categorySelfRatingValue=0;
		  	   	 							 
											if(categoryData.sectionName ===""){
												var filterBySectionId = jsonPath(goalsCategory.categories,'$..[?(@.categoryName=="'+ AppConstants.FINAL_ASSESSMENT_CATEGORY_NAME+'")]');
												if(!filterBySectionId){
												   var mainCategoryObjectQuality = angular.copy(mainCategoryObjectTemplate); 
												   mainCategoryObjectQuality.categoryName = AppConstants.FINAL_ASSESSMENT_CATEGORY_NAME;
	  	   	 									   goalsCategory.categories.push(mainCategoryObjectQuality);
	  	   	 									   return;
	  	   	 									}
	  	   	 									return;
											}
		  	   	 							
		  	   	 							 if(goalsCategory.categories.length>0 ){
		  	   	 							 	var filterBySectionId = jsonPath(goalsCategory.categories,'$..[?(@.categoryName=="'+ categoryData.sectionName +'")]');	
								  	   	  		if((filterBySectionId) && filterBySectionId.length>0){
								  	   	  			//goalsCategory.categories.findIndex(x=>x.categoryId==categoryData.sectionIndex);
													$.each(goalsCategory.categories,function(arrayIndex,arrayValue){
														if(arrayValue.categoryName==categoryData.sectionName){
															categoryArrayIndex = arrayIndex;
															isNewCategory =false; 
															return false;
														}
													});
								  	   	  		} 
		  	   	 							 } 
		  	   	 							 
		  	   	 							 ratingCategory ="self"; 
		  	   	 							  if(subjectUserId != currentUserId && currentUserId!=""){
		  	   	 							    ratingCategory ="ytd";
		  	   	 							 }  
		  	   	 							 
		  	   	 							 if(IsYearEndExists)
		  	   	 							 {
		  	   	 							 	 ratingCategory ="ytd";
		  	   	 							 }
		  	   	 							 
		  	   	 							 if(IsFinalizationExists)
		  	   	 							 {
		  	   	 							 	 ratingCategory ="finalAssesment";
		  	   	 							 }
		  	   	 							 
		  	   	 							 //new main category (Competency sections)
		  	   	 							 if(isNewCategory){ 
		  	   	 							 	mainCategoryObject = angular.copy(mainCategoryObjectTemplate); 
	  	   	 									mainCategoryObject.categoryId = categoryData.sectionIndex; 
	  	   	 								    	
	  	   	 								    if(categoryData.sectionName =="Project / Engagement name"){
	  	   	 								  	    mainCategoryObject.isCateogry =false;	
	  	   	 								  	}
	  	   	 								  	
	  	   	 								  	mainCategoryObject.categoryName = categoryData.sectionName; 
	  	   	 								  	//mainCategoryObject.raterInfo.push(raterInfo);
		  	   	 							 	
		  	   	 								if(formContentStatus==3 ){
													if(typeof categoryData.othersRatingComment !="undefined" && categoryData.othersRatingComment !=null && categoryData.othersRatingComment.results.length>0){
														$.each(categoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){ 
															ratingObject = getRatingObject(otherRatingData,currentUserId, formContentId);   
															mainCategoryObject.comments.push(ratingObject); 
														}); 
													} 
												}
		  	   	 							 } 	 
			  	   	 						//edit (Competency Section)
			  	   	 						if(formContentStatus==3 ){
	  	   	 									if(!isNewCategory){  
													if(typeof categoryData.othersRatingComment !="undefined" && categoryData.othersRatingComment !=null && categoryData.othersRatingComment.results.length>0){
														$.each(categoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){
															if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
																ratingObject = getRatingObject(otherRatingData,currentUserId, formContentId);  
																goalsCategory.categories[categoryArrayIndex].comments.push(ratingObject); 
															}  
														}); 
													}  
	  	   	 									}  
			  	   	 						}
		  	   	 						
		  	   	 							 //get the subcategory (Competencies)
		  	   	 							 var competencies = categoryData.competencies;
		  	   	 							 if(typeof competencies != "undefined" && competencies.results.length>0){
		  	   	 							 	$.each(competencies.results,function(subCategoryIndex,subCategoryData){ 
		  	   	 							 		
		  	   	 							 		console.log(subCategoryData);
													
													if(isNewCategory){
														subCategoryObject= angular.copy(subCategoryObjectTemplate);
														subCategoryObject.subCategoryId = subCategoryData.itemId;
														subCategoryObject.subCategoryName = subCategoryData.name.replace(/,/g , '');
														subCategoryObject.itemIndex=subCategoryData.itemIndex;
													} 
													
													if(formContentStatus==3){
													
														if(isNewCategory){
															if(typeof subCategoryData.othersRatingComment !="undefined" && subCategoryData.othersRatingComment !=null && subCategoryData.othersRatingComment.results.length>0){
						  	   	 							 	$.each(subCategoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){  
						  	   	 									if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
						  	   	 										ratingObject = getRatingObject(otherRatingData,currentUserId, formContentId);   
						  	   	 							 			subCategoryObject.subCategoryComment.push(ratingObject);
						  	   	 							 			mainCategoryObject.comments.push(ratingObject); 
						  	   	 							 		}  
						  	   	 							 	}); 
						  	   	 							}  
						  	   	 							 
						  	   	 							 if(typeof(subCategoryData.officialRating) !="undefined" && subCategoryData.officialRating !=null){ 
						  	   	 							 		
					  	   	 							 		if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){ 
					  	   	 							 			ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId, formContentId);   
					  	   	 							 			subCategoryObject.subCategoryComment.push(ratingObject);
					  	   	 									} 
					  	   	 							 		
					  	   	 							 		currentRatingValue = getCurrentRating(subCategoryData.officialRating)*weightValue; 
					  	   	 							 		
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
					  	   	 							 				
					  	   	 							 			}else if(ratingCategory=="finalAssesment"){
					  	   	 							 				subCategoryObject.subCategoryFinalAssessment = currentRatingValue;
					  	   	 							 				subCategoryObject.subCategoryFinalAssessmentCount=weightValue;
					  	   	 							 				
					  	   	 							 				if(mainCategoryObject.finalAssessment!=""){
						  	   	 							 			  selfRatingValue = parseFloat(mainCategoryObject.finalAssessment);
							  	   	 							 		} 
							  	   	 							 			
							  	   	 							 		mainCategoryObject.finalAssessment = selfRatingValue + currentRatingValue;
								  	   	 							 	if(mainCategoryObject.finalAssessmentCount!=""){
								  	   	 							 	  mainCategoryObject.finalAssessmentCount = parseFloat(mainCategoryObject.finalAssessmentCount)+weightValue;
								  	   	 							 	}else{
								  	   	 							 		mainCategoryObject.finalAssessmentCount =weightValue;
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
															var itemFilterBySubCategory = jsonPath(goalsCategory.categories[categoryArrayIndex].subCateogry,'$..[?(@.subCategoryName=="'+subCategoryData.name.replace(/,/g , '')+'")]');
															if((itemFilterBySubCategory) && itemFilterBySubCategory.length>0){
																$.each(goalsCategory.categories[categoryArrayIndex].subCateogry,function(itemIndex,subCategoryItem){
																	if(subCategoryData.name.replace(/,/g , '') == subCategoryItem.subCategoryName) {
																		subItemIndex =itemIndex;
																		return false;
																	}	
																}); 
																
																 /*sub cateogry others rating comment*/
																 if(typeof subCategoryData.othersRatingComment !="undefined" && subCategoryData.othersRatingComment !=null && subCategoryData.othersRatingComment.results.length>0){
							  	   	 							 	$.each(subCategoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){  
							  	   	 									if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
							  	   	 										ratingObject = getRatingObject(otherRatingData,currentUserId, formContentId);   
							  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryComment.push(ratingObject);
							  	   	 							 			goalsCategory.categories[categoryArrayIndex].comments.push(ratingObject); 
							  	   	 							 		}  
							  	   	 							 	}); 
							  	   	 							}  
								  	   	 							 
								  	   	 						 if(typeof subCategoryData.officialRating !="undefined" && subCategoryData.officialRating !=null){    
					  	   	 										
					  	   	 										if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){
					  	   	 											ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId,formContentId);   
					  	   	 											goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryComment.push(ratingObject); 
					  	   	 										} 
							  	   	 							  
							  	   	 							 	if(subCategoryData.officialRating.rating!=null && subCategoryData.officialRating.rating!=""){
							  	   	 							 		selfRatingValue=0;
							  	   	 							 		categorySelfRatingValue =0; 
							  	   	 							 		
							  	   	 							 		currentRatingValue = getCurrentRating(subCategoryData.officialRating)*weightValue;
							  	   	 							 		
					  	   	 							 				if(currentRatingValue > 0){
							  	   	 							 		
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
								  	   	 							 		}else if(ratingCategory=="finalAssesment"){
								  	   	 							 		   
										  	   	 							 	if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessment!=""){
									  	   	 							 			selfRatingValue =parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessment); 
									  	   	 							 		}
									  	   	 							 		goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessment = currentRatingValue+selfRatingValue;
									  	   	 							 		if(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessmentCount!="")
									  	   	 							 		{
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessmentCount = parseFloat(goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessmentCount)+weightValue;
									  	   	 							 		}else{
									  	   	 							 			goalsCategory.categories[categoryArrayIndex].subCateogry[subItemIndex].subCategoryFinalAssessmentCount =weightValue;
									  	   	 									}
									  	   	 									
									  	   	 									if(goalsCategory.categories[categoryArrayIndex].finalAssessment!=""){
							  	   	 							 					categorySelfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessment); 
									  	   	 							 		}
								  	   	 							 			goalsCategory.categories[categoryArrayIndex].finalAssessment=categorySelfRatingValue+currentRatingValue;
								  	   	 							 			if(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount!=""){
							  	   	 							 					goalsCategory.categories[categoryArrayIndex].finalAssessmentCount = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount)+weightValue;
								  	   	 							 			}else{
								  	   	 							 				goalsCategory.categories[categoryArrayIndex].finalAssessmentCount =weightValue;
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
							  	   	 							 } 
															}else{
																//new sub category
																subCategoryObject= angular.copy(subCategoryObjectTemplate);
																subCategoryObject.subCategoryId = subCategoryData.itemId;
																subCategoryObject.subCategoryName = subCategoryData.name.replace(/,/g , '');
																subCategoryObject.itemIndex=subCategoryData.itemIndex;
								  	   	 						
								  	   	 						 /*sub cateogry others rating comment*/
																 if(subCategoryData.othersRatingComment !=null && subCategoryData.othersRatingComment.results.length>0){
							  	   	 							 	$.each(subCategoryData.othersRatingComment.results,function(otherRatingIndex,otherRatingData){  
							  	   	 									if(otherRatingData.comment!=null && otherRatingData.comment!=""){ 
							  	   	 										ratingObject = getRatingObject(otherRatingData,currentUserId, formContentId);   
							  	   	 							 			subCategoryObject.subCategoryComment.push(ratingObject);
							  	   	 							 			mainCategoryObject.comments.push(ratingObject); 
							  	   	 							 		}  
							  	   	 							 	}); 
							  	   	 							}  
								  	   	 							 
								  	   	 						if(typeof subCategoryData.officialRating !="undefined" && subCategoryData.officialRating !=null){  
					  	   	 										if(subCategoryData.officialRating.comment!=null && subCategoryData.officialRating.comment!=""){
					  	   	 											ratingObject = getRatingObject(subCategoryData.officialRating,currentUserId, formContentId);   
					  	   	 											subCategoryObject.subCategoryComment.push(ratingObject);
					  	   	 										} 	
							  	   	 							 	if(subCategoryData.officialRating.rating!=null && subCategoryData.officialRating.rating!=""){  
						  	   	 							 			
						  	   	 							 			currentRatingValue = getCurrentRating(subCategoryData.officialRating)*weightValue;
						  	   	 							 			
						  	   	 							 			if(currentRatingValue > 0){
						  	   	 							 			
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
							  	   	 							 			}else if(ratingCategory=="finalAssesment"){ 
							  	   	 							 				subCategoryObject.subCategoryFinalAssessment = currentRatingValue;
							  	   	 							 				subCategoryObject.subCategoryFinalAssessmentCount=weightValue;
							  	   	 							 				
							  	   	 							 				if(goalsCategory.categories[categoryArrayIndex].finalAssessment!=""){
								  	   	 							 			  selfRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessment);
									  	   	 							 		} 
									  	   	 							 			
									  	   	 							 		goalsCategory.categories[categoryArrayIndex].finalAssessment = selfRatingValue + currentRatingValue;
										  	   	 							 	if(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount!=""){
										  	   	 							 	  goalsCategory.categories[categoryArrayIndex].finalAssessmentCount = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount)+weightValue;
										  	   	 							 	}else{
										  	   	 							 		goalsCategory.categories[categoryArrayIndex].finalAssessmentCount =weightValue;
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
								  	   	 						}
								  	   	 							 
								  	   	 						//get the project/engagement name
						  	   	 							 	/*if(typeof subCategoryData.customElement!=undefined && subCategoryData.customElement.results.length>0){
							  	   	 								$.each(subCategoryData.customElement.results,function(customeElementIndex,customElementData){ 
							  	   	 									if(customElementData.elementKey =="project" && customElementData.value!="") {
							  	   	 										goalsCategory.categories[categoryArrayIndex].projectName =customElementData.value;
							  	   	 										//categories[categoryArrayIndex].isCateogry =false;	
							  	   	 										
							  	   	 										if(goalsCategory.raterInfo.length>0){
							  	   	 											$.each(goalsCategory.raterInfo,function(iIndex,dData){
							  	   	 												if(dData.ParticipantId==currentUserId && formContentId == dData.formContentId){
							  	   	 													goalsCategory.raterInfo[iIndex].projectName=customElementData.value;
							  	   	 													return false;
							  	   	 												}
							  	   	 											});
						  	   	 											}  
							  	   	 									}
							  	   	 								});
							  	   	 							}*/
							  	   	 							
							  	   	 							var competenciesProjectName = getProjectName(subCategoryData.customElement);
							  	   	 							if(competenciesProjectName!=""){
							  	   	 								goalsCategory.categories[categoryArrayIndex].projectName =competenciesProjectName;
							  	   	 								
							  	   	 								if(goalsCategory.raterInfo.length>0){
					  	   	 											$.each(goalsCategory.raterInfo,function(iIndex,dData){
					  	   	 												if(dData.ParticipantId==currentUserId && formContentId == dData.formContentId){
					  	   	 													goalsCategory.raterInfo[iIndex].projectName=competenciesProjectName;
					  	   	 												}
					  	   	 											});
					  	   	 										}  
							  	   	 							}
							  	   	 							
							  	   	 							
															   goalsCategory.categories[categoryArrayIndex].subCateogry.push(subCategoryObject);	
															} 
														}   
					  	   	 							
					  	   	 							if(typeof subCategoryData.customElement!="undefined" && subCategoryData.customElement!=null){
						  	   	 							var competencySectionProjectName = getProjectName(subCategoryData.customElement);
						  	   	 							if(competencySectionProjectName!=""){
						  	   	 								mainCategoryObject.projectName =competencySectionProjectName;
						  	   	 								
						  	   	 								if(goalsCategory.raterInfo.length>0){
				  	   	 											$.each(goalsCategory.raterInfo,function(iIndex,dData){
				  	   	 												if(dData.ParticipantId==currentUserId && formContentId == dData.formContentId){
				  	   	 													goalsCategory.raterInfo[iIndex].projectName=competencySectionProjectName;
				  	   	 												}
				  	   	 											});
				  	   	 										}  
						  	   	 							}
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
				  	   	 	
					   var getCustomSection = function(customSection,lastModifiedDate,formContentId,status){
					   	  //if(customSection.results.length>0 && status==3){
					   	  if(customSection.results.length>0){
					   	  	$.each(customSection.results,function(n,d){
					   	  		quantitativeTemplate = angular.copy(quantitativeTemplate); 
					   	  		if(d.sectionName!=null && d.sectionName.trim()!="" && (d.sectionName!=null && d.sectionName.trim().toLowerCase()=="gter" 
					   	  																|| d.sectionName!=null && d.sectionName.trim().toLowerCase() =="global sales and pipeline"
					   	  																|| d.sectionName!=null && d.sectionName.trim().toLowerCase() =="global margin") 
					   	  																){
						   	  		quantitativeTemplate.metricsName = d.sectionName;
						   	  		quantitativeTemplate.lastModifiedDate = lastModifiedDate;
						   	  		quantitativeTemplate.formContentId =formContentId; 
						   	  		
						   	  		if(typeof d.othersRatingComment!="undefined" && d.othersRatingComment!=null && d.othersRatingComment.results.length>0){
						   	  			$.each(d.othersRatingComment.results,function(i,c){
						   	  				quantitativeTemplate.comment = c.comment;
						   	  			});
						   	  		}
						   	  		
						   	  		if(quantitativeTemplate.comment.trim()!=""){
						   	  			goalsCategory.quantitative.push(quantitativeTemplate);
						   	  		}
					   	  		}
					   	  	});
					   	  }
					   };		 	
						 
						var getFinalizationSection = function(finalizationSection,lastModifiedDate,formContentId,status){
						   	  if(finalizationSection.overallCompRating){
						   	  	if(finalizationSection.overallCompRating.rating){ 
						   	  		
						   	  	 	var finalAssesmentRating = finalizationSection.overallCompRating.rating; 
						   	  		var categoryArrayIndex=0;
						   	  		var finalAssessmentRatingValue =0;
						   	  		  
						   	  		var isCategoryExists = jsonPath(goalsCategory.categories,'$..[?(@.categoryName=="'+ AppConstants.FINAL_ASSESSMENT_CATEGORY_NAME+'")]');
									if(isCategoryExists){
										$.each(goalsCategory.categories,function(index,data){
						   	  		   		if(data.categoryName === AppConstants.FINAL_ASSESSMENT_CATEGORY_NAME){ 
						   	  		   			categoryArrayIndex = index;
						   	  		   			return false;
						   	  		   		}
						   	  			}); 
  					 				
  					 				if(goalsCategory.categories[categoryArrayIndex].finalAssessment!=""){
  						 			  finalAssessmentRatingValue = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessment);
  							 		} 
  					 			 	
  							 		goalsCategory.categories[categoryArrayIndex].finalAssessment = parseFloat(finalAssessmentRatingValue) + parseFloat(finalAssesmentRating);
 	 							 	if(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount!==""){
 	 							 	  goalsCategory.categories[categoryArrayIndex].finalAssessmentCount = parseFloat(goalsCategory.categories[categoryArrayIndex].finalAssessmentCount)+weightValue;
 	 							 	}else{
 	 							 		goalsCategory.categories[categoryArrayIndex].finalAssessmentCount =1;
 	 							 	}  
								 } 
						   	   }
						   	}
					   };		 	
						 
						 
						 
				  		function requestFormContentResult(fnCallBack,inputParameter){
				  			
				  			var IsFeedbackExists = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.FEEDBACK_TEXT);
		  	   	   			var IsInterimExists = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.INTERIM_TEXT);
		  	   	   			var IsSelfAssessmentExists = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.SELF_ASSESSMENT_TEXT);
		  	   	   			var IsYearEndExists = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.QERM_YEAR_END_TEXT);
	  	   	   				var IsFinalizationExists = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.FINALIZATION_TEXT);
				  			
				  	   	    return fnCallBack.then(function(){
				  	   	    		iCount++;
				  	   	    		
				  	   	    		console.log("Increment111 : " + iCount); 
				  	   	    		//return 	sfDataService.getDashboardData1(inputParameter.formDataId,inputParameter.formContentId);
				  	   	    	 	if((IsFeedbackExists) && (!IsInterimExists)){
		             	 				return 	sfDataService.getDashboardData_feedback(inputParameter.formDataId,inputParameter.formContentId);
				  	   	    		 } 
				  	   	    		
									if(IsSelfAssessmentExists || IsFinalizationExists){
			             				return 	sfDataService.getDashboardData_self_Interim(inputParameter.formDataId,inputParameter.formContentId);
				  	   	    		}
				  	   	    		
				  	   				if(IsYearEndExists){
		             					return sfDataService.getDashboardData_self_Interim(inputParameter.formDataId,inputParameter.formContentId);
				  	   	    		}
				  	   	    		
	             		 	}).then(function(response){
				  	   	 if(typeof response!=="undefined" && response.results.length>0){  
				  	   	 
				  	   	 	$.each(response.results,function(index,data){   
				  	   	 	  
				  	   	 	  	var subjectUserId="";  
				  	   	 	  	var formContentId="";
				  	   	 	  	var formContentStatus="";
				  	   	 	  	var currentUserId="";
				  	   	 	  	var categorySection;
				  	   	 	  	var customSections;
				  	   	 	  	
				  	   	 	  	//get the formcontent id and status from the input parameter  
				  	   	 	    formContentId =data.formContentId;  
				  	   	 	    formContentStatus = data.status; 
				  	   	 		subjectUserId =inputParameter.formSubjectId;   
								goalsCategory.formTitle=inputParameter.formTitle;  
								
								var weightValue=1;
								if(IsSelfAssessmentExists  || IsFinalizationExists){ 
									var formType = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.SELF_ASSESSMENT_FORM_TYPE_TEXT)
									if(formType){
										goalsCategory.selfFormType="A";  
									}else{
										goalsCategory.selfFormType="B";  
									}
									
									form360RatersObject=angular.copy(form360RatersObjectTemplate);
 	 								form360RatersObject.ParticipantName=$rootScope.session.userModel.displayName;
									form360RatersObject.Weight="Self";
									form360RatersObject.JobTitle= $rootScope.session.userModel.rankDesc;
									form360RatersObject.ParticipantId=subjectUserId;
									form360RatersObject.ParticipantRatingStatus="Completed"; 
									form360RatersObject.formContentId = formContentId; 
									form360RatersObject.lastModifiedDate = data.lastModifiedDate; 
									goalsCategory.raterInfo.push(form360RatersObject);
									
									categorySection = data.pmReviewContentDetail.results[0].competencySections;
									getCompetencySection(categorySection,3,currentUserId,subjectUserId,formContentId,weightValue,inputParameter.formTitle);
									
									if(typeof data.pmReviewContentDetail.results[0].customSections!="undefined" && data.pmReviewContentDetail.results[0].customSections!=null){
										customSections = data.pmReviewContentDetail.results[0].customSections; 
										getCustomSection(customSections,data.lastModifiedDate,formContentId,data.status);
									} 
								   
									if(typeof data.pmReviewContentDetail.results[0].objCompSummarySection!="undefined" && data.pmReviewContentDetail.results[0].objCompSummarySection!=null){
										finalizationSections = data.pmReviewContentDetail.results[0].objCompSummarySection; 
										getFinalizationSection(finalizationSections,data.lastModifiedDate,formContentId,data.status);
									}
								
								}
								if(IsYearEndExists){
									
									var yearEndFormType = Util.isFormFoundwithTitle(inputParameter.formTitle,AppConstants.YEAR_END_FORM_TYPE_TEXT)
									if(yearEndFormType){
										goalsCategory.yearEndQERMFormType="A";  
									}else{
										goalsCategory.yearEndQERMFormType="B";  
									}
									
									categorySection = data.pmReviewContentDetail.results[0].competencySections;
									getCompetencySection(categorySection,3,currentUserId,subjectUserId,formContentId,weightValue,inputParameter.formTitle);
								}
								if((IsFeedbackExists) && (!IsInterimExists)){
			  	   	 				if(typeof data.form360ReviewContentDetail!="undefined" && data.form360ReviewContentDetail.results.length>0){ 
			  	   	 					//form360 rater detail
			  	   	 					var form360RaterSection = data.form360ReviewContentDetail.results[0].form360RaterSection;
			  	   	 				
			  	   	 					if(typeof form360RaterSection!="undefined" && form360RaterSection!=null){
			  	   	 						
			  	   	 						if(typeof form360RaterSection.form360Raters!=null && form360RaterSection.form360Raters.results.length>0){
			  	   	 							 
				  	   	 							$.each(form360RaterSection.form360Raters.results,function(raterIndex,raterData){
				  	   	 								form360RatersObject=angular.copy(form360RatersObjectTemplate);
				  	   	 								form360RatersObject.ParticipantName=raterData.participantName;
														form360RatersObject.Weight=raterData.category;
														form360RatersObject.JobTitle=raterData.jobTitle;
														form360RatersObject.ParticipantId=raterData.participantID;
														form360RatersObject.ParticipantRatingStatus=raterData.participantRatingStatus;
														form360RatersObject.category=raterData.category;
														form360RatersObject.formContentId = raterData.formContentId; 
														//raterInfo.push(form360RatersObject);	
	
														if(goalsCategory.raterInfo.length>0){
															var formContentRaterSection = jsonPath(goalsCategory.raterInfo,'$..[?(@.formContentId=='+raterData.formContentId+')]');
															if(!formContentRaterSection){
																goalsCategory.raterInfo.push(form360RatersObject);
															}
			  	   	 							  		}else{
			  	   	 							  			goalsCategory.raterInfo.push(form360RatersObject);
			  	   	 							  		}
														
				  	   	 							}); 
	 					 
			  	   	 							//get current UserId for the form contents 
			  	   	 							var formContentRaterSection = jsonPath(form360RaterSection.form360Raters.results,'$..[?(@.formContentId=='+ formContentId+')]');
			  	   	 							if((formContentRaterSection)&&formContentRaterSection.length>0){
		  	   	 									$.each(formContentRaterSection,function(raterIndex,raterData){
		  	   	 										currentUserId = raterData.participantID;   
		  	   	 										var weightText = raterData.category.toLowerCase();
		  	   	 										weightValue = parseInt($rootScope.session.userModel.feedbackType[weightText]); 
		  	   	 									}); 
			  	   	 							}
			  	   	 						}
			  	   	 					} 
			  	   	 					
			  	   	 					if(goalsCategory.raterInfo.length>0){
			  	   	 						$.each(goalsCategory.raterInfo,function(raterIndex,raterData){
			  	   	 							if(raterData.ParticipantId == currentUserId && formContentId == raterData.formContentId){
			  	   	 								goalsCategory.raterInfo[raterIndex].lastModifiedDate = data.lastModifiedDate;
			  	   	 							}
			  	   	 						});
			  	   	 					}  
			  	   	 					
			  	   	 					if($rootScope.session.userModel.userType == "PPEDD" && subjectUserId != currentUserId){
			  	   	 						categorySection = data.form360ReviewContentDetail.results[0].competencySections;
			  	   	 						getCompetencySection(categorySection,formContentStatus,currentUserId,subjectUserId,formContentId,weightValue,inputParameter.formTitle); 
			  	   	 						
			  	   	 						customSections = data.form360ReviewContentDetail.results[0].customSections;
			  	   	 					
			  	   	 						if(typeof customSections!= "undefined" && customSections!=null){
			  	   	 							getCustomSection(customSections,data.lastModifiedDate,formContentId,data.status);
			  	   	 						}
			  	   	 						
			  	   	 					}else{
			  	   	 						categorySection = data.form360ReviewContentDetail.results[0].competencySections;
			  	   	 						getCompetencySection(categorySection,formContentStatus,currentUserId,subjectUserId,formContentId,weightValue,inputParameter.formTitle); 
			  	   	 						
			  	   	 						customSections = data.form360ReviewContentDetail.results[0].customSections;
			  	   	 					
			  	   	 						if(typeof customSections!="undefined" && customSections!=null){
			  	   	 							getCustomSection(customSections,data.lastModifiedDate,formContentId,data.status);
			  	   	 						}
			  	   	 					}
			  	   	 					
			  	   	 					 
			  	   	 				}  
								}  
				  	   	 	});   
				  	   	 	
				  	   	 	if(iCount == headerResponse.length && goalsCategory.categories.length>0){ 
	  	   	 					dashBoardData.push(goalsCategory);	
	  	   	 					console.log(dashBoardData);
	  	   	 				} 
				  	   	 }  
			  			}).catch(function(err){
			  				console.log("error : " + err);
			  	   			deferred.reject(err);  
			  			}); 
				  	   } 
				  	   
				  	  		  	   	 	
				  	   
				  		headerResponse.reduce(requestFormContentResult,Promise.resolve()).then(function(){ 
	             		 	deferred.resolve(dashBoardData);   
	             		 });
	             		 
	             	return deferred.promise; 
				  } 
				};
			}]);