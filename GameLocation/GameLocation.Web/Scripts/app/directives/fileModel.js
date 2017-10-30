; (function (angular) {
    "use strict";

    angular.module(config.module).directive("fileModel", ["$parse", function ($parse) {
        return {
            require: "ngModel",
            restrict: 'A',
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    var r = new FileReader();
                    var file = element[0].files[0];
                    r.onloadend = function (e) {
                        var type = element[0].files[0]["type"].toLowerCase();

                        if (type.indexOf("jpg") != -1 || type.indexOf("jpeg") != -1 || type.indexOf("png") != -1) {
                            var inputDataUrl = "data:" + element[0].files[0]["type"] + ";base64," + btoa(e != null ? e.target.result : this.content);

                            var tempImg = new Image();
                            var dataURL;
                            tempImg.src = inputDataUrl;
                            tempImg.onload = function () {
                                var MAX_WIDTH = 1024;
                                var MAX_HEIGHT = 768;
                                var tempW = tempImg.width;
                                var tempH = tempImg.height;
                                if (tempW > tempH) {
                                    if (tempW > MAX_WIDTH) {
                                        tempH *= MAX_WIDTH / tempW;
                                        tempW = MAX_WIDTH;
                                    }
                                } else {
                                    if (tempH > MAX_HEIGHT) {
                                        tempW *= MAX_HEIGHT / tempH;
                                        tempH = MAX_HEIGHT;
                                    }
                                }

                                var canvas = $("<canvas />", {
                                    style: "display:none;"
                                })[0];

                                canvas.width = tempW;
                                canvas.height = tempH;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(this, 0, 0, tempW, tempH);
                                var attachment = canvas.toDataURL("image/jpeg");
                                attachment = attachment.slice(23);
                                var positionIndex = 0;
                                var fileSize = attachment.length;

                                scope.ngModel = "data:image/jpeg;base64," + attachment;

                                scope.$apply();
                            }
                        } else {
                            createErrorModal("Apenas arquivos .jpg, .jpeg ou .png podem ser escolhidos.", "Erro").showModal();
                        }


                    };

                    r.readAsBinaryString(file);
                });
            }
        };
    }])
})(angular);