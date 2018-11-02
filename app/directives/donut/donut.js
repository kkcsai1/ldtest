/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('donut', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/donut/donut.html'),
        scope: {
                        ytdprogress: "=",
                        peeraverage: "=",
                        selfassesment: "=",
                        finalassessment: "=",
                        enablegreyshade: "=",
                        formtype: "="
        },
        link: function ($scope, elem, attr) {
            $scope.redirectTo = function (url) {
                location.path(url);
            };
			
			$scope.noValues = function (ytdprogress, peeraverage, selfassesment, final_assessment, enableGreyShade) {
				
				//enableGreyShade = mandatory grey shade if all other values are empty only for Q&ERM
				
				
                if(ytdprogress =="" && peeraverage =="" && selfassesment =="" && final_assessment == "" && enableGreyShade == true)
                {
                	return true;
                }
                else{
                    return false;
                }
            };
            
            $scope.ytd_progress = function (ytdprogress) {
                return { 'transform': 'rotate(' + ytdprogress + 'deg)', '-webkit-transform': 'rotate(' + ytdprogress + 'deg)', '-ms-transform': 'rotate(' + ytdprogress + 'deg)' };
            };

            $scope.peer_average = function (peeraverage) {
                return { 'transform': 'rotate(' + peeraverage + 'deg)', '-webkit-transform': 'rotate(' + peeraverage + 'deg)', '-ms-transform': 'rotate(' + peeraverage + 'deg)' };
            };

            $scope.self_assesment = function (selfassesment) {
                return { 'transform': 'rotate(' + selfassesment + 'deg)', '-webkit-transform': 'rotate(' + selfassesment + 'deg)', '-ms-transform': 'rotate(' + selfassesment + 'deg)' };
            };

            $scope.final_assessment = function (final_assessment) {
                return { 'transform': 'rotate(' + final_assessment + 'deg)', '-webkit-transform': 'rotate(' + final_assessment + 'deg)', '-ms-transform': 'rotate(' + final_assessment + 'deg)' };
            };

        }
    }
}]);

//myapp_admin.directive('donut', 'Util', function ($compile, Util) {

//    return {
//        restrict: 'E',

//        scope: {
//            ytdprogress: "=",
//            peeraverage: "=",
//            selfassesment: "="
//        },

//        link: function (scope, element) {

//            scope.$watch("ytdprogress", function (newValue) { //logic is out of template
//                    scope.ytdprogress = newValue;
//            });
//            scope.$watch("peeraverage", function (newValue) { //logic is out of template
//                scope.peeraverage = 0;
//                scope.peeraverage = newValue;
//            });
//            scope.$watch("selfassesment", function (newValue) { //logic is out of template
//                scope.selfassesment = 0;
//                scope.selfassesment = newValue;
//            });
//        },
//        templateUrl: Util.setAppVersion('app/directives/donut/donut.html')
//    };
//});