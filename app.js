'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngIdle',
  'ngJSONPath',
  'myApp.home',
  'myApp.dashboard',
  'myApp.version',
  'myApp.welcome',
  'angular-click-outside',
  'angular.filter',
  'angular-popover',
  'angularMultiSlider',
  'mdo-angular-cryptography',
  'AdalAngular'
]).
config(['$routeProvider', '$httpProvider', 'AppConstants', '$cryptoProvider', 'adalAuthenticationServiceProvider',  function ($routeProvider, $httpProvider, AppConstants, $cryptoProvider, adalProvider ) {
    AppConstants.BASE_URI = appServiceURL; //AppConfiguration.BASE_URI;

	if(!AppConstants.CONSOLE_LOG_DEBUG){
			
			if(!window.console) { window.console = {};}
			
			var methods = ["log", "debug", "warn", "info"];
			for(var i=0;i<methods.length;i++){
				console[methods[i]] = function(){};
			}
	}

    var setAppVersion = function (path) {
        return path + "?" + LEAD_Version;
    }
    
    
    
    $cryptoProvider.setCryptographyKey(AppConstants.SECRET_KEY);
    
    var getParameterByName = function(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
    
    var userId = getParameterByName('userId');
    var redirectURL = "";
    if(userId!="" && userId!=null){
    	redirectURL = "/" + userId;
    }
    
    var getTokenFromURL = function(){
    	var url = "";
    	var urlArr = [];
    	var idTokenArr = [];
    	
	    if (!url) url = window.location.href;
		urlArr = url.split("id_token=");
		
		if(urlArr.length>0 && urlArr.length==2)	{
			
			idTokenArr = urlArr[1].split("&state=");
			return idTokenArr[0];
		}
		else
			return "";
	}
    var id_token = getTokenFromURL();
    if(typeof id_token !== "undefined" && id_token!="")
    sessionStorage.setItem('id_token', id_token)

    
    /* SSO Changes  - start */
    $httpProvider.defaults.withCredentials = true;
    $routeProvider
    
    .when('/authenticate/:userId', {
       resolve: {
            permission: function (authorizationService, $route) {
            	return authorizationService.permissionCheck($route);
            },
        }

    }).when('/authenticate', {
       resolve: {
            permission: function (authorizationService, $route) {
            	return authorizationService.permissionCheck($route);
            },
        }

    })
        // unauthorized access
          .when('/unauthorized', {
              templateUrl: setAppVersion('app/views/welcome/unauthorized.html'),
              controller: 'unauthorizedAccessCtrlr'
          })
          // 500 server error
          .when('/servererror', {

              templateUrl: setAppVersion('app/views/welcome/serverError.html'),
              controller: 'ServerErrorCtrl'
          }).when('/usererror', {

              templateUrl: setAppVersion('app/views/welcome/usererror.html'),
              controller: 'UserErrorCtrl'
          })
        .when('/logout', {
            templateUrl: setAppVersion('app/views/logout/logout.html'),
            controller: 'logoutController'
        })
        .otherwise({ redirectTo: '/authenticate'+redirectURL})
    /* SSO Changes  - end */
    
    
		/* ADAL Configuration starts here */ 
         var endpoints = {};
         adalProvider.init(
	        {
	            instance: AppConstants.AZURE_INSTANCE, 
	            tenant: AppConstants.AZURE_TENANT,
	            clientId: AppConstants.AZURE_CLIENTID,
	            domainHint: 'ey.net&msafed=0',
	            setUp: AppConstants.AZURE_CODE_ENABLE
	            
	            //,
	            //localLoginUrl : "https://leaddashboard-a047f26b1.dispatcher.hana.ondemand.com/index.html"
	        }//,
        	//$httpProvider   // pass http provider to inject request interceptor to attach tokens
        );
        /* ADAL Configuration ends here */
       
		
    
    
}]).run(function ($rootScope, $location) {

    $rootScope.adminView = false;
    $rootScope.responseLog = [];
   
    $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
        if (next && next.templateUrl) {
            if (next.templateUrl.indexOf(LEAD_Version) === -1) {
                if (next.templateUrl.indexOf("?") > -1)
                    next.templateUrl = next.templateUrl + LEAD_Version;
                else
                    next.templateUrl = next.templateUrl + "?" + LEAD_Version;
            }
        }
        // if (next.$$route) {
        //     if (typeof $rootScope.session != "undefined" && typeof $rootScope.session.userModel != "undefined") {
        //         if (typeof $rootScope.session.userModel.IsPrivacyChecked == "undefined" || $rootScope.session.userModel.IsPrivacyChecked == false) {
        //             $location.path("/privacy");
        //         }
        //     }
        // }
        if ($location.path().indexOf("/admin/search") == 0 || $location.path().indexOf("/admin/report") == 0) {
            $rootScope.adminMenu = false;
        }else if ($location.path().indexOf("/admin") == -1) {
            $rootScope.adminMenu = false;
        }
        else {
            $rootScope.adminMenu = true;
        }

    })
}).config(['IdleProvider', 'KeepaliveProvider', function (IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(1200); // 20 min
    IdleProvider.timeout(60); // 1 min
    KeepaliveProvider.interval(60); // heartbeat every 10 min
}]).run(['$rootScope', 'Idle', function ($rootScope, Idle) {
    Idle.watch();
    $rootScope.sessionTimedOut = false;
    $rootScope.showSessionTimeout = false;
    $rootScope.isUserLoaded = false;



    $rootScope.menuRole = {};
    $rootScope.menuRole.HOME = false;
    $rootScope.menuRole.HOME_READ_ONLY = false;

    $rootScope.menuRole.DASHBOARD = false;
    $rootScope.menuRole.DASHBOARD_READ_ONLY = false;

    $rootScope.menuRole.GOALS = false;
    $rootScope.menuRole.GOALS_READ_ONLY = false;

    $rootScope.menuRole.FEEDBACK = false;
    $rootScope.menuRole.FEEDBACK_READ_ONLY = false;

    $rootScope.menuRole.REVIEWER = false;
    $rootScope.menuRole.REVIEWER_READ_ONLY = false;

    $rootScope.menuRole.SEARCH = false;
    $rootScope.menuRole.SEARCH_READ_ONLY = false;

    $rootScope.menuRole.ADMIN = false;
    $rootScope.menuRole.ADMIN_READ_ONLY = false;

    $rootScope.menuRole.MAIN_ADMIN = false;
    $rootScope.menuRole.MAIN_ADMIN_READ_ONLY = false;

    $rootScope.menuRole.BU_LEADER = false;
    $rootScope.menuRole.BU_LEADER_READ_ONLY = false;

    $rootScope.menuRole.TALENT_COORDINATOR = false;
    $rootScope.menuRole.TALENT_COORDINATOR_READ_ONLY = false;


	

    
}]);

angular.module('myApp').directive('input', fixIEClearButton);

fixIEClearButton.$inject = ['$timeout', '$sniffer'];



function fixIEClearButton($timeout, $sniffer) {
    var directive = {
        restrict: 'E',
        require: '?ngModel',
        link: Link,
        controller: function () { }
    };

    return directive;

    function Link(scope, elem, attr, controller) {
        var type = elem[0].type;
        //ie11 doesn't seem to support the input event, at least according to angular
        if (type !== 'text' || !controller || $sniffer.hasEvent('input')) {
            return;
        }

        elem.on("mouseup", function (event) {
            var oldValue = elem.val();
            if (oldValue == "") {
                return;
            }

            $timeout(function () {
                var newValue = elem.val();
                if (newValue !== oldValue) {
                    elem.val(oldValue);
                    elem.triggerHandler('keydown');
                    elem.val(newValue);
                    elem.triggerHandler('focus');
                }
            }, 0, false);
        });

        scope.$on('$destroy', destroy);
        elem.on('$destroy', destroy);

        function destroy() {
            elem.off('mouseup');
        }
    }
}