/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('footer', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/footer/footer.html'),
        link: function ($scope, elem, attr) {
            $scope.redirectTo = function (url) {
                location.path(url);
            }
        }
    }
}]);
