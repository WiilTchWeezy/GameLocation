; (function (angular) {
    "use strict";

    angular.module(config.module).controller("LocationController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", LocationController]);

    function LocationController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {

        function Load () {
            $http.get("/api/location/getlocations")
                .then(function (result) {
                    $scope.data = result.data;
                }, function (error) {
                    alert('Erro');
                });
        };
        Load();
    }
})(angular);