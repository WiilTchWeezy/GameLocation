; (function (angular, $) {
    //"use strict";

    angular.module(config.module).directive("toolboxConfig", ["$location", "$http", "$templateRequest", "$compile", "customRouteParams", "headerService", function ($location, $http, $templateRequest, $compile, customRouteParams, headerService) {
        return {
            restict: "A",
            link: function (scope, element, attrs) {
                scope.$watch(attrs.toolboxConfig, function (newValue, oldValue) {
                    if (newValue != null) {
                        var options = {
                            currentApplication: "",
                            buttons: [],
                            mode: TOOLBOXLISTMODE,
                            formToSubmit: "crudForm",
                            additionalDataToCreate: function () { return {}; },
                            redirectAfterCancel: "",
                            updateGridAdditionalParameters: null,
                            saveText: "Salvar",
                            newRegisterText: "Novo",
                            newRegisterComplementText: "Cadastro",
                            createText: "Inserir",
                            createIcon: "fa fa-plus",
                            saveIcon: "fa fa-floppy-o",
                            keepModalNavigation: false,
                            keepModalNavigationUntilSave: false,
                            showPrintButton: false,
                            successSaveOperation: false,
                            hideEditCancel: false,
                            cancelQuestion: "Deseja realmente cancelar a operação?",
                            confirmaCancelamentoAoFechar: true,
                            tableConfig: null,
                            createUrl: null,
                            postUrl: null,
                            getUrl: null,
                            dataProperty: "data",
                            keepCreatingWhenModal: false,
                            postDataProperty: "data",
                            updategrid: function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                scope[options.tableConfig].loadData();
                            },
                            beforenewregister: function () {
                                return true;
                            },
                            newregister: function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var $this = $(this);

                                if (options.beforenewregister() == true) {
                                    var modal = getModal($(this));
                                    var additionalDataToCreate = options.additionalDataToCreate();
                                    var queryStrings = {};

                                    if (modal == null) {
                                        var action = urlAction("create", null, $location);
                                        $location.path(action).search({});
                                        scope.$apply();
                                    } else {
                                        var url = modal.url;
                                        var routeParams = customRouteParams.get();
                                        url = urlAction("create", url, $location);
                                        url = createUrl(url, routeParams);
                                        modal.url = url;

                                        $templateRequest(url).then(function (template) {
                                            modal.url = url;
                                            modal.showOKButton(false);
                                            modal.showCancelButton(false);
                                            modal.setBody($compile(template)(scope));
                                        }, function () {
                                            showProcessErrorModal();
                                        });
                                    }
                                }
                            },
                            cancel: function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var $this = $(this);
                                if (options.confirmaCancelamentoAoFechar) {
                                    var modal = createDecisionModal(options.cancelQuestion, "Cancelamento de Operação");
                                    modal.result = function (result) {
                                        if (result == MODALOK) {
                                            var parentModal = getModal($this);

                                            if (parentModal == null) {
                                                var urlToGo = options.redirectAfterCancel == "" ? urlAction("index", null, $location) : options.redirectAfterCancel;

                                                var routeParams = customRouteParams.get();

                                                $location.path(urlToGo).search(routeParams);
                                                scope.$apply();
                                            } else {
                                                urlToGo = options.redirectAfterCancel == "" ? urlAction("index", parentModal.url, $location) : options.redirectAfterCancel;

                                                var routeParams = customRouteParams.get();
                                                urlToGo = createUrl(urlToGo, routeParams);

                                                parentModal.url = urlToGo;
                                                if (options.keepModalNavigation == false) {
                                                    parentModal.cancel();
                                                } else {
                                                    $templateRequest(urlToGo).then(function (template) {
                                                        parentModal.setBody($compile(template)(scope));
                                                        parentModal.showOKButton(parentModal.isRegisterModal() == false);
                                                        parentModal.showCancelButton(parentModal.isRegisterModal() == false);
                                                        parentModal.element.find(".modal-footer [data-toolboxid]").remove();
                                                    }, function () {
                                                        showProcessErrorModal();
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    modal.showModal();
                                } else {
                                    var parentModal = getModal($this);
                                    parentModal.cancel();
                                }
                            },
                            beforesave: function (obj) {
                                return true;
                            },
                            aftersave: function (obj, status, result) {
                                return true;
                            },
                            save: function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var $this = $(this);

                                options.successSaveOperation = false;

                                var $form = $("#" + options.formToSubmit);
                                var objToPost = {};

                                if (options.postDataProperty.indexOf(".") != -1) {
                                    var postDataPropertySplited = options.postDataProperty.split(".");
                                    objToPost = scope[postDataPropertySplited[0]];
                                    var propToPost = postDataPropertySplited[1];
                                    for (var i = 2; i < postDataPropertySplited.length; i++) {
                                        objToPost = objToPost[postDataPropertySplited[i - 1]];
                                        propToPost = postDataPropertySplited[i];
                                    }
                                    objToPost = objToPost[propToPost];
                                } else {
                                    objToPost = scope[options.postDataProperty];
                                }

                                if (options.beforesave(objToPost) == true) {
                                    var modal = getModal($form);

                                    var urlToSubmit = options.postUrl;

                                    if (modal == null) {
                                        if ($form.valid()) {
                                            $http.post(options.postUrl, objToPost).then(function (result) {
                                                if (options.aftersave(objToPost, 1, result) == true) {
                                                    var urlToGo = urlAction("index", null, $location);
                                                    var routeParams = customRouteParams.get();
                                                    $location.path(urlToGo).search(routeParams);
                                                }
                                            }, function (result) {
                                                if (options.aftersave(objToPost, 0, result) == true) {
                                                    if (result.data != null && result.data.Message != null) {
                                                        createErrorModal(result.data.Message, "Erro").showModal();
                                                    } else {
                                                        showProcessErrorModal();
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        if ($form.valid()) {
                                            $http.post(options.postUrl, objToPost).then(function (result) {
                                                options.successSaveOperation = true;
                                                if (result.errors == undefined) {
                                                    if (options.aftersave(objToPost, 1, result) == true) {
                                                        if (options.keepModalNavigation == false || options.keepModalNavigationUntilSave == true || options.keepCreatingWhenModal == true) {
                                                            if (options.keepCreatingWhenModal == false) {
                                                                modal.selectedObject = result.data;
                                                                modal.confirm();

                                                            } else {
                                                                modal.selectedObject = result.data;
                                                                modal.result(MODALOK);
                                                            }
                                                        } else {
                                                            var routeParams = customRouteParams.get();
                                                            var urlToGo = urlAction("index", modal.url, $location);
                                                            urlToGo = createUrl(urlToGo, routeParams);
                                                            modal.url = urlToGo;

                                                            $templateRequest(urlToGo).then(function (template) {
                                                                modal.setBody($compile(template)(scope));
                                                                modal.showOKButton(modal.isRegisterModal() == false);
                                                                modal.showCancelButton(modal.isRegisterModal() == false);
                                                                modal.element.find(".modal-footer [data-toolboxid]").remove();
                                                            }, function () {
                                                                showProcessErrorModal();
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    if (options.aftersave(objToPost, 0, result) == true) {
                                                        var body = "Por favor, corrija os erros antes de continuar.";
                                                        for (var i = 0; i < result.errors.length; i++) {
                                                            body += "<br />" + result.errors[i];
                                                        }
                                                        var errorModal = createErrorModal(body, "Erro");
                                                        errorModal.showModal();
                                                    }
                                                }
                                            }, function (result) {
                                                if (options.aftersave(objToPost, 0, result) == true) {
                                                    if (result.data != null && result.data.Message != null) {
                                                        createErrorModal(result.data.Message, "Erro").showModal();
                                                    } else {
                                                        showProcessErrorModal();
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }

                                return options.successSaveOperation;
                            }
                        };

                        $.extend(options, newValue);
                        $.extend(newValue, options);

                        headerService.addApplication(options.currentApplication);

                        var modal = getModal(element);

                        if (modal == null) {
                            scope.$on('$destroy', function () {
                                headerService.removeApplication();
                            });
                        } else {
                            modal.element.addClass("applicationRegistered");
                        }

                        function addButton(button) {
                            this._createButtons([button]);

                            var toolbarButtonsDiv = this.element;

                            setTimeout(function () {
                                toolbarButtonsDiv.css("width", "");

                                var buttons = toolbarButtonsDiv.find(".tooolbarbutton");
                                var widthButtons = 0;

                                for (var i = 0; i < buttons.length; i++) {
                                    widthButtons += $(buttons[i]).width();
                                }

                                if (toolbarButtonsDiv.width() != 0) {
                                    if (toolbarButtonsDiv.width() - (toolbarButtonsDiv.outerWidth() - toolbarButtonsDiv.width()) < widthButtons) {
                                        toolbarButtonsDiv.css("width", "100%");
                                        toolbarButtonsDiv.css("overflow", "auto");
                                    }
                                }
                            }, 500);
                        }

                        function createButtons(buttons) {
                            if (newValue.elementButtons == null) {
                                newValue.elementButtons = [];
                            }

                            var parentModal = getModal(element);
                            var modalFooter;

                            if (parentModal != undefined) {
                                modalFooter = parentModal.element.find(".modal-footer");
                            }

                            var foundCloseButtonAction = false;

                            for (var i = 0; i < buttons.length; i++) {
                                if (parentModal != undefined && buttons[i].modal == true) {
                                    var $button = $("<a />", {
                                        "href": "#",
                                        "class": "btn " + (buttons[i].type == "ok" ? "btn-primary" : "btn-default"),
                                        "click": buttons[i].click,
                                        "keydown": function (e) { // Dispara evento Click a partir do teclado
                                            e.preventDefault();
                                            var code = e.which;
                                            // 13 = enter, 32 = barra de espaço
                                            if ((code === 13) || (code === 32)) {
                                                $(this).click();
                                            }
                                        },
                                        'data-toolboxid': element.attr("id")
                                    }).append(buttons[i].text);

                                    if (buttons[i].dialogFor == "cancel") {
                                        foundCloseButtonAction = true;
                                        parentModal.closeButtonAction = function (e) {
                                            $button.click();
                                        };
                                    }

                                    modalFooter.append($button);

                                    newValue.elementButtons.push($button);
                                } else {
                                    var $a = $("<a />", {
                                        "href": "#",
                                        "class": "tooolbarbutton",
                                        "click": buttons[i].click,
                                        "keydown": function (e) { // Dispara evento Click a partir do teclado
                                            e.preventDefault();
                                            var code = e.which;
                                            // 13 = enter, 32 = barra de espaço
                                            if ((code === 13) || (code === 32)) {
                                                $(this).click();
                                            }
                                        },
                                        'data-toolboxid': element.attr("id")
                                    });

                                    $a.append($("<i />", {
                                        "class": "buttonimage " + buttons[i].icon
                                    })).append(buttons[i].text);

                                    element.append($a);

                                    newValue.elementButtons.push($a);
                                }
                            }

                            if (parentModal != undefined && foundCloseButtonAction == false) {
                                parentModal.closeButtonAction = function (e) {
                                    parentModal.cancel()
                                };
                            }
                        }

                        function create() {
                            var parentModal = getModal(element);
                            // debugger
                            var $form = $("#" + options.formToSubmit);
                            var formModal = getModal($form);
                            if (formModal != null) {
                                $form.submit(function (e) {
                                    e.preventDefault();
                                    options.save();
                                    return false;
                                });
                            } else {
                                $form.submit(function (e) {
                                    e.preventDefault();
                                    return false;
                                });
                            }

                            var internalButtons = [];

                            for (var i = 0; i < options.buttons.length; i++) {
                                internalButtons.push(options.buttons[i]);
                            }
                            if (options.mode == TOOLBOXEDITMODE || options.mode == TOOLBOXREADONLYMODE) {
                                if (options.mode == TOOLBOXEDITMODE) {
                                    internalButtons.push({
                                        icon: options.saveIcon,
                                        text: options.saveText,
                                        click: options.save
                                    });
                                }
                                if (options.hideEditCancel == false) {
                                    internalButtons.push({
                                        icon: "fa fa-times",
                                        text: "Cancelar",
                                        click: options.cancel
                                    });
                                }

                                if (parentModal != undefined) {
                                    if (options.mode == TOOLBOXEDITMODE) {
                                        internalButtons.push({
                                            modal: true,
                                            type: "ok",
                                            text: options.saveText,
                                            click: options.save,
                                            dialogFor: "ok"
                                        });
                                    }
                                    if (options.hideEditCancel == false) {
                                        internalButtons.push({
                                            modal: true,
                                            type: "cancel",
                                            text: "Cancelar",
                                            click: options.cancel,
                                            dialogFor: "cancel"
                                        });
                                    }
                                }
                            } else if (options.mode == TOOLBOXLISTMODE || options.mode == TOOLBOXLISTNOCREATEMODE) {
                                internalButtons.push({
                                    icon: "fa fa-refresh",
                                    text: "Atualizar",
                                    click: options.updategrid
                                });

                                if (options.mode == TOOLBOXLISTMODE) {
                                    internalButtons.push({
                                        icon: "fa fa-plus",
                                        text: options.newRegisterText + ($(document).width() <= 384 ? "" : " " + options.newRegisterComplementText),
                                        click: options.newregister
                                    });
                                }
                                if (parentModal != undefined) {
                                    parentModal.closeButtonAction = function (e) {
                                        parentModal.cancel(e);
                                    };
                                }
                            } else if (options.mode == TOOLBOXCREATEMODE) {
                                internalButtons.push({
                                    icon: options.createIcon,
                                    text: options.createText,
                                    click: options.save
                                });
                                internalButtons.push({
                                    icon: "fa fa-times",
                                    text: "Cancelar",
                                    click: options.cancel
                                });
                                if (parentModal != undefined) {
                                    internalButtons.push({
                                        modal: true,
                                        type: "ok",
                                        text: options.saveText,
                                        click: options.save,
                                        dialogFor: "ok"
                                    });
                                    internalButtons.push({
                                        modal: true,
                                        type: "cancel",
                                        text: "Cancelar",
                                        click: options.cancel,
                                        dialogFor: "cancel"
                                    });
                                }
                            }

                            if (options.showPrintButton == true) {
                                internalButtons.push({
                                    icon: "fa fa-print",
                                    text: "Imprimir",
                                    click: options.print
                                });
                            }

                            createButtons(internalButtons);

                            if (Modernizr.touch) {
                                $(document).on('focus', 'input', function (e) {
                                    adjustMobilePositions();
                                })
                                    .on('blur', 'input', function (e) {
                                        element.removeClass('fixed');
                                        adjustMobilePositions();
                                    });
                            }

                            var $fakeToolbox = $("<div />", { style: "height: 19px;", "class": "faketoolbox" });

                            if (parentModal == null) {
                                var maxTop = $(".crudhead").outerHeight(true) + $(".hrhead").outerHeight(true) + $("#header").outerHeight(true);
                                $(window).scroll(function (e) {
                                    if ($(document).scrollTop() >= (maxTop + 20)) {
                                        $(".faketoolbox").remove();
                                        $fakeToolbox.appendTo("#wrap");
                                        element.addClass("fixed");
                                        element.css("top", "0px");
                                    } else {
                                        $(".faketoolbox").remove();
                                        $fakeToolbox.remove();
                                        element.removeClass("fixed");
                                        element.css("top", "");
                                    }
                                });
                            } else {
                                var count = 1;
                                var modalHeader = element.closest(".modal-content").find(".modal-header");
                            }

                            var toolbarButtonsDiv = element;

                            function resizeButtonsDiv() {
                                toolbarButtonsDiv.css("width", "");

                                var buttons = toolbarButtonsDiv.find(".tooolbarbutton");
                                var widthButtons = 0;

                                for (var i = 0; i < buttons.length; i++) {
                                    widthButtons += $(buttons[i]).width();
                                }

                                if (toolbarButtonsDiv.width() != 0) {
                                    if (toolbarButtonsDiv.width() - (toolbarButtonsDiv.outerWidth() - toolbarButtonsDiv.width()) < widthButtons) {
                                        toolbarButtonsDiv.css("width", "100%");
                                    }
                                }
                            }

                            var id;

                            $(window).resize(function () {
                                clearTimeout(id);
                                id = setTimeout(resizeButtonsDiv, 500);
                            });

                            setTimeout(function () {
                                resizeButtonsDiv();
                            }, 500);
                        }

                        create();

                        if (options.getUrl != null) {
                            $http.get(options.getUrl).then(function (result) {
                                scope[options.dataProperty] = result.data;
                            }, function () {
                                showProcessErrorModal();
                            });
                        }
                    }
                });
            }
        };
    }]);
})(angular, jQuery);