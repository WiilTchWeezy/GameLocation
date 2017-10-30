; (function (angular) {
    "use strict";

    angular.module(config.module).directive("loading", function () {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            template: "<div style='background-color:rgba(0, 0, 0, 0.5);position:absolute;top:0px;left:0px;z-index:999999;'></div>",
            link: function (scope, element, attrs) {
                element.hide();

                var loadingImage = $("<img />", {
                    src: "/Content/img/loading.gif",
                    style: "position:absolute;z-index:999999;height: 30px;"
                });

                element.append(loadingImage);

                var jqueryWindow = $(window);

                jqueryWindow.resize(resizeDiv);
                $(document).resize(resizeDiv);

                function resizeDiv() {
                    var documentHeight = $(document).height();
                    var windowHeight = jqueryWindow.height();
                    element.height(windowHeight > documentHeight ? windowHeight : documentHeight);
                    element.width(jqueryWindow.width() + 30);
                    loadingImage.css("top", (windowHeight / 2 + $(document).scrollTop() / 2) + "px");
                    loadingImage.css("left", "48.5%");
                    $("body").css("overflow-x", "hidden");
                }

                resizeDiv();

                setInterval(function () {
                    var loadingValue = element.scope().headerService.loading;
                    if (loadingValue <= 0) {
                        loadingValue = 0;
                        element.height(0);
                        element.width(0);
                        element.hide();
                    } else {
                        resizeDiv();
                        element.show();
                    }
                }, 150);
            }
        };
    });
})(angular);