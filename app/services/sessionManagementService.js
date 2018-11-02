'use strict';
/*Service class that manges session with the assosiated user
*/

myApp.factory('Session',["$http", "$resource", "$location", "UserModel", "Connection", "$rootScope", "AppMessages", function ($http, $resource, $location, UserModel, Connection, $rootScope, AppMessages){

var onSuccess = function (data, headers) {
        UserModel.displayName = data.firstName + " " + data.lastName;
        UserModel.FirstName = data.firstName;
        UserModel.LastName = data.lastName;
        UserModel.RankDescr = data.rank;
        UserModel.SMUDescr = data.businessUnit + " " + data.smu;
        UserModel.LocationDescr = data.locationName;
        UserModel.firstName = data.firstName;
        UserModel.lastName = data.lastName;
        UserModel.rank = data.rank;
        UserModel.businessUnit = data.businessUnit;
        UserModel.smu = data.smu;
        UserModel.locationName = data.locationName;
        UserModel.pictureURL = data.pictureURL;
        UserModel.serviceLineName = data.serviceLineName;
        UserModel.subServiceLineName = data.subServiceLineName;
        UserModel.areaDescrption = data.areaDescrption;
        UserModel.regionName = data.regionName;
        UserModel.regionCode = data.regionCode;
        UserModel.city = data.city;
        UserModel.originalGUI = data.originalGUI;
        UserModel.originalFirstName = data.originalFirstName;
        UserModel.originalLastName = data.originalLastName;
        $rootScope.$broadcast('rootScope:userModelLoaded', UserModel.gpn);

         var processMessages = function (data) {
            for (var i = 0; i < data.length; i++) {
                AppMessages[data[i].type] = data[i].message;
            }
        };
         Connection.getAppMessages(processMessages);

}
return {

     userModel: UserModel,
     timeInSeconds: (this.timeInSeconds == undefined ? new Date().getTime() / 1000 : this.timeInSeconds)
}
}
]);