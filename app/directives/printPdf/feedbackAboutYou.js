'use strict';

angular.module('myApp.feedback').directive('fbAboutYou', ["Util", "Connection", "$rootScope", function (Util, Connection, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/printPdf/feedbackAboutYou-tpl.html'),
        link: function (scope, elem, attr) {
            var partnerGui = $rootScope.session.userModel.gui;
            // empty the collection
            scope.fbAboutYouForPrint.length = 0;
            Connection.getFeedbackAboutYou(partnerGui).then(
                function (response) {
                    if (response.data) {
                        angular.forEach(response.data, function (feedback) {
                            if (feedback.FeedbackDates.length > 0 && !(feedback.FeedbackDates[0] === null)) {
                                feedback.FeedbackDates = feedback.FeedbackDates.map(function (dateItem, index) {
                                    var date = {};
                                    date.date = dateItem;
                                    date.isSelected = index == 0 ? true: false; //date.isSelected = false
                                    return date;
                                });
                                scope.fbAboutYouForPrint.push(feedback);
                            }
                            
                        });
                    }
                    //console.log("angular.module('myApp.feedback').directive -> fbAboutYou Web request succeeded!");
                    // Select recent feedback dates as default
                    //scope.fbAboutYouSelectionmade("REC");
                }
                , function (xhr) {
                    console.log("angular.module('myApp.feedback').directive -> fbAboutYou Web request failed!");
                }
            );
        }
    };
}]);