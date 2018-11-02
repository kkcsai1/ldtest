/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('dashboardAccordion', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/dashboard/dashBoardAccordion.html'),
        scope: {
            serviceline: "=",
            rolename: "=",
            marketsegment: "=",
            open: "=",
            click : "&onClick"
            
        },
        link: {
         pre:   function ($scope, elem, attr) {
                $scope.arrowClass = { slidedown: true };
                $scope.arrowClass.slidedown = $scope.open;
                $scope.redirectTo = function (url) {
                    location.path(url);
                },
                $scope.onclick = function () {
                    elem.parent().children('.tree').toggle(300);
                    //elem.toggleClass('slidedown');
                    $scope.arrowClass.slidedown = !$scope.arrowClass.slidedown;
                    if (!angular.isUndefined($scope.click)) {
                        $scope.click();
                    }
                }
         },
         post: function ($scope, elem, attr)
         {
             if ($scope.open === true) {
                 $scope.arrowClass.slidedown = false;
                 $scope.onclick();
             }
         }
        }
    }
}]);
