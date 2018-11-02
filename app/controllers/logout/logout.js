// // Here goes the javascript to deactivate or prevent browser back button navigation
//var history_api = typeof history.pushState !== 'undefined';
// // history.pushState must be called out side of AngularJS Code
// // After the # you should write something, do not leave it empty
//if (history_api) history.pushState(null, '', '#StayHere');  

myApp.controller('logoutController', ['$rootScope', '$location', '$scope', '$route', function ($rootScope, $location, $scope, $route) {

    $scope.throughLink = false;

    $rootScope.goHome = function () {
        //$route.reload();
        $scope.throughLink = true;
        $location.path('/home');
    }

    $scope.$on('$locationChangeStart', function (event, next, current) {
        // Prevent the browser going back. But allow to navigate if the user clicks the link
        if (!$scope.throughLink) {
            event.preventDefault();
        }        
    });

}]);