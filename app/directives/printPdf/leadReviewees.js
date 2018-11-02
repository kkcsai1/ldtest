'use strict';

myapp_feedback.directive('leadReviewees', ["Util", "Connection", "$rootScope", "revieweeService", function (Util, Connection, $rootScope, revieweeService) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/printPdf/leadReviewees-tpl.html'),
        link: function (scope, elem, attr) {
            var partnerGui = $rootScope.session.userModel.gui;
            // empty the collection
            scope.leadRevieweesForPrint.length = 0;
           
            angular.forEach(revieweeService.getRevieweeList(), function (reviewees) {
                scope.leadRevieweesForPrint.push(reviewees);
            });            
        }
    };
}]);


