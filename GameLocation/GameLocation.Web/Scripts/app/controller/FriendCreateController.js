; (function (angular) {
    "use strict";

    angular.module(config.module).controller("FriendCreateController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", FriendCreateController]);

    function FriendCreateController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {
        $scope.create = function () {
            $http.post("/api/friend/create",
                {
                    Name: $scope.Name,
                    Phone: $scope.Phone
                })
                .then(function (result) {
                    alert('Sucesso');
                }, function (error) {
                    alert('Erro');
                });
        };
    }
})(angular);