'use strict';

myApp.factory('dashboardSFService', ["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", 
			function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util) {

 var vm = this;
 vm._channelTypes = [];
 vm._funcAbbreviations = [];
 vm._channelConfiguration = [];
 vm._disclaimerAgreements = [];
 vm._searchFilters = [];
 vm._searchAreaFilters = [];
 vm._searchRegionFilters = [];
 vm._searchCountryFilters = [];
 vm._searchStateFilters = [];
 vm._searchServiceLineFilters = [];
 vm._searchSubServiceLineFilters = [];

 return {
     dashboardMetricsData: function (params,successCallback, errorCallback) {
         //var url = AppConstants.BASE_URI + AppConstants.URI_DASHBOARD_METRICS_DATA;
        // var url = AppConstants.BASE_URI+AppConstants.URI_DASHBOARD_METRICS_DATA;
         var url = AppConstants.METRICS_URL_AZURE;
         //url = "http://localhost:28183/api/metrics.json";

         //$http.post(url, params, AppConstants.HTTP_CONFIG_AZURE).
         //$http.get(url).
         
        var counseleeGUI = "";
        if($rootScope.windowsLoggedInUser != AppConstants.LOGGED_IN_USER ){
        	counseleeGUI = "/"+AppConstants.LOGGED_IN_USER;
        	if(AppConstants.PPEDD_MBM_DISABLE_FOR_COUNSELEE){
        		errorCallback("counselee_view");
        		return false;
        	}
        }
         
        url = url + counseleeGUI + "?domain_hint=ey.net";
         
		 var settings = {
			"async": true,
			"crossDomain": true,
			"url": url,
			"method": "GET",
			"headers": {
			"Authorization": "Bearer " + sessionStorage.getItem('id_token'),
			"Cache-Control": "no-cache"
			}
		}
		
		jQuery.ajax(settings).done(function (response) {
	        Util.logVerbose('getMetricsData:SUCCESS');
            Util.logVerbose(response);
            if (successCallback && typeof (successCallback) === "function") {
                successCallback(response);
            } else {
                Util.logWarning('getMetricsData: successCallback not defined.');
            }
		
		}).fail(function( jqXHR, textStatus, errorThrown ) {
					  //if (status === 501 && errorCallback && typeof (errorCallback) === "function") {
		     //           errorCallback(data);
		     //       } else {
		     //           $rootScope.headersTest = headers;
		     //           $rootScope.dataTest = data;
		     //           $rootScope.statusTest = status;
		     //           //$location.path("/servererror");
		                errorCallback(errorThrown);
		                Util.logWarning('getMetricsData: errorCallback not defined.');
		     //       }
		});
    
     },
     
      dashboardTopEngagementHours: function (params,successCallback, errorCallback, selectedYear, selectedCycleDate) {
        
        var url = AppConstants.TOP_ENGAGEMENTS_URL_AZURE;
        selectedYear = selectedYear.replace("FY", "");
        
       var counseleeGUI = "";
        if($rootScope.windowsLoggedInUser != AppConstants.LOGGED_IN_USER ){
        	counseleeGUI = "/"+AppConstants.LOGGED_IN_USER;
        	if(AppConstants.NONPPEDD_TOP_ENGAGEMENT_DISABLE_FOR_COUNSELEE){
        		errorCallback("counselee_view");
        		return false;
        	}
        }
        
        url = url + "/20"+selectedYear+"/"+selectedCycleDate+"/"+ AppConstants.TOP_ENGAGEMENT_HOURS_ROWS + counseleeGUI +"?domain_hint=ey.net";
       	
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": url,
			"method": "GET",
			"headers": {
			"Authorization": "Bearer " + sessionStorage.getItem('id_token'),
			"Cache-Control": "no-cache"
			}
		}
		
		jQuery.ajax(settings).done(function (response) {
	        Util.logVerbose('getTopEngagementData:SUCCESS');
            Util.logVerbose(response);
            if (successCallback && typeof (successCallback) === "function") {
                successCallback(response);
            } else {
                Util.logWarning('getTopEngagementData: successCallback not defined.');
            }
		
		}).fail(function(jqXHR, textStatus, errorThrown) {
		                errorCallback(jqXHR.status);
		                Util.logWarning('getMetricsData: errorCallback not defined.');
		});
     },
      
      getPeerAverage: function (successCallback, errorCallback, year, gui) {
        
        year = "20"+year.slice(-2);
       
        /*enable security code starts here*/
        if(AppConstants.PEER_GROUP_SECURITY === true){
            var counseleeGUI = "";
	        if($rootScope.windowsLoggedInUser != AppConstants.LOGGED_IN_USER ){
	        	counseleeGUI = "/"+AppConstants.LOGGED_IN_USER;
	        }
	        var url = AppConstants.PEER_AVERAGE + "/" + year + counseleeGUI + "?domain_hint=ey.net";
        } else{
            /*enable security code ends here*/
	        /*disable security code starts here*/
	        var url = AppConstants.PEER_AVERAGE + "/" + year + "/" + gui + "?domain_hint=ey.net";
	        /*disable security codes ends here*/
        }
        
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": url,
			"method": "GET",
			"headers": {
			"Authorization": "Bearer " + sessionStorage.getItem('id_token'),
			"Cache-Control": "no-cache"
			}
		}
		
		jQuery.ajax(settings).done(function (response) {
	        Util.logVerbose('getPeerAverageSuccess:SUCCESS');
            Util.logVerbose(response);
            if (successCallback && typeof (successCallback) === "function") {
                successCallback(response);
            } else {
                Util.logWarning('getPeerAverageData: successCallback not defined.');
            }
		
		}).fail(function(jqXHR, textStatus, errorThrown) {
		                errorCallback(jqXHR);
		                Util.logWarning('getPeerAverage: errorCallback not defined.');
		});
     }
     
     
  //   getPeerAverage: function (successCallback, errorCallback, year, gui) {
        
		// // var settings = {
		// // 	"async": true,
		// // 	"crossDomain": true,
		// // 	"url": url,
		// // 	"method": "GET",
		// // 	"headers": {
		// // 	"Authorization": "Bearer " + sessionStorage.getItem('id_token'),
		// // 	"Cache-Control": "no-cache"
		// // 	}
		// // }
		
		// year = "20"+year.slice(-2);
		
		// var response  =[{"CycleData":[{"CategoryName":"Peer Group[Peer Group Path]","Value":"Area=Executive>>ManagementRegion=Business Enablement>>Rank=Partner/Principal >>Tenure in Rank=11+"},{"CategoryName":"[AWF-Connected]","Value":"7"},{"CategoryName":"[AWF-Responsive]","Value":"3"},{"CategoryName":"[AWF-Insightful]","Value":"6"},{"CategoryName":"[AWF-RightMix]","Value":"1"},{"CategoryName":"[AWF-Teaming]","Value":"4"},{"CategoryName":"[AWF-HighestPerformingTeams]","Value":"7"},{"CategoryName":"[AWF-ECS]","Value":"5.3333"},{"CategoryName":"[AWF-PET]","Value":"4"},{"CategoryName":"[AWF-Quality]","Value":"7.0"},{"CategoryName":"[AWF-Client]","Value":"6.0"},{"CategoryName":"[AWF-Team]","Value":"5.0"},{"CategoryName":"[AWF-Personal]","Value":"1.0"},{"CategoryName":"[AWF-Business]","Value":"4.0"},{"CategoryName":"[AWF-Recommendation]","Value":"3.0"},{"CategoryName":"[AWF-Engagement]","Value":"2.0"}],"Cyclestart":"2017-10-01T00:00:00","CycleEnd":"2017-12-31T00:00:00"},{"CycleData":[{"CategoryName":"Peer Group[Peer Group Path]","Value":"Area=Executive>>ManagementRegion=Business Enablement>>Rank=Partner/Principal >>Tenure in Rank=11+"},{"CategoryName":"[AWF-Connected]","Value":"7"},{"CategoryName":"[AWF-Responsive]","Value":"3"},{"CategoryName":"[AWF-Insightful]","Value":"6"},{"CategoryName":"[AWF-RightMix]","Value":"1"},{"CategoryName":"[AWF-Teaming]","Value":"4"},{"CategoryName":"[AWF-HighestPerformingTeams]","Value":"7"},{"CategoryName":"[AWF-ECS]","Value":"5.3333"},{"CategoryName":"[AWF-PET]","Value":"4"},{"CategoryName":"[AWF-Quality]","Value":"3.0"},{"CategoryName":"[AWF-Client]","Value":"0.0"},{"CategoryName":"[AWF-Team]","Value":"0.0"},{"CategoryName":"[AWF-Personal]","Value":"0.0"},{"CategoryName":"[AWF-Business]","Value":"0.0"},{"CategoryName":"[AWF-Recommendation]","Value":"4.0"},{"CategoryName":"[AWF-Engagement]","Value":"5.0"}],"Cyclestart":"2018-04-18T00:00:00","CycleEnd":"2018-04-18T00:00:00"}]; 
		
		
		// // jQuery.ajax(settings).done(function (response) {
	 ////       Util.logVerbose('getPeerAverageSuccess:SUCCESS');
  ////          Util.logVerbose(response);
  ////          if (successCallback && typeof (successCallback) === "function") {
		// 	setTimeout( function(){ 
		// 	    successCallback(response);
		// 	}  , 10000 );     
                
  ////          } else {
  ////              Util.logWarning('getPeerAverageData: successCallback not defined.');
  ////          }
		
		// // }).fail(function(jqXHR, textStatus, errorThrown) {
		// //                 errorCallback(jqXHR.status);
		// //                 Util.logWarning('getPeerAverage: errorCallback not defined.');
		// // });
  //   }
 	
 }


}]);