; (function (angular) {
    "use strict";
    
    angular.module(config.module).directive("ngModelNumberFilter", ["numberFilter", function (numberFilter) {
        return {
            require: "ngModel",
            restrict: "A",
            scope: {
                decimalPlaces: "="
            },
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    return convertToDecimalValue(data);
                });

                ngModelController.$formatters.push(function(data) {
                    return formatDecimalValue(data, scope.decimalPlaces);
                });
            }
        } 
    }]);
})(angular);