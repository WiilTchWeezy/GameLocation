; (function (angular) {
    "use strict";

    angular.module(config.module).controller("LocationCreateController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", LocationCreateController]);

    function LocationCreateController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {
        $scope.create = function () {
            $http.post("/api/location/create",
                {
                    FriendId: $scope.GameId,
                    GameId: $scope.GameId
                })
                .then(function (result) {
                    alert('Sucesso');
                }, function (error) {
                    alert('Erro');
                });
        };
    }
})(angular);