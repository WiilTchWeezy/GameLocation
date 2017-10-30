; (function (angular) {
    "use strict";

    angular.module(config.module).controller("GameCreateController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", GameCreateController]);

    function GameCreateController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {
        $scope.create = function () {
            $http.post("/api/game/create",
                {
                    Name: $scope.Name
                })
                .then(function (result) {
                    alert('Sucesso');
                }, function (error) {
                    alert('Erro');
                });
        };
    }
})(angular);