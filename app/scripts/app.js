import svg4everybody from 'svg4everybody';
import $ from 'jquery';
"use strict";

$(() => {
	svg4everybody();
});

$(() => {
    $.fn.validateForm = function(config) { //создаем виджет
        var form = $(this).closest('form'); //по зис попали на инпут, потом поднялись к ближайшему родителю и записали в переменную
        var input = $(this); //записали в переменную обращение к инпуту

        const _check = function() { //в константу запихнули валидатор, чтобы его нельзя было изменить, и не вызывать когда нужно
            var error = []; //создали массив для записи ошибок
            var value = $(input).val().trim(); //записали в переменную содержимое текущего инпута без пробелов справа и слева

            if (('maxLenght' in config) && (value.length > config.maxLenght.value)) { //если есть в конфиге есть свойство максЛенгхт, и выполняется сл.условие
                error.push(config.maxLenght.message); //записали в конец массива месагу из масЛенгхт
            }
            if (('required' in config) && (!!value.length != config.required.value)) { //если есть рекваед(проверка на наличие заполнения) и он совпадает булом числового значения
                error.push(config.required.message); //записали в конец массива месагу из рекваед
            } else if (('minLenght' in config) && (value.length < config.minLenght.value)) { //иначе если есть минХейгхт есть в конфиге и они меньше длины значения инпута то
                error.push(config.minLenght.message); //записали в конец массива месагу из минЛенгхт
            }

            if (('pattern' in config)) { // если в конфиге есть свойство паттерн, то
                var patterns = config.pattern; //занесли свойство в перменную
                if (!(patterns instanceof Array)) { //если паттерн - это НЕ массив, то
                    patterns = [patterns]; //то превращаем паттерн в массив, чтобы можно было в будущем использовать несколько паттернов сразу
                }
                for (var i = 0; i < patterns.length; i++) { //проходим по массиву патернов по очереди по каждом паттерну, начиная с первого
                    var pattern = patterns[i]; //заносим в переменную
                    if (pattern.value.test(value)) { //проверили регулярное выражение из конкретного паттерна с содержимым инпута
                        error.push(pattern.message); //если совпало, то записали мессагу из паттерна в конец массива с эррорами
                    }
                }
            }

            var isValid = error.length > 0; //если в массиве эрроров что-то есть, то записываем в переменную true , иначе false
            $(config.target).text(error[error.length - 1]); //в класс указанный в свойстве таргет в конкретном конфиге записывается мессага из последнего элемента в массиве эрроров
            $(input).toggleClass(config.classError, isValid); //на выбранном инпуте включился/выключился классЭррор в зависимсти от того, если в массиве эрроров что-то или нет
            $(form).toggleClass(config.classError, isValid); //если есть ошибки, то вегаем на всю форму класс ошибки, чтобы стопиться в дальнейшем при попытке отправки формы
        };

        $(this).on('keyup', _check); //вешаем обработчик на событие отпускании кнопки

        $(form).on('submit', function(_event) { //перехват события отправки формы, перед отправкой обрабатываем содержимое внутри
            _check(); //принудительный запуск валидации

            if ($(this).hasClass(config.classError)) { //проверили наличие класса ошибки из конфига на ФОРМЕ
                _event.preventDefault(); //отменяет действие по умолчанию (отправку формы, если есть класс ошибки)
            }
        });
    };

    var configName = {
        maxLenght: {
            value: 10,
            message: 'больше ввести нельзя '
        },
        minLenght: {
            value: 3,
            message: 'меньше ввести нельзя '
        },
        required: {
            value: true,
            message: 'Пожалуйста, укажите имя и фамилию/Please specify your first and last name'
        },
        pattern: {
            value: /^0/gim,
            message: 'Введите телефонный номер в международном формате'
        },
        target: '.js-errorName',
        classError: 'error-for-form'
    };
    // var configPass = {
    // 	maxLenght : 10,
    // 	minLenght : 6,
    // 	target : '.js-errorPass',
    // 	classError : 'error-for-form'
    // };
    // var configPhone = {
    // 	maxLenght : 10,
    // 	target : '.js-errorPhone',
    // 	classError : 'error-for-form'
    // };
    // var configCompany = {
    // 	maxLenght : 10,
    // 	minLenght : 2,
    // 	target : '.js-errorCompany',
    // 	classError : 'error-for-form'
    // };
    // var configEmail = {
    // 	maxLenght : 18,
    // 	target : '.js-errorEmail',
    // 	classError : 'error-for-form'
    // };
    $('.js-inputName').validateForm(configName);
    // $('.js-inputPass').validateForm(configPass);
    // $('.js-inputPhone').validateForm(configPhone);
    // $('.js-inputCompany').validateForm(configCompany);
    // $('.js-inputEmail').validateForm(configEmail);
});
