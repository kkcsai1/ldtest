'use strict';

angular.module('myApp.feedback').directive('fbYouProvided', ["Util", "Connection", "$rootScope", function (Util, Connection, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: Util.setAppVersion('app/directives/printPdf/feedbackYouProvided-tpl.html'),
        link: function (scope, elem, attr) {
            var partnerGui = $rootScope.session.userModel.gui;
            // empty the collection.
            scope.fbYouProvidedForPrint.length = 0;
            Connection.getFeedbackYouProvided(partnerGui).then(
                function (response) {
                    if (response.data) {
                        angular.forEach(response.data, function (feedback) {
                            if (feedback.FeedbackDates.length > 0 && !(feedback.FeedbackDates[0] === null)) {
                                feedback.FeedbackDates = feedback.FeedbackDates.map(function (dateItem, index) {
                                    var date = {};
                                    date.date = dateItem;
                                    date.isSelected = index == 0 ? true : false; //date.isSelected = false; //;
                                    return date;
                                });
                                scope.fbYouProvidedForPrint.push(feedback);
                            }
                            else if (feedback.FeedbackProviderGUI == feedback.GUI)
                            {
                                var date = {};
                                date.date = null;
                                date.isSelected = true; //date.isSelected = false; //;

                                feedback.FeedbackDates = [];
                                feedback.FeedbackDates.push(date);
                                scope.fbYouProvidedForPrint.push(feedback);
                            }
                        });
                    }
                    //console.log("angular.module('myApp.feedback').directive -> fbYouProvided Web request succeeded!");
                    // Select recent feedback dates as default
                    //scope.fbYouProvidedSelectionmade("REC");
                }
                , function (xhr) {
                    console.log("angular.module('myApp.feedback').directive -> fbYouProvided Web request failed!");
                }
            );
        }
    };
}]);