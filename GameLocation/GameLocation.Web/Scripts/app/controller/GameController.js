; (function (angular) {
    "use strict";

    angular.module(config.module).controller("GameController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", GameController]);

    function GameController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {

        function Load () {
            $http.get("/api/game/getgames")
                .then(function (result) {
                    $scope.data = result.data;
                }, function (error) {
                    alert('Erro');
                });
        };
        Load();
    }
})(angular);