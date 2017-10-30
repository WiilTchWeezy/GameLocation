; (function (angular) {
    "use strict";

    angular.module(config.module).factory("httpInterceptor", ["$q", "$location", "localStorageService", "$rootScope", "headerService", httpInterceptor]);

    function httpInterceptor($q, $location, localStorageService, $rootScope, headerService) {
        $rootScope.headerService = headerService;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                var loginInfo = localStorageService.getLoginInfo();
                if (loginInfo != null) {
                    xhr.setRequestHeader("Authorization", "Bearer " + loginInfo.access_token);
                }
            }
        });

        return {
            "request": function (request) {
                $rootScope.headerService.loading++;
                var loginInfo = localStorageService.getLoginInfo();
                if (loginInfo != null) {
                    request.headers.Authorization = "Bearer " + loginInfo.access_token;
                }
                return request;
            },
            "response": function (response) {
                $rootScope.headerService.loading--;
                return response;
            },
            "responseError": function (rejection) {
                $rootScope.headerService.loading--;
                switch (rejection.status) {
                    case 401:
                        $location.path("/");
                        break;
                    case 400:
                        break;
                    case 500:
                        break;
                }
                return $q.reject(rejection);
            }
        };
    }
})(angular);