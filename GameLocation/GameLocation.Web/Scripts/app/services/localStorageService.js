; (function (angular) {
    "use strict";

    angular.module(config.module).factory("localStorageService", ["$window", function ($window) {
        var windowStorage = $window.localStorage;

        return {
            setLoginInfo: function (loginInfo) {
                windowStorage.setItem("loginInfo", JSON.stringify(loginInfo));
            },
            getLoginInfo: function () {
                try {
                    var info = windowStorage.getItem("loginInfo");
                    if (info != undefined) {
                        return JSON.parse(info);
                    }
                } catch (err) {

                }
                return null;
            },
            removeLoginInfo: function () {
                windowStorage.removeItem("loginInfo");
            }
        };
    }]);
})(angular);