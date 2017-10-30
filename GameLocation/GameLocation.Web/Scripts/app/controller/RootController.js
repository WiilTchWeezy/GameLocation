; (function (angular) {
    "use strict";

    angular.module(config.module).controller("RootController", ["$scope", "$http", "transformRequestAsFormPost", "$location", "localStorageService", "headerService", RootController]);

    function RootController($scope, $http, transformRequestAsFormPost, $location, localStorageService, headerService) {
        $scope.headerService = headerService;

        var loginInfo = localStorageService.getLoginInfo();

        if (loginInfo != null) {
            $scope.headerService.isLogged = true;
        } else {
            $scope.headerService.isLogged = false;
            window.location = "/login/index";
        }

        $scope.logout = function () {
            localStorageService.removeLoginInfo();
            $scope.headerService.isLogged = false;
            $location.path("/");
        };

    }

    })(angular);