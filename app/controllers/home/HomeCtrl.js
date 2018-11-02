'use strict';
angular.module('myApp.home').controller('HomeCtrl', ["$rootScope", "Session", '$scope', '$location', "$timeout", "AppConstants", "AppMessages", "AppCommon", "$http", "Idle", "Connection", function ($rootScope, Session, $scope, $location, $timeout, AppConstants, AppMessages, AppCommon, $http, Idle, Connection) {
    Idle.watch();
    //redirect if there is no access
    if (!$rootScope.menuRole.HOME) {
        $location.path("/unauthorized");
    }

    //scroll to the top when page navigates
    setTimeout(function () {
        $("html, body").animate({ scrollTop: 0 }, 0);
    }, 200);


    //hide admin menu for iPad

    setTimeout(function () {
        if (AppCommon.isIPad()) {
            $(".admin-menu").hide();
            }
    }, 150);

    $rootScope.adminMenu = false;
    function init() {
        // reset session timed out for the new session
        $rootScope.sessionTimedOut = false;
    }

    init();



    $scope.isCollapsed = false;
    $scope.$on('$routeChangeSuccess', function () {
        $scope.isCollapsed = true;
    });

    $scope.closeThis = function () {
        $scope.isCollapsed = true;
    };

    //page redirection function
    $scope.redirectTo = function (redirectURL) {
        $location.path("/" + redirectURL);       
    };

    $scope.isActive = function (viewLocation) {
        //alert($location.path());
       
        if ($location.path().indexOf(viewLocation) != -1)
            return true;
        else
            return false;

        //return viewLocation === $location.path();
    };

    $scope.swipeLeft = function(){
        angular.element('#myCarousel').carousel("next");
    };
    
    $scope.swipeRight = function(){
        angular.element('#myCarousel').carousel("prev");
    };
    
       if (!$rootScope.isUserLoaded) {
        $location.path("/");
    }
   
       
       var ua = navigator.userAgent,
          event = (ua.match(/iPad/i) || ua.match(/iPhone/i)) ? "touchstart" : "click";

       $('body').on(event, function (e) {
           //did not click a popover toggle or popover
           if ($(e.target).data('toggle') !== 'popover'
               && $(e.target).parents('.popover.in').length === 0) {
               if($('[data-toggle="popover"]')){
               //$('[data-toggle="popover"]').popover('hide');
               }
           }

       });

       $scope.setAdminView = function (IsSet) {
           $rootScope.adminMenu = IsSet;
       };

       $scope.gotoAdminPage = function () {
           $scope.setAdminView(true);
           $scope.redirectTo('admin');
       };

       $scope.gotoAdminSearchPage = function () {
           //$scope.setAdminView(true);
           $scope.redirectTo('admin/search');
       };

       $scope.gotoReportsPage = function () {
           //$scope.setAdminView(true);
           $scope.redirectTo('admin/reports');
       };
       $scope.gotoImpersonatePage = function () {
           //$scope.setAdminView(true);
           $scope.redirectTo('admin/impersonate');
       };

       $scope.backToLead = function () {
           $rootScope.adminMenu = false;
           $scope.redirectTo('home');
       };
        
       $scope.parrallax = function () {

           /* detect touch */
           if ("ontouchstart" in window) {
               document.documentElement.className = document.documentElement.className + " touch";
           }
           //if (!$("html").hasClass("touch")) {
               /* background fix */
               $(".parallax").css("background-attachment", "fixed");
          // }

           /* fix vertical when not overflow
           call fullscreenFix() if .fullscreen content changes */
           function fullscreenFix() {
               var h = $('body').height();
               // set .fullscreen height
               $(".content-b").each(function (i) {
                   if ($(this).innerHeight() > h) {
                       $(this).closest(".fullscreen").addClass("overflow");
                   }
               });
           }
           $(window).resize(fullscreenFix);
           fullscreenFix();

           /* resize background images */
           function backgroundResize() {
               var windowH = $(window).height();
               $(".background").each(function (i) {
                   var path = $(this);
                   // variables
                   var contW = path.width();
                   var contH = path.height();
                   var imgW = path.attr("data-img-width");
                   var imgH = path.attr("data-img-height");
                   var ratio = imgW / imgH;
                   // overflowing difference
                   var diff = parseFloat(path.attr("data-diff"));
                   diff = diff ? diff : 0;
                   // remaining height to have fullscreen image only on parallax
                   var remainingH = 0;
                   //if (path.hasClass("parallax") && !$("html").hasClass("touch")) {
                       var maxH = contH > windowH ? contH : windowH;
                       remainingH = windowH - contH;
                   //}
                   // set img values depending on cont
                   imgH = contH + remainingH + diff;
                   imgW = imgH * ratio;
                   // fix when too large
                   if (contW > imgW) {
                       imgW = contW;
                       imgH = imgW / ratio;
                   }
                   //
                   path.data("resized-imgW", imgW);
                   path.data("resized-imgH", imgH);
                   path.css("background-size", imgW + "px " + imgH + "px");
               });
           }
           $(window).resize(backgroundResize);
           $(window).focus(backgroundResize);
           backgroundResize();

           /* set parallax background-position */
           function parallaxPosition(e) {
               
               var heightWindow = $(window).height();
               var topWindow = $(window).scrollTop();
               var bottomWindow = topWindow + heightWindow;
               var currentWindow = (topWindow + bottomWindow) / 2;
               $(".parallax").each(function (i) {
                   var path = $(this);
                   var height = path.height();
                   var top = path.offset().top;
                   var bottom = top + height;
                   // only when in range
                   if (bottomWindow > top && topWindow < bottom) {
                       var imgW = path.data("resized-imgW");
                       var imgH = path.data("resized-imgH");
                       // min when image touch top of window
                       var min = 0;
                       // max when image touch bottom of window
                       var max = -imgH + heightWindow;
                       // overflow changes parallax
                       var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
                       top = top - overflowH;
                       bottom = bottom + overflowH;
                       // value with linear interpolation
                       var value = min + (max - min) * (currentWindow - top) / (bottom - top);
                       // set background-position
                       var orizontalPosition = path.attr("data-oriz-pos");
                       orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
                       $(this).css("background-position", orizontalPosition + " " + value + "px");
                   }
               });
           }
           //if (!$("html").hasClass("touch")) {
               $(window).resize(parallaxPosition);
               //$(window).focus(parallaxPosition);
               $(window).scroll(parallaxPosition);
               parallaxPosition();
           //}
    

       };

       setTimeout(function () {
           //$scope.parrallax();
       }, 50);
      

}]);