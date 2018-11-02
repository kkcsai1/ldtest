'use strict';

myApp.factory('Connection', ["$q", "$rootScope", "$http", "$location", "AppConstants", "UserModel", "Util", function ($q, $rootScope, $http, $location, AppConstants, UserModel, Util) {

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

    resetCache: function () {
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
     },  
     //getAppConstant
    getAppMessages: function (successCallback, errorCallback) {
         $http.get(AppConstants.BASE_URI + AppConstants.URI_APP_MESSAGES, AppConstants.HTTP_CONFIG).
             success(function (data, status, headers, config) {
                 Util.logVerbose('getAppMessages:SUCCESS');
                 Util.logVerbose(data);
                 if (successCallback && typeof (successCallback) === "function") {
                     successCallback(data);
                 } else {
                     Util.logWarning('getAppMessages: successCallback not defined.');
                 }

             }).
             error(function (data, status, headers, config) {
                 Util.logVerbose("getAppMessages:ERROR");
                 Util.logError('getAppMessages: ' + data);
                 if (status === 501 && errorCallback && typeof (errorCallback) === "function") {
                     errorCallback(data);
                 } else {
                     $rootScope.headersTest = headers;
                     $rootScope.dataTest = data;
                     $rootScope.statusTest = status;
                     $location.path("/servererror");
                     Util.logWarning('getAppMessages: errorCallback not defined.');
                 }

             });
     },  
 
    GetReport: function (params, successCallback, errorCallback) {
        var url = AppConstants.BASE_URI + "/ReportViewer/LEAD_ReportViewer.aspx?ReportTypeID=" + params.ReportTypeID;
        delete params["ReportTypeID"];
        //$http.post(AppConstants.BASE_URI + "/ReportViewer/LEAD_ReportViewer.aspx?RptID=1", "reportParameters=" + JSON.stringify(params), {
        //    contentType: "x-www-form-urlencoded",
        //    withCredentials: true,
        //    responseType: 'arraybuffer'
        //}).
        $http({
            method: 'POST',
            responseType: 'arraybuffer',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { "reportParameters": JSON.stringify(params) }
        }).
            success(function (data, status, headers, config) {

                Util.logVerbose('exportReport:SUCCESS');

                Util.downloadFile(data, status, headers);
                

                if (successCallback && typeof (successCallback) === "function") {
                    successCallback(data);
                } else {
                    Util.logWarning('exportReport: successCallback not defined.');
                }

            }).
            error(function (data, status, headers, config) {

                Util.logVerbose("exportReport:ERROR");
                Util.logError('exportReport: ' + data);
                if (status === 501 && errorCallback && typeof (errorCallback) === "function") {
                    errorCallback(data);
                } else {
                    $rootScope.headersTest = headers;
                    $rootScope.dataTest = data;
                    $rootScope.statusTest = status;
                    $location.path("/servererror");
                    Util.logWarning('exportReport: errorCallback not defined.');
                }

            });
    }, 
    
    printFbYouProvided: function (printOptions) {
         var url = AppConstants.BASE_URI + AppConstants.URI_PRINTFBYOUPROVIDED;

         var defered = $q.defer();
         $http.post(url, printOptions).then(function (response) {
             defered.resolve(response);
         }, function (xhr) {
             defered.reject(xhr);
         });

         return defered.promise;
     },

    printFbAboutYou: function (printOptions) {
         var url = AppConstants.BASE_URI + AppConstants.URI_PRINTFBABOUTYOU;

         var defered = $q.defer();
         $http.post(url, printOptions).then(function (response) {
             defered.resolve(response);
         }, function (xhr) {
             defered.reject(xhr);
         });

         return defered.promise;
     }, 
    dashboardMetricsData: function (params,successCallback, errorCallback) {
         //var url = AppConstants.BASE_URI + AppConstants.URI_DASHBOARD_METRICS_DATA;
         var url = AppConstants.BASE_URI+AppConstants.URI_DASHBOARD_METRICS_DATA;
         //url = "http://localhost:28183/api/metrics.json";

         $http.post(url, params, AppConstants.HTTP_CONFIG).
         //$http.get(url, AppConstants.HTTP_CONFIG).
         success(function (data, status, headers, config) {

            vm._searchCountryFilters = angular.copy(data);
            Util.logVerbose('getMetricsData:SUCCESS');
            Util.logVerbose(data);
            if (successCallback && typeof (successCallback) === "function") {
                successCallback(data);
            } else {
                Util.logWarning('getMetricsData: successCallback not defined.');
            }

        }).
        error(function (data, status, headers, config) {

            if (status === 501 && errorCallback && typeof (errorCallback) === "function") {
                errorCallback(data);
            } else {
                $rootScope.headersTest = headers;
                $rootScope.dataTest = data;
                $rootScope.statusTest = status;
                $location.path("/servererror");
                Util.logWarning('getMetricsData: errorCallback not defined.');
            }

        });
     } 
 }

}]);