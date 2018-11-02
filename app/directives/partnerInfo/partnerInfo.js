/* Directive Definition for Partner Info */
(function () {
    var controller = ['$rootScope', '$scope', '$http', 'Session', function ($rootScope, $scope, $http, Session) {
        var vm = this;

        //console.log('Controller Executed!');

        function init() {
            vm.partnerInfo = {};
            vm.partnerInfo.Name = '';
            vm.partnerInfo.PictureUrl = '';
            vm.partnerInfo.RankDescription = '';
            vm.partnerInfo.SmuDescription = '';
            vm.partnerInfo.DescriptionText = '';
            vm.partnerInfo.Location = '';
            vm.partnerInfo.HireDate = '';
            vm.partnerInfo.rankDesc = '';
            vm.partnerInfo.showExtra = false;
            vm.partnerInfo.showExtended = false;
        }

        // Initialize
        init();

        $rootScope.$watch(function () {
            if (typeof $rootScope.session!="undefined")
            return $rootScope.session.userModel.gpn
        }, function () {
            if ($rootScope.session) {
                var UM = $rootScope.session.userModel;

                vm.partnerInfo.Name = UM.displayName;
                vm.partnerInfo.PictureUrl = UM.imageURL;
                vm.partnerInfo.DescriptionText = UM.rankDesc;
                vm.partnerInfo.Location = UM.location;
                vm.partnerInfo.HireDate = UM.hireDate;
                vm.partnerInfo.rankDesc = UM.rankDesc;
                vm.partnerInfo.firstName = UM.firstName;
                vm.partnerInfo.lastName = UM.lastName;
                vm.partnerInfo.connectLeaderFirstName = UM.connectLeaderFirstName;
                vm.partnerInfo.connectLeaderLastName = UM.connectLeaderLastName;
            }
        });
        
        
    }];

    var postLink = function (scope, element, attrs, vm) {
        //console.log(JSON.stringify(attrs));
        //console.log($rootScope);
        //console.log(scope.$root);
        vm.partnerInfo.showExtra = attrs.showExtra ? true : false;
        vm.partnerInfo.showExtended = attrs.showExtended ? true : false;
    };

    myapp_home.directive('partnerInfo',["Util",  function (Util) {
        return {
            restrict: 'E'
            , templateUrl: Util.setAppVersion('app/directives/partnerInfo/partnerInfo-tpl.html')
            , controller: controller
            , controllerAs: 'vm'
            , bindToController: true
            , link: postLink
        };
    }]);

}());



/* Deprecated
(function () {

    var controller = ['$rootScope', '$scope', '$http', 'Session' ,function($rootScope, $scope, $http, Session){
        var vm = this;
        
        console.log('Controller Executed!');

        function init(){
            vm.partnerInfo = {};
            vm.partnerInfo.Name = ''; 
            vm.partnerInfo.PictureUrl = ''; 
            vm.partnerInfo.RankDescription = ''; 
            vm.partnerInfo.SmuDescription = ''; 
            vm.partnerInfo.DescriptionText = ''; 
            vm.partnerInfo.showExtra = false;
        }

        // Initialize
        init();

        $rootScope.$watch(function () {
            return $rootScope.session.userModel.gpn
        }, function () {
            if ($rootScope.session) {
                var UM = $rootScope.session.userModel;

                vm.partnerInfo.Name = UM.displayName;
                vm.partnerInfo.PictureUrl = UM.imageURL;
                vm.partnerInfo.DescriptionText = UM.rankDesc;
            }
        })
        /// TODO: Remove Hard coded values
        var partnerGpn = 'FR010105790';        
        var partnerInfoUrl = 'http://DEFRAVMUBWYAP1.EYUA.NET/Leadwebapi/api/PartnerProfile/ByGPN/' + partnerGpn + '/1/1';
        // var partnerInfoUrl = 'http://localhost:55555/api/EmployeeProfile/bygpn/' + partnerGpn + '/1/1';

        var whenSuccess = function (response) {
            console.log('Web Request Success!');

            var theData = response.data;

            vm.partnerInfo.Name = theData[0].FirstName + ' ' + theData[0].LastName;
            vm.partnerInfo.PictureUrl = theData[0].PictureURL;
            vm.partnerInfo.RankDescription = theData[0].RankDescr;
            vm.partnerInfo.SmuDescription = theData[0].SMUDescr;
            vm.partnerInfo.DescriptionText = theData[0].RankDescr + ', ' + theData[0].SMUDescr;
            
            console.log(vm.partnerInfo.Name);
            console.log(vm.partnerInfo.PictureUrl);
        }

        var whenFailure = function (xhr) {
            // Respond to failure
            console.log('Web Request Failed!');
        }

            // Call server/backend to fetch data
            //$http.get(partnerInfoUrl).then(whenSuccess, whenFailure);
    }]; 

    var postLink = function (scope, element, attrs, vm) {
        //console.log(JSON.stringify(attrs));
        //console.log($rootScope);
        //console.log(scope.$root);
        vm.partnerInfo.showExtra = attrs.showExtra ? true: false;
    };

    myapp_home.directive('partnerInfo', function () {
        return {
            restrict: 'E'
            , templateUrl: 'app/directives/partnerInfo/partnerInfo-tpl.html'
            , controller: controller            
            , controllerAs: 'vm'
            , bindToController: true
            , link: postLink
        };
    });

}());
*/