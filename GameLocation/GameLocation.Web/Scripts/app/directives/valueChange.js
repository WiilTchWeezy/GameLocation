; (function (angular) {

    angular.module(config.module).directive("valueChange", [function () {

        function link(scope, element, attr, ctrl) {
            element.change(function () {
                scope.$eval(attr.valueChange);
            });
        }

        return {
            link: link,
            restrict: "A"
        };
    }]);

})(angular);