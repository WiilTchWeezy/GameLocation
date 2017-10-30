; (function (angular) {
    "use strict";

    angular.module(config.module).directive("inputMask", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.mask(attrs.inputMask);
            }
        };
    });
})(angular);