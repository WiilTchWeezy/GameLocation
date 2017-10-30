; (function (angular) {
    "use strict";

    angular.module(config.module).factory("headerService", function () {
        return {
            isLoggedIn: false,
            loading: false
        };
    });
})(angular);