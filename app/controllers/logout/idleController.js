'use strict';
myApp.controller('idleController', ["$rootScope", "$scope", "Session", "AppConstants", "AppMessages", "Idle", "Keepalive", "$uibModal", "$location","Util", function ($rootScope, $scope, Session, AppConstants, AppMessages, Idle, Keepalive, $uibModal, $location,Util) {
 
   	$scope.started = true;

    function closeModals() {
        if ($scope.warning) {
          $scope.warning.close();
          $scope.warning = null;
        }
      }

    $scope.$on('IdleStart', function () {
        closeModals();
          $scope.warning = $uibModal.open({
              templateUrl: Util.setAppVersion('/app/views/logout/timeoutWarning-tpl.html'),
          windowClass: 'modal-danger'
        });
      });

    $scope.$on('IdleEnd', function () {
        closeModals();
      });

      $scope.$on('IdleTimeout', function() {
        closeModals();
        $location.path("/logout");
        $rootScope.sessionTimedOut = true;
      });

      $scope.start = function() {
        closeModals();
        Idle.watch();
         $scope.started = true;
      };

      $scope.interruptIt = function(){
      	 Idle.interrupt();
      	 closeModals();
      }

      $scope.stop = function() {
        closeModals();
        Idle.unwatch();
        $scope.started = false;

      };
  }]);
