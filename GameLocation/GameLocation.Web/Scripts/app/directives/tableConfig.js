; (function (angular, $) {
    //"use strict";

    angular.module(config.module).directive("tableConfig", ["$http", "$location", "$templateRequest", "$compile", "customRouteParams", function ($http, $location, $templateRequest, $compile, customRouteParams) {
        return {
            restrict: "A",
            compile: function (element, attrs) {
                var $table = element;
                var tableId = attrs.id;
                var $thead = $table.find("> thead");
                var $tr = $table.find("tbody > tr");
                var $th = $thead.find("tr > th");
                var $td = $tr.find("> td");
                var loadingData = false;

                var ngRepeatAttr = $tr.attr("ng-repeat");
                var ngRepeatVariableName = ngRepeatAttr.substr(0, ngRepeatAttr.indexOf(" "));

                return {
                    pre: function (scope, element, attrs, controller, transcludeFn) {
                        scope.$watch(attrs.tableConfig, function (newValue, oldValue) {
                            if (newValue != null) {
                                var configureTableViewModel = newValue;
                                var properties = configureTableViewModel.properties;
                                var defaultOrderByProperty = configureTableViewModel.defaultOrderByProperty;
                                var defaultOrderByDirection = configureTableViewModel.defaultOrderByDirection != null ? configureTableViewModel.defaultOrderByDirection : ORDERBYASCENDING;

                                var modal = getModal($table);
                                var propertiesArray = properties.split(",");

                                scope.kendoGridConfig = getKendoGridOptions();
                                scope.kendoGridConfig.pageable = false;

                                $tr.removeAttr("ng-repeat");
                                var originalRowTemplate = $("<div />").append($tr).html().replace(/#/g, "\\#").replace(new RegExp("({{" + ngRepeatVariableName + "?[\.}}])", "g"), "{{dataItem.").replace(/\$index/g, "dataItem.$index").replace(new RegExp(ngRepeatVariableName + "\\)", "g"), "dataItem)").replace(new RegExp("\\(" + ngRepeatVariableName, "g"), "(dataItem");
                                //scope.kendoGridConfig.rowTemplate = originalRowTemplate;

                                var kendoGridObj = null;

                                if (configureTableViewModel.kendoGrid == true) {
                                    scope.kendoGridConfig.columns = [];

                                    for (var i = 0; i < $td.length; i++) {
                                        var $currentTdForKendoGrid = $($td[i]);
                                        var $currentThForKendoGrid = $($th[i]);

                                        scope.kendoGridConfig.columns.push({
                                            headerTemplate: $currentThForKendoGrid.html(),
                                            field: propertiesArray.length >= (i + 1) ? propertiesArray[i].trim() : "",
                                            attributes: {
                                                "class": $currentTdForKendoGrid.attr("class"),
                                                "style": $currentTdForKendoGrid.attr("style")
                                            },
                                            headerAttributes: {
                                                "class": $currentThForKendoGrid.attr("class"),
                                                "style": $currentThForKendoGrid.attr("style")
                                            },
                                            template: $($td[i]).html().replace(/#/g, "\\#").replace(new RegExp("({{" + ngRepeatVariableName + "?[\.}}])", "g"), "{{dataItem.").replace(/\$index/g, "dataItem.$index").replace(new RegExp(ngRepeatVariableName + "\\)", "g"), "dataItem)").replace(new RegExp("\\(" + ngRepeatVariableName, "g"), "(dataItem")
                                        });
                                    }

                                    var kendoGridElement = "<kendo-grid data-export='false' id='" + tableId + "' k-options='kendoGridConfig' k-rebind='kendoGridConfig'>";
                                    if (configureTableViewModel.detailOptions != null) {
                                        kendoGridElement += "<div k-detail-template><div kendo-grid k-options='" + configureTableViewModel.detailOptions + "(dataItem)'></div></div>";
                                    }
                                    kendoGridElement += "</kendo-grid>";
                                    $table.before($compile(kendoGridElement)(scope));
                                    $table.remove();

                                    $table = $("#" + tableId + " table");
                                    $thead = $table.find("> thead");
                                    $th = $thead.find("tr > th");

                                    kendoGridObj = $("#" + tableId).data("kendoGrid");
                                    kendoGridObj.element.attr("data-originalRowTemplate", originalRowTemplate);
                                    var copyOriginalColumns = [];
                                    for (var k = 0; k < kendoGridObj.columns.length; k++) {
                                        copyOriginalColumns.push(kendoGridObj.columns[k]);
                                    }
                                    kendoGridObj.element.data("originalColumns", copyOriginalColumns);
                                }

                                var loadParams = {};
                                var routeParams = customRouteParams.get();
                                angular.merge(loadParams, routeParams);

                                var orderByPropertyQueryString = loadParams[ORDERBYPROPERTYQUERYSTRING];
                                var orderByDirectionQueryString = loadParams[ORDERBYDIRECTIONQUERYSTRING];

                                if (orderByPropertyQueryString == null) {
                                    orderByPropertyQueryString = defaultOrderByProperty;
                                }

                                if (defaultOrderByDirection == null) {
                                    if (defaultOrderByDirection != null) {
                                        orderByDirectionQueryString = defaultOrderByDirection;
                                    } else {
                                        orderByDirectionQueryString = ORDERBYASCENDING;
                                    }
                                }

                                loadParams[ORDERBYPROPERTYQUERYSTRING] = orderByPropertyQueryString;
                                loadParams[ORDERBYPROPERTYQUERYSTRING] = orderByPropertyQueryString;

                                var multipleSelection = configureTableViewModel.MultipleSelection;
                                var isMultipleSelection = modal != undefined && configureTableViewModel.isMultipleSelection == true;
                                var $selectAllCheck;

                                if (isMultipleSelection == true) {
                                    if (modal.selectedObject == undefined || modal.selectedObject == null) {
                                        modal.selectedObject = [];
                                    }

                                    var $thCheckAll = $("<th />", {
                                        style: "width:3%;text-align: center;"
                                    });

                                    if (multipleSelection.SelectAll == true) {
                                        var $selectAllCheck = $("<input type='checkbox' class='rowselectionall'/>");
                                        $selectAllCheck.click(function () {
                                            var $thisSelectAllCheck = $(this);
                                            var thisSelectAllCheckChecked = $thisSelectAllCheck.is(":checked");

                                            var rowsSelections = $table.find(".rowselection");

                                            for (var i = 0; i < rowsSelections.length; i++) {
                                                var $rowSelection = $(rowsSelections[i]);
                                                if (thisSelectAllCheckChecked == true && $rowSelection.is(":checked") == false) {
                                                    $rowSelection.closest("tr").click();
                                                } else if (thisSelectAllCheckChecked == false && $rowSelection.is(":checked") == true) {
                                                    $rowSelection.closest("tr").click();
                                                }
                                            }
                                        });
                                        $thCheckAll.append($selectAllCheck);
                                    }

                                    $thead.find("tr").prepend($thCheckAll);
                                }

                                function loadData(fromSearch) {
                                    if (loadingData == false) {
                                        loadingData = true;

                                        var queryString = "";

                                        if (loadParams == null) {
                                            loadParams = {};
                                        }

                                        if (fromSearch == true) {
                                            loadParams[CURRENTPAGE] = 1;
                                        }

                                        var i = 0;
                                        if (loadParams != null) {
                                            for (var p in loadParams) {
                                                queryString += (i > 0 ? "&" : "?") + p + "=" + loadParams[p];
                                                i++;
                                            }
                                        }

                                        $http.get(configureTableViewModel.getUrl + queryString).then(function (result) {
                                            configureTableViewModel.data = result.data;
                                            data = configureTableViewModel.data.Data;

                                            if (kendoGridObj != null) {
                                                function normalizeKendoDataItemProperty(item, prop) {
                                                    var splitedProp = prop.split(".");
                                                    if (splitedProp.length > 1) {
                                                        var currentItem = item;
                                                        for (var k = 0; k < splitedProp.length; k++) {
                                                            if (currentItem[splitedProp[k]] == null) {
                                                                if (k != (splitedProp.length - 1)) {
                                                                    currentItem[splitedProp[k]] = {};
                                                                } else {
                                                                    currentItem[splitedProp[k]] = "";
                                                                }
                                                                currentItem = currentItem[splitedProp[k]];
                                                            }
                                                        }
                                                    }
                                                }

                                                for (var i = 0; i < data.length; i++) {
                                                    for (var j = 0; j < kendoGridObj.columns.length; j++) {
                                                        normalizeKendoDataItemProperty(data[i], kendoGridObj.columns[j].field);
                                                    }
                                                    data[i].$index = i;
                                                }


                                                var newDataSource = new kendo.data.DataSource({
                                                    data: data
                                                });

                                                kendoGridObj.setDataSource(newDataSource);
                                            }

                                            setTimeout(configureRows, 100);
                                            setTimeout(configureHeaders, 100);

                                            if ((configureTableViewModel.isPageable == null || configureTableViewModel.isPageable == true) && configureTableViewModel.data.TotalPages != null) {
                                                $("#paginationResume_" + attrs.id).remove();

                                                var $pagination = $("<ul />", {
                                                    "id": "pagination_" + attrs.id,
                                                    "class": "pagination col-sm-12"
                                                });

                                                var currentPage = loadParams[CURRENTPAGE];
                                                if (currentPage == null) {
                                                    currentPage = 1;
                                                }

                                                currentPage = Number(currentPage);

                                                var pageRangeOffset = 4;
                                                var pageStart = currentPage - pageRangeOffset;
                                                if (pageStart < 1) {
                                                    pageStart = 1;
                                                }

                                                var pageEnd = currentPage + pageRangeOffset;
                                                if (pageEnd > configureTableViewModel.data.TotalPages) {
                                                    pageEnd = configureTableViewModel.data.TotalPages;
                                                }

                                                function createPageLink(i, text, activate, createHref) {
                                                    var $li = $("<li />");

                                                    if (activate == true && currentPage == i) {
                                                        $li.addClass("active");
                                                    }

                                                    var lastPage = i == configureTableViewModel.data.TotalPages;

                                                    var $a = $("<a />", {
                                                        text: text == undefined ? i.toString() : text,
                                                        href: createHref == true ? i.toString() : "#",
                                                        "class": lastPage == true ? "last" : ""
                                                    }).click(function (e) {
                                                        e.preventDefault();

                                                        if ($(this).attr("href") != "#") {
                                                            loadParams[CURRENTPAGE] = $(this).attr("href");

                                                            if ($(this).parent().hasClass("active") == false) {
                                                                loadData();
                                                            }
                                                        }
                                                    });

                                                    $li.append($a);

                                                    return $li;
                                                }

                                                if (pageStart > 1) {
                                                    var $firstPage = createPageLink(1, "<<", false, true);
                                                    $pagination.append($firstPage);
                                                    var $previousPages = createPageLink(1, "...", false, false);
                                                    $previousPages.find("a").addClass("morepagesindication");
                                                    $pagination.append($previousPages);
                                                }

                                                for (var i = pageStart; i <= pageEnd; i++) {
                                                    var $li = createPageLink(i, i.toString(), true, true);

                                                    $pagination.append($li);
                                                }

                                                if (pageEnd < configureTableViewModel.data.TotalPages) {
                                                    var $nextPages = createPageLink(configureTableViewModel.data.TotalPages, "...", false, false);
                                                    $nextPages.find("a").addClass("morepagesindication");
                                                    $pagination.append($nextPages);
                                                }

                                                if (currentPage < configureTableViewModel.data.TotalPages) {
                                                    var $lastPage = createPageLink(configureTableViewModel.data.TotalPages, ">>", false, true);
                                                    $lastPage.find("a").addClass("last");
                                                    $pagination.append($lastPage);
                                                }

                                                var $divRow = $("<div />", {
                                                    "class": "row",
                                                    "id": "paginationResume_" + attrs.id
                                                });

                                                var $divCol = $("<div />", {
                                                    "class": "col-sm-12"
                                                });

                                                $divCol.append($("<div />", {
                                                    text: "Mostrando " + currentPage + " de " + (configureTableViewModel.data.TotalPages == 0 ? 1 : configureTableViewModel.data.TotalPages) + " página(s). Total de " + configureTableViewModel.data.TotalRegisters + " registros.",
                                                    "class": "paginationResume"
                                                }));

                                                var $divCol1 = $("<div />", {
                                                    "class": "col-sm-12"
                                                });

                                                $divCol1.append($pagination);

                                                $divRow.append($divCol1);
                                                $divRow.append($divCol);

                                                $divRow.insertAfter("#" + attrs.id);
                                            }

                                            loadingData = false;
                                        });
                                    } else {
                                        setTimeout(function () {
                                            loadData(fromSearch);
                                        }, 400);
                                    }
                                }

                                var data;

                                function configureHeaders() {
                                    if (kendoGridObj == null) {
                                        $th = $thead.find("th");
                                    } else {
                                        $th = kendoGridObj.thead.find("th");
                                    }

                                    for (var i = 0; i < $th.length; i++) {
                                        if ($($th[i]).hasClass("csthconfigured") == false) {
                                            if (propertiesArray[i] != null) {
                                                $($th[i]).data("property", propertiesArray[i]);

                                                if (configureTableViewModel.isOrderable == undefined || configureTableViewModel.isOrderable == true) {
                                                    $($th[i]).addClass("csorderable csthconfigured");

                                                    if (orderByPropertyQueryString == $($th[i]).attr("data-field")) {
                                                        if (orderByDirectionQueryString == ORDERBYDESCENDING) {
                                                            $($th[i]).append("<span class='orderByDirectionArrow'>&#9660;</span>").addClass("descending");
                                                        } else {
                                                            $($th[i]).append("<span class='orderByDirectionArrow'>&#9650;</span>").addClass("ascending");
                                                        }
                                                    }

                                                    $($th[i]).click(function (e) {
                                                        var $thisTh = $(this);

                                                        applyOrderBy($thisTh);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }

                                function configureRows() {
                                    var $tr;

                                    if (kendoGridObj == null) {
                                        $tr = $table.find("tbody > tr");
                                    } else {
                                        $tr = kendoGridObj.tbody.find("tr");
                                    }

                                    for (var i = 0; i < $tr.length; i++) {
                                        $($tr[i]).data("dataitem", data[i]);

                                        if (modal != undefined) {
                                            if (isMultipleSelection == false) {
                                                $($tr[i]).click(function (e) {
                                                    var $this = $(this);
                                                    selectUniqueRowTable($table, $this);
                                                    var dataitem = $this.data("dataitem");
                                                    modal.selectedObject = dataitem;
                                                });

                                                $($tr[i]).dblclick(function (e) {
                                                    modal.confirm();
                                                });
                                            } else {
                                                function getSelectedObjectIndex(object, keys) {
                                                    var splitedKeys = keys.split(",");

                                                    for (var modalSelectedObjectIndex = 0; modalSelectedObjectIndex < modal.selectedObject.length; modalSelectedObjectIndex++) {
                                                        var found = true;

                                                        for (var keyIndex = 0; keyIndex < splitedKeys.length; keyIndex++) {
                                                            if (modal.selectedObject[modalSelectedObjectIndex][splitedKeys[keyIndex]] != object[splitedKeys[keyIndex]]) {
                                                                found = false;
                                                                break;
                                                            }
                                                        }

                                                        if (found == true) {
                                                            return modalSelectedObjectIndex;
                                                        }
                                                    }

                                                    return -1;
                                                }

                                                var $selection = $("<input />", {
                                                    type: "checkbox",
                                                    "class": "rowselection",
                                                    style: "margin-top: 2px;"
                                                });

                                                $($tr[i]).prepend($("<td />", {
                                                    style: "width: 3%;text-align: center;"
                                                }).append($selection));

                                                $($tr[i]).click(function (e) {
                                                    var $this = $(this);
                                                    var dataItem = $this.data("dataitem");
                                                    if (isRowSelected($this) == true) {
                                                        deselectRow($this);
                                                        $this.find(".rowselection").prop("checked", false);
                                                        var removeIndex = getSelectedObjectIndex(dataItem, multipleSelection.Keys);
                                                        modal.selectedObject.splice(removeIndex, 1);
                                                        if ($selectAllCheck != null) {
                                                            $selectAllCheck.prop("checked", false);
                                                        }
                                                    } else {
                                                        selectRow($this);
                                                        $this.find(".rowselection").prop("checked", true);
                                                        modal.selectedObject.push(dataItem);
                                                        var totalSelection = $table.find(".rowselection").length;
                                                        var totalSelectionChecked = $table.find(".rowselection:checked").length;
                                                        if ($selectAllCheck != null && totalSelection == totalSelectionChecked) {
                                                            $selectAllCheck.prop("checked", true);
                                                        }
                                                    }
                                                });

                                                $selection.change(function (e) {
                                                    e.preventDefault();
                                                });

                                                var selectedIndex = getSelectedObjectIndex(data[i], multipleSelection.Keys);

                                                if (selectedIndex != -1) {
                                                    selectRow($($tr[i]));
                                                    $($tr[i]).find(".rowselection").attr("checked", "checked");
                                                }
                                            }
                                        }
                                    }
                                }

                                function applyOrderBy($thisTh) {
                                    var dataProperty = $thisTh.data("property");
                                    if ($thisTh.attr("data-field") != null) {
                                        dataProperty = $thisTh.attr("data-field");
                                    }

                                    loadParams[ORDERBYPROPERTYQUERYSTRING] = dataProperty;
                                    orderByPropertyQueryString = dataProperty;

                                    if ($thisTh.hasClass("ascending")) {
                                        loadParams[ORDERBYDIRECTIONQUERYSTRING] = ORDERBYDESCENDING;
                                        orderByDirectionQueryString = ORDERBYDESCENDING;
                                    } else {
                                        loadParams[ORDERBYDIRECTIONQUERYSTRING] = ORDERBYASCENDING;
                                        orderByDirectionQueryString = ORDERBYASCENDING;
                                    }

                                    $th.find(".orderByDirectionArrow").remove();
                                    $th.removeClass("descending").removeClass("ascending");

                                    if (loadParams[ORDERBYDIRECTIONQUERYSTRING] == ORDERBYDESCENDING) {
                                        $thisTh.append("<span class='orderByDirectionArrow'>&#9660;</span>").addClass("descending");
                                    } else {
                                        $thisTh.append("<span class='orderByDirectionArrow'>&#9650;</span>").addClass("ascending");
                                    }

                                    loadData();
                                }

                                configureTableViewModel.loadData = loadData;
                                configureTableViewModel.applyOrderBy = applyOrderBy;
                                configureTableViewModel.configureRows = configureRows;
                                configureTableViewModel.configureHeaders = configureHeaders;

                                if (configureTableViewModel.isAutoLoad == null || configureTableViewModel.isAutoLoad == true) {
                                    loadData();
                                }

                                if (configureTableViewModel.filterFormId != null) {
                                    $("#" + configureTableViewModel.filterFormId).submit(function (e) {
                                        e.preventDefault();

                                        var $form = $(this);
                                        var formArray = $form.serializeArray();

                                        for (var i = 0; i < formArray.length; i++) {
                                            var $elem = $form.find("[name=" + escapeJquerySelector(formArray[i].name) + "]");

                                            if (($elem.hasClass("datepicker") == true || $elem.data("role") == "datepicker") && formArray[i].value != null && formArray[i].value != "") {
                                                loadParams[formArray[i].name] = Date.parseExact(formArray[i].value, "dd/MM/yyyy").toString("yyyy-MM-ddTHH:mm:ss");
                                            } else {
                                                loadParams[formArray[i].name] = formArray[i].value;
                                            }
                                        }

                                        loadData(true);

                                        return false;
                                    });
                                }

                                if (configureTableViewModel.handleEditClick == undefined || configureTableViewModel.handleEditClick == true) {
                                    $table.on("click", ".grid-edit", function (e) {
                                        e.preventDefault();

                                        var $this = $(this);
                                        var urlToGo;
                                        var href = $this.attr("href");

                                        var modal = getModal($this);

                                        var hrefQueryStrings = getQueryStrings(href);
                                        var routeParams = customRouteParams.get();
                                        angular.merge(routeParams, loadParams);
                                        angular.merge(routeParams, hrefQueryStrings);

                                        urlToGo = createUrl(href, routeParams);

                                        if (modal != undefined) {
                                            urlToGo = urlToGo.substring(1);
                                            modal.url = urlToGo;

                                            $templateRequest(urlToGo).then(function (template) {
                                                modal.setBody($compile(template)(scope));
                                                modal.showOKButton(false);
                                                modal.showCancelButton(false);
                                            }, function () {
                                                showProcessErrorModal();
                                            });
                                        } else {
                                            window.location = urlToGo;
                                        }
                                    });
                                }

                                if (configureTableViewModel.handleDeleteClick == null || configureTableViewModel.handleDeleteClick == true) {
                                    $table.on("click", ".grid-delete", function (e) {
                                        e.preventDefault();

                                        var $this = $(this);

                                        if (configureTableViewModel.beforedelete == null || configureTableViewModel.beforedelete($this.attr("href")) == true) {
                                            var confirmModal = createDecisionModal("Deseja realmente excluir este registro?", "Confirmar Exclusão");
                                            confirmModal.result = function (result) {
                                                if (result == MODALOK) {
                                                    $http.delete($this.attr("href")).then(function (result) {
                                                        var resultData = result.data;

                                                        if (resultData.OK == true) {
                                                            if (configureTableViewModel.afterdelete == null || configureTableViewModel.afterdelete($this.attr("href"), 1, result) == true) {
                                                                var modal = createSuccessModal("Registro excluído com sucesso.", "Registro Excluído");
                                                                modal.showModal();
                                                                loadData();
                                                            }
                                                        } else {
                                                            if (configureTableViewModel.afterdelete == null || configureTableViewModel.afterdelete($this.attr("href"), 0, result) == true) {
                                                                var modal = createErrorModal(resultData.Message, "Erro ao Excluir");
                                                                modal.showModal();
                                                            }
                                                        }
                                                    }, function (result) {
                                                        if (configureTableViewModel.afterdelete == null || configureTableViewModel.afterdelete($this.attr("href"), 0, result) == true) {
                                                            if (result.data.Message != null && result.data.Message != "") {
                                                                var modal = createErrorModal(result.data.Message, "Erro ao Excluir");
                                                                modal.showModal();
                                                            } else {
                                                                var modal = createErrorModal("Erro ao excluir registro. Por favor, tente novamente.", "Erro ao Excluir");
                                                                modal.showModal();
                                                            }
                                                        }
                                                    });
                                                }
                                            };
                                            confirmModal.showModal();
                                        }
                                    });
                                }
                            }
                        });
                    },
                    post: function (scope, element, attrs, controller, transcludeFn) { }
                }
            }
        }
    }]);
})(angular, jQuery);