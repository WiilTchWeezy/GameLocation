;(function(angular, $) {
    "use strict";

    angular.module(config.module).directive("preventDefault", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                });
            }
        }
    });
})(angular, jQuery)