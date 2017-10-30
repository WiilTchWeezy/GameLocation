;(function(angular, $) {
    "use strict";

    angular.module(config.module).directive("stopPropagation", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.stopPropagation();
                });
            }
        }
    });
})(angular, jQuery)