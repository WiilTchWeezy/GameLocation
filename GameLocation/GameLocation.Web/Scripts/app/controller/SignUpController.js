; (function (angular) {
    "use strict";

    angular.module(config.module).controller("SignUpController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", SignUpController]);

    function SignUpController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {

        $scope.signup = function () {
            $http.post("/api/user/create",
                {
                    Name: $scope.Name,
                    Password: $scope.Password
                })
                .then(function (result) {
                    alert('Sucesso');
                }, function (error) {
                    alert('Erro');
                });
        };
    }
})(angular);