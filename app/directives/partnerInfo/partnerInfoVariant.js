/* Directive Definition for Partner Info */
(function () {
    var postLink = function (scope, element, attrs, vm) {
        //console.log(JSON.stringify(attrs));
        //console.log($rootScope);
        //console.log(scope.$root);
        console.log(scope.peopleInfo);
    }

    angular.module('myApp').directive('partnerInfoVariant', function () {
        return {
            restrict: 'E'
            , scope: {
                peopleInfo: '='
            }
            , templateUrl: 'app/directives/partnerInfo/partnerInfoVariant-tpl.html'
            , link: postLink
        };
    });

}());