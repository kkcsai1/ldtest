'use strict';
/*
    A service that contains utilities functions used in that app
*/

myApp.factory('Util', ["AppConfig", "$http", "$window" , "$log", "$rootScope", "AppMessages", "AppConstants", function (AppConfig, $http, $window, $log, $rootScope, AppMessages, AppConstants) {
    
    return {

        //Logs text based on verbose level
        log: function (logLevel, logText) {
            
            if (AppConfig.logLevel >= logLevel) {
                switch(logLevel){
                  case 1:
                    $log.error(logText);
                  break;  
                  case 2:
                   $log.warn(logText);
                  break; 
                  case 3:
                   $log.log(logText); 
                  break; 
                  default:
                  break;
                }
            }
        },
        //Logs only verbose text
        logVerbose: function (logText) {
            this.log(3, logText);
        },
        //Logs only warning text
        logWarning: function (logText) {
            this.log(2, logText);
        },
        //Logs only error text
        logError: function (logText) {
            this.log(1, logText);
        },
        getRadianFormTypeValue: function (formType, formValue) {
        	var type = "FORM_TYPE_"+formType;
            var radianArr = AppConstants[type];
            
            if(typeof radianArr[Math.floor(formValue)] === "undefined"){
            	 return 0;
            }else{
            	 return radianArr[Math.floor(formValue)];
            }
          
        },
        captureResponseLog: function(res){
        	var obj = {};
        	obj.message = res.message;
        	obj.response = res.response;
        	obj.statusCode = res.response.statusCode;
        	obj.body = res.response.body;
        	obj.statusText = res.response.statusText
        	$rootScope.responseLog.push(obj);
        	console.log($rootScope.responseLog);
        },
        showErrorMessage : function(err){
        	if(err.name == "EvalError" || err.name == "RangeError" || err.name == "ReferenceError" || err.name == "SyntaxError" || err.name == "TypeError"  || err.name == "URIError")
        	{
        		return AppMessages.DASHBOARD_MESSAGES.ERROR.SOME_EXCEPTION_OCCURRED;
        	}
        	if(err.response.statusCode == "500" || err.response.statusCode == "400" || err.response.statusCode == "401" || err.response.statusCode == "504"){
        		//return AppMessages.DASHBOARD_MESSAGES.ERROR.GOALS_NOT_APPROVED;
        		return AppMessages.DASHBOARD_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
        	}else{
        		return AppMessages.DASHBOARD_MESSAGES.ERROR.SOMETHING_WENT_WRONG;
        	}
        },
        commentDirection: function(str){
        		var dir = "ltr";
        		var position = str.search(/[\u0590-\u05FF]/);
				if(position>=0){
					dir = "rtl";
				} 
				return dir;
        },
        
	    getCycleDates : function(year){
	 	   var cycleDates = AppConstants.GENERIC_CYCLE_DATES;
	 	   var singleCycleInfo = [];
	 	   	$.each(cycleDates,function(index,val){
         	 	if(typeof val[year]!="undefined" && val[year].length > 0){
         	 	  singleCycleInfo = val[year];
         	 	}
         	 });
         	 
         	if(singleCycleInfo.length==0){
         		year = "default";
         		$.each(cycleDates,function(index,val){
         	 	if(typeof val[year]!="undefined" && val[year].length > 0){
         	 	  singleCycleInfo = val[year];
         	 	}
         	 });
         	}
         	 
	 	   	return singleCycleInfo;
	    },
	    dateConverter : function(d){
	    	var r = d.split("(");
	    	if(r[1]){
	    	  var u = r[1].split(")");
	    	}
	    	if(u[0]){
	    		return new Date(parseInt(u[0]));
	    	} else {
	    		return "";
	    	}
	    }
        ,downloadFile: function (data, status, headers) {
            var octetStreamMime = 'application/octet-stream';
            var success = false;

            // Get the headers
            headers = headers();

            // Get the filename from the x-filename header or default to "download.bin"
            var filename = "attachment; filename=download";
            filename = headers['content-disposition'] || fileName;
            filename = filename.substring(21);
            // Determine the content type from the header or default to "application/octet-stream"
            var contentType = headers['content-type'] || octetStreamMime;

            try {
                // Try using msSaveBlob if supported
                console.log("Trying saveBlob method ...");
                var blob = new Blob([data], { type: contentType });
                if (navigator.msSaveBlob)
                    navigator.msSaveBlob(blob, filename);
                else {
                    // Try using other saveBlob implementations, if available
                    var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                    if (saveBlob === undefined) throw "Not supported";
                    saveBlob(blob, filename);
                }
                console.log("saveBlob succeeded");
                success = true;
            } catch (ex) {
                console.log("saveBlob method failed with the following exception:");
                console.log(ex);
            }

            if (!success) {
                // Get the blob url creator
                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if (urlCreator) {
                    // Try to use a download link
                    var link = document.createElement('a');
                    if ('download' in link) {
                        // Try to simulate a click
                        try {
                            // Prepare a blob URL
                            console.log("Trying download link method with simulated click ...");
                            var blob = new Blob([data], { type: contentType });
                            var url = urlCreator.createObjectURL(blob);
                            link.setAttribute('href', url);

                            // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                            link.setAttribute("download", filename);

                            // Simulate clicking the download link
                            var event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                            link.dispatchEvent(event);
                            console.log("Download link method with simulated click succeeded");
                            success = true;

                        } catch (ex) {
                            console.log("Download link method with simulated click failed with the following exception:");
                            console.log(ex);
                        }
                    }

                    if (!success) {
                        // Fallback to window.location method
                        try {
                            // Prepare a blob URL
                            // Use application/octet-stream when using window.location to force download
                            console.log("Trying download link method with window.location ...");
                            var blob = new Blob([data], { type: octetStreamMime });
                            var url = urlCreator.createObjectURL(blob);
                            window.location = url;
                            console.log("Download link method with window.location succeeded");
                            success = true;
                        } catch (ex) {
                            console.log("Download link method with window.location failed with the following exception:");
                            console.log(ex);
                        }
                    }

                }
            }

            if (!success) {
                // Fallback to window.open method
                console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                window.open(httpPath, '_blank', '');
            }

        },
        getPeerAverage: function(cycle1, cycle2, type){
        
				var jsonResponse = [
						{
						"Cyclestart": "Date",
						"CycleEnd": "Date",
						"CycleData": [
						{
						"CategoryName": "AWF-Connected",
						"Value": "1"
						},
						{
						"CategoryName": "AWF-Responsive",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Insightful",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-RightMix",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-Teaming",
						"Value": "5"
						},
						{
						"CategoryName": "AWF-HighestPerformingTeams",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-ECS",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-PET",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Quality ",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Client",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Team",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Personal",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Business",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Recommendation",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Engagement",
						"Value": "2"
						},
						{
						"CategoryName": "peerGroupPath",
						"Value": "Area=EMEIA>>Region=Mediterranean>>Country=Italy>>Rank=Assistant"
						}
						]
						},
						{
						"Cyclestart": "Date",
						"CycleEnd": "Date",
						"CycleData": [
						{
						"CategoryName": "AWF-Connected",
						"Value": "1"
						},
						{
						"CategoryName": "AWF-Responsive",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Insightful",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-RightMix",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-Teaming",
						"Value": "5"
						},
						{
						"CategoryName": "AWF-HighestPerformingTeams",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-ECS",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-PET",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Quality ",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Client",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Team",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Personal",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Business",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Recommendation",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Engagement",
						"Value": "2"
						},
						{
						"CategoryName": "peerGroupPath",
						"Value": "Area=EMEIA>>Region=Mediterranean>>Country=Italy>>Rank=Assistant"
						}
						]
						},
						{
						"Cyclestart": "Date",
						"CycleEnd": "Date",
						"CycleData": [
						{
						"CategoryName": "AWF-Connected",
						"Value": "1"
						},
						{
						"CategoryName": "AWF-Responsive",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Insightful",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-RightMix",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-Teaming",
						"Value": "5"
						},
						{
						"CategoryName": "AWF-HighestPerformingTeams",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-ECS",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-PET",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Quality ",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Client",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Team",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Personal",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Business",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Recommendation",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Engagement",
						"Value": "2"
						},
						{
						"CategoryName": "peerGroupPath",
						"Value": "Area=EMEIA>>Region=Mediterranean>>Country=Italy>>Rank=Assistant"
						}
						]
						},
						{
						"Cyclestart": "Date (blank for YTD- EDW to confirm)",
						"CycleEnd": "Date (blank for YTD- EDW to confirm)",
						"CycleData": [
						{
						"CategoryName": "AWF-Connected",
						"Value": "1"
						},
						{
						"CategoryName": "AWF-Responsive",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Insightful",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-RightMix",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-Teaming",
						"Value": "5"
						},
						{
						"CategoryName": "AWF-HighestPerformingTeams",
						"Value": "3"
						},
						{
						"CategoryName": "AWF-ECS",
						"Value": "4"
						},
						{
						"CategoryName": "AWF-PET",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Quality ",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Client",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Team",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Personal",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Business",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Recommendation",
						"Value": "2"
						},
						{
						"CategoryName": "AWF-Engagement",
						"Value": "2"
						},
						{
						"CategoryName": "peerGroupPath",
						"Value": "Area=EMEIA>>Region=Mediterranean>>Country=Italy>>Rank=Assistant"
						}
						]
						}
				];
        
        
        		$(jsonResponse).each(function(key, val){
        			
        		});
        
        },
        //returns the index of element in an array
        findIndex: function (obj, key, value) {
            for (var index = 0; index < obj.length; index++) {
                if (obj[index][key] == value) {
                    return index;
                }
            }
            return -1;
        },
           cloneObject: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
         isEmpty: function (obj) {
            for (var i in obj) if (obj.hasOwnProperty(i)) return false;
            return true;
         },
         setAppVersion: function (path) {
             return path + "?" + LEAD_Version;
         },
         isFormFoundwithTitle : function(formTitle,formType){
         	var isFound = false;
         	var arrayObj;
         	
         	if(formType==AppConstants.FEEDBACK_TEXT){
         	 arrayObj = AppConstants.LANGUAGE_FEEDBACK_TEXT;
         	}
         	
         	if(formType==AppConstants.SELF_ASSESSMENT_TEXT){
         	 arrayObj = AppConstants.LANGUAGE_SELF_ASSESSMENT_TEXT;
         	}
         	
         	if(formType==AppConstants.QERM_YEAR_END_TEXT){
         	 arrayObj = AppConstants.LANGUAGE_QERM_YEAR_END_TEXT;
         	}
         	
         	if(formType==AppConstants.INTERIM_TEXT){
         	 arrayObj = AppConstants.LANGUAGE_INTERIM_TEXT;
         	} 
         	
         	if(formType==AppConstants.SELF_ASSESSMENT_FORM_TYPE_TEXT){
         	 arrayObj = AppConstants.SELF_ASSESSMENT_FORM_TYPE;
         	} 
         	
         	if(formType==AppConstants.YEAR_END_FORM_TYPE_TEXT){
         	 arrayObj = AppConstants.YEAR_END_FORM_TYPE;
         	} 
         	
         	if(formType==AppConstants.FINALIZATION_TEXT){
         	 arrayObj = AppConstants.LANGUAGE_FINALIZATION_TEXT;
         	} 
         	
         	 if(arrayObj!=undefined && arrayObj.length>0){
         	 	$.each(arrayObj,function(index,val){
         	 		var v = val.value.replace("%26", "&");
         	 		if(formTitle.toLowerCase().indexOf(v.toLowerCase())!=-1){
         	 			isFound = true;
         	 			return;
         	 		}	
         	 	});
         	 }
         	 return isFound;
         }
	};

}]);

//Should move to factorey later
(function (window) { // Prevent Cross-Frame Scripting attacks
    if (window.location !== window.top.location)
        window.top.location = window.location;
})(this);