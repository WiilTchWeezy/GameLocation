; (function (angular) {
    "use strict";

    angular.module(config.module).controller("FriendController", ["$scope", "$http", "$location", "localStorageService", "transformRequestAsFormPost", FriendController]);

    function FriendController($scope, $http, $location, localStorageService, transformRequestAsFormPost) {

        function Load () {
            $http.get("/api/friend/getfriends")
                .then(function (result) {
                    $scope.data = result.data;
                }, function (error) {
                    alert('Erro');
                });
        };
        Load();
    }
})(angular);