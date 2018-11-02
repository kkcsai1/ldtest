'use strict';

myapp_feedback.directive('qualityReviewees', ["Util", "Connection", "$rootScope", "revieweeService", function (Util, Connection, $rootScope, revieweeService) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/printPdf/qualityReviewees-tpl.html'),
        link: function (scope, elem, attr) {
            var partnerGui = $rootScope.session.userModel.gui;
            // empty the collection
            scope.qualityRevieweesForPrint.length= 0;
           
            angular.forEach(revieweeService.getQualityRevieweeList(), function (reviewees) {
                if (reviewees.WorkflowStatusDescr == "Completed")
                    scope.qualityRevieweesForPrint.push(reviewees);
            });            
        }
    };
}]);


