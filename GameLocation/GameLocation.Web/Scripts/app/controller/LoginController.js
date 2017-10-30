; (function (angular) {
    "use strict";

    angular.module(config.module).controller("LoginController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", LoginController]);

    function LoginController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {
        $scope.login = function () {
            $http({
                url: "/token",
                method: "post",
                transformRequest: transformRequestAsFormPost,
                data: {
                    grant_type: "password",
                    username: $scope.Name,
                    password: $scope.Password
                }
            }).then(function (response) {
                localStorageService.setLoginInfo(response.data);
                $scope.headerService.isLogged = true;
                $scope.Name = "";
                $scope.Password = "";
                window.location = "/";
            }, function (error) {
                $scope.loginError = error.data.error_description;
            });
        };

        $scope.signup = function () {
            window.location = "/SignUp/Index";
        };
    }
})(angular);