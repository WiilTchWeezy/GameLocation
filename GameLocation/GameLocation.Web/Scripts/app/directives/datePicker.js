; (function (angular) {
    angular.module(config.module).directive("datePicker", ["dateFilter", function (dateFilter) {
        return {
            require: "ngModel",
            restrict: "A",
            link: function (scope, element, attrs, ngModelController) {
                setTimeout(function () {
                    var format = attrs.datePicker;
                    var model = attrs.ngModel;
                    var obj;
                    var prop;
                    var index = 0;
                    var splitedNgModel = model.split(".");

                    var datePickerConfig = getKendoDatepickerOptions();
                    datePickerConfig.select = function () {

                        $(this).valid();

                        var objToUpdate = scope;

                        for (var i = 0; i < splitedNgModel.length - 1; i++) {
                            index = i;
                            objToUpdate = objToUpdate[splitedNgModel[index]];
                        }

                        prop = splitedNgModel[index + 1];

                        objToUpdate[prop] = Date.parseExact(element.val(), format);
                    };

                    datePickerConfig.open = function (e) {
                        if (element.is(":disabled") == true || element.attr("readonly") != null) {
                            e.preventDefault();
                        }
                    };

                    var elementVal = new Date(element.val());
                    element.val("");
                    element.kendoDatePicker(datePickerConfig);
                    var kendoDatePicker = element.data("kendoDatePicker");
                    kendoDatePicker.value(elementVal);
                    element.mask("00/00/0000");

                    if (attrs.ngShow != null) {
                        scope.$watch(attrs.ngShow, function (newValue, oldValue) {
                            if (newValue == true) {
                                kendoDatePicker.wrapper.show().removeClass("ng-hide");
                            } else {
                                kendoDatePicker.wrapper.hide().addClass("ng-hide");
                            }
                        });
                    }

                    ngModelController.$formatters.push(function (data) {
                        return dateFilter(data, format);
                    });

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        if (newValue != undefined && newValue != null && newValue.length >= 10)
                            kendoDatePicker.value(newValue);
                        else if (newValue == undefined && newValue == null)
                            kendoDatePicker.value(newValue);
                    });

                    function changeFunction() {
                        var objToUpdate = scope;

                        for (var i = 0; i < splitedNgModel.length - 1; i++) {
                            index = i;
                            objToUpdate = objToUpdate[splitedNgModel[index]];
                        }

                        prop = splitedNgModel[index + 1];

                        setTimeout(function () {
                            try {
                                objToUpdate[prop] = Date.parseExact(element.val(), format);
                            } catch (err) {
                                objToUpdate[prop] = null;
                            }
                        }, 100);
                    }

                    element.change(changeFunction).keydown(changeFunction);

                    element.click(function () {
                        if (element.is(":enabled") == true) {
                            $(this).data("kendoDatePicker").open();
                        }
                    });
                }, 100);
            }
        };
    }]);
})(angular);