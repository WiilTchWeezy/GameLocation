jQuery(function($){
    $.timepicker.regional['pt-BR'] = {
        hourText: 'Hora',
        minuteText: 'Minuto',
        amPmText: ['AM', 'PM'],
        closeButtonText: 'Fechar',
        nowButtonText: 'Agora',
        deselectButtonText: 'Limpar',
        showPeriodLabels: false
    }
    $.timepicker.setDefaults($.timepicker.regional['pt-BR']);
});