; (function (angular) {
    "use strict";

    angular.module(config.module).config(["$locationProvider", function ($locationProvider) {
        $locationProvider.hashPrefix("");
    }]);

    angular.module(config.module).config(["$routeProvider", "$httpProvider", "$locationProvider", appConfig]);

    function appConfig($routeProvider, $httpProvider, $locationProvider) {
        $httpProvider.interceptors.push("httpInterceptor");

        $routeProvider
            .when("/", {
                templateUrl: "Home/Menu",
                controller: "HomeController",
                title: "Game Location - Home"
            })
            .when("/game/index", {
                templateUrl: "Game/Index",
                controller: "GameController",
                title: "Game Location - Jogos"
            })
            .when("/game/create", {
                templateUrl: "Game/Create",
                controller: "GameCreateController",
                title: "Game Location - Game"
            })
            .when("/friend/index", {
                templateUrl: "Friend/Index",
                controller: "FriendController",
                title: "Game Location - Amigos"
            })
            .when("/friend/create", {
                templateUrl: "Friend/Create",
                controller: "FriendCreateController",
                title: "Game Location - Amigos"
            })
            .when("/location/index", {
                templateUrl: "Location/Index",
                controller: "LocationController",
                title: "Game Location - Emprestimos"
            })
            .when("/location/create", {
                templateUrl: "Location/Create",
                controller: "LocationCreateController",
                title: "Game Location - Emprestimos"
            })
    }

    angular.module(config.module).run(["$rootScope", "localStorageService", "$location", function ($rootScope, localStorageService, $location) {
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    }]);

})(angular);