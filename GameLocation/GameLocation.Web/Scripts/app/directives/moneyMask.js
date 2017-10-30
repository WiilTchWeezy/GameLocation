; (function (angular) {
    "use strict";

    angular.module(config.module).directive("moneyMask", [function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var decimalPlaces = attrs.moneyMask;

                if (decimalPlaces == undefined)
                    decimalPlaces = 2;
                else
                    decimalPlaces = Number(decimalPlaces);

                function formatFloat(valor, decimal) {
                    var valorStr = "" + valor;
                    if ((valorStr.indexOf(",") < 0) && (valorStr.indexOf(".") < 0)) /*não tem virgula e nem ponto*/
                    {
                        valorStr = valorStr + ".00";
                    }
                    if ((valorStr.indexOf(",") >= 0) && (valorStr.indexOf(".") >= 0)) /*tem virgula e ponto*/
                    {
                        valorStr = valorStr.replace(".", "");
                    }
                    valorStr = valorStr.replace(",", ".");

                    valor = valorStr - 0;

                    if (decimal == null)
                        decimal = 2;
                    var anynum = valor;

                    var divisor = 10;
                    var dividerStr = "1";
                    for (var i = 0; i < decimal; i++) {
                        dividerStr = dividerStr + "0";
                    }
                    var divider = parseInt(dividerStr);

                    var workNum = Math.abs((Math.round(anynum * divider) / divider));
                    var workStr = "" + workNum;
                    if (workStr.indexOf(".") == -1) {
                        workStr += ".";
                    }

                    var dStr = workStr.substr(0, workStr.indexOf("."));
                    var dNum = dStr - 0;
                    var pStr = workStr.substr(workStr.indexOf("."));
                    pStr = pStr.replace(".", ",");

                    while (pStr.length - 1 < decimal) {
                        pStr += "0";
                    }
                    if (pStr == ",")
                        pStr = "";

                    if (dNum >= 1000) {
                        var dLen = dStr.length;
                        dStr = parseInt("" + (dNum / 1000)) + "." + dStr.substring(dLen - 3, dLen);
                    }

                    if (dNum >= 1000000) {
                        dLen = dStr.length;
                        dStr = parseInt("" + (dNum / 1000000)) + "." + dStr.substring(dLen - 7, dLen);
                    }

                    if (dNum >= 1000000000) {
                        dLen = dStr.length;
                        dStr = parseInt("" + (dNum / 1000000000)) + "." + dStr.substring(dLen - 11, dLen);
                    }

                    var retval = dStr + pStr;
                    /*quando for negativo colocar o - na frente*/
                    if (anynum < 0) { retval = "-" + retval; }
                    return retval;
                }

                //element.kendoNumericTextBox({
                //    decimals: decimalPlaces
                //});
                //
                
                //element.maskMoney({ allowNegative: true, decimal: ",", thousands: ".", precision: decimalPlaces, allowZero: true });

                element.keydown(function (e) {
                    var whichCode = (window.Event) ? e.which : e.keyCode;                    
                    if ((whichCode == 190) || (whichCode == 194)) //é .
                    {
                        if ($(this).val().indexOf(",") >= 0 || ($(this).val().indexOf(".") >= 0)) //ja tem , ou .
                            return false;
                        else {
                            var start, end;
                            if (typeof this.selectionStart == "number" && typeof this.selectionEnd == "number") {
                                // Non-IE browsers and IE 9
                                start = this.selectionStart;
                                end = this.selectionEnd;
                                this.value = $(this).val().slice(0, start) + "," + $(this).val().slice(end);

                                // Move the caret
                                this.selectionStart = this.selectionEnd = start + 1;
                            } else if (document.selection && document.selection.createRange) {
                                // For IE up to version 8
                                var selectionRange = document.selection.createRange();
                                var textInputRange = this.createTextRange();
                                var precedingRange = this.createTextRange();
                                var bookmark = selectionRange.getBookmark();
                                textInputRange.moveToBookmark(bookmark);
                                precedingRange.setEndPoint("EndToStart", textInputRange);
                                start = precedingRange.text.length;
                                end = start + selectionRange.text.length;

                                this.value = $(this).val().slice(0, start) + "," + $(this).val().slice(end);
                                start++;

                                // Move the caret
                                textInputRange = this.createTextRange();
                                textInputRange.collapse(true);
                                textInputRange.move("character", start - (this.value.slice(0, start).split("\r\n").length - 1));
                                textInputRange.select();
                            }
                            return false;
                        }
                    }

                    if (((whichCode >= 96) && (whichCode <= 105)) || ((whichCode >= 48) && (whichCode <= 57)) || (whichCode == 13) || (whichCode == 8) || (whichCode == 110) || (whichCode == 188) || (whichCode == 0) || (whichCode == 108) || (whichCode == 190) || (whichCode == 9) || (whichCode == 35) || (whichCode == 36) || (whichCode == 46) || (whichCode == 37) || (whichCode == 39) || (whichCode == 109) || (whichCode == 173)) {
                        if (((whichCode == 110) || (whichCode == 0) || (whichCode == 190) || (whichCode == 108)) && (($(this).val().indexOf(",") >= 0) || ($(this).val().indexOf(".") >= 0)))
                            return false;
                        else
                            return true;
                    } else {
                        return false;
                    }
                });

                element.blur(function (e) {
                    var casasDecimais = decimalPlaces;
                    var multiplicador = 1;
                    var valorStr = "" + $(this).val();
                    if ((valorStr.indexOf(",") < 0) && (valorStr.indexOf(".") < 0)) /*não tem virgula e nem ponto*/
                    {
                        valorStr = valorStr + ".00";
                    }

                    if (valorStr.indexOf("-") >= 0) {
                        multiplicador = -1;
                        valorStr = valorStr.replace("-", "");
                    }

                    if ((valorStr.indexOf(",") >= 0) && (valorStr.indexOf(".") >= 0)) /*tem virgula e ponto*/ {
                        valorStr = valorStr.replace(".", "");
                    }
                    valorStr = valorStr.replace(",", ".");
                    var valor = "";
                    if ((valorStr.indexOf(".") >= 0)) /*tem ponto*/
                        valor = valorStr;
                    else {
                        var max = valorStr.length;
                        if (valorStr != "")
                            valor = valorStr.substring(0, max) + "." + valorStr.substring(max);
                    }
                    if (valor != "") {
                        $(this).val(formatFloat(valor * multiplicador, casasDecimais));
                    }
                });
            }
        }
    }]);
})(angular);