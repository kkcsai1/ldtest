/* Admin directives will be defined here  */
'use strict';
angular.module('myApp').directive('commentsNonPpedd', ['$location', 'Util', function (location, Util) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/dashboard/dashboard-comments-non-ppedd.html'),
        scope: {
           data: "="
        },
        link: {
         pre:   function ($scope, elem, attr) {
               
         },
         post: function ($scope, elem, attr)
         {
         }
        }
    }
}]);