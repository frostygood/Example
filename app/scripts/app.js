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

        $(this).on('checkInput keyup', function(_event) { //в константу запихнули валидатор, чтобы его нельзя было изменить, и не вызывать когда нужно
            var error = []; //создали массив для записи ошибок
						var value = $(input).val().trim(); //записали в переменную содержимое текущего инпута без пробелов справа и слева

						if (('phoneNumbers' in config) && (config.phoneNumbers == true)) { // если в конфиге есть свойство фоннамбер, то
								$(input).val(value.replace(/^\+|\D+/gi, '')); //удалять все символы кроме цифр
								$(input).blur(function(){											//срабатывает при снятии фокуса
									if ((value.substr(0,1) == 8)&&(value.length == 11)) {		//если первая цифра 8 и общая длина 11, то
										$(input).val('+7' + value.substr(1,value.length));		//убить првый символ и добавить в начала +7
									} else {
										$(input).val('+' + value); 														//иначе просто добавить плюсик
									}
								});
						}

						if (('validEmail' in config) && (config.validEmail.value == true)) { // если в конфиге есть свойство валидЭмейл, то
								var emails = /^[\w\-]{1,64}@[\w\-]{1,253}\.[\w\-]{2,6}$/gim; //начало строки, английские буквы от одной до бесконечности + разрешенные символы, собака, опять буквы от одной до бесконечности + разрешенные символы, точка, буквы от двух до четырёх (если почта где-нибудь на .info), конец строки. Регистр букв не учитывается
								console.log('вошли в валидацию почты')
								if (!emails.test(value)) {
									error.push(config.validEmail.message);
								}
						}

						if (('pattern' in config)) { 						// если в конфиге есть свойство паттерн, то
								var patterns = config.pattern; 			//занесли свойство в перменную
								if (!(patterns instanceof Array)) { //если паттерн - это НЕ массив, то
										patterns = [patterns]; 					//то превращаем паттерн в массив, чтобы можно было в будущем использовать несколько паттернов сразу
								}
								for (var i = 0; i < patterns.length; i++) { //проходим по массиву патернов по очереди по каждом паттерну, начиная с первого
										var pattern = patterns[i]; 							//заносим в переменную
										if (value.match(pattern.value)) { 			//проверили регулярное выражение из конкретного паттерна с содержимым инпута
												error.push(pattern.message); 				//если совпало, то записали мессагу из паттерна в конец массива с эррорами
										}
								}
						}

						if (('maxLenght' in config) && (value.length > config.maxLenght.value)) { //если есть в конфиге есть свойство максЛенгхт, и выполняется сл.условие
                error.push(config.maxLenght.message); 																//записали в конец массива месагу из масЛенгхт
            }

            if (('required' in config) && (!!value.length != config.required.value)) { //если есть рекваед(проверка на наличие заполнения) и он совпадает булом числового значения
                error.push(config.required.message); 																		//записали в конец массива месагу из рекваед
            } else if (('minLenght' in config) && (value.length < config.minLenght.value)) { //иначе если есть минХейгхт есть в конфиге и они меньше длины значения инпута то
                error.push(config.minLenght.message); 																				//записали в конец массива месагу из минЛенгхт
            }

            var isInvalid = error.length > 0; 														//если в массиве эрроров что-то есть, то записываем в переменную true , иначе false
            $(config.target).text(isInvalid?error[error.length - 1]:''); 	//в класс указанный в свойстве таргет в конкретном конфиге записывается мессага из последнего элемента в массиве эрроров
            $(input).toggleClass(config.classError, isInvalid); 					//на выбранном инпуте включился/выключился классЭррор в зависимсти от того, если в массиве эрроров что-то или нет
            $(form).toggleClass(config.classError, isInvalid);					  //если есть ошибки, то вегаем на всю форму класс ошибки, чтобы стопиться в дальнейшем при попытке отправки формы
        });

        $(form).on('submit', function(_event) { //перехват события отправки формы, перед отправкой обрабатываем содержимое внутри
            $(input).trigger('checkInput'); 		//принудительный запуск валидации
            if ($(this).hasClass(config.classError)) { //проверили наличие класса ошибки из конфига на ФОРМЕ
                _event.preventDefault(); 							//отменяет действие по умолчанию (отправку формы, если есть класс ошибки)
            }
        });
    };

    var configName = {
			maxLenght: {
					value: 100,
					message: 'больше 100 символов ввести нельзя '
			},
			required: {
					value: true,
					message: 'Пожалуйста, укажите имя и фамилию/Please specify your first and last name'
			},
        target: '.js-errorName',
        classError: 'error-for-form',
    };

    var configPass = {
			maxLenght: {
					value: 100,
					message: 'больше 100 символов ввести нельзя '
			},
			minLenght: {
					value: 6,
					message: 'Пароль не может быть короче 6 символов'
			},
			required: {
					value: true,
					message: 'Введите пароль'
			},
    	target : '.js-errorPass',
    	classError : 'error-for-form'
    };

    var configPhone = {
			maxLenght: {
					value: 100,
					message: 'больше 100 символов ввести нельзя '
			},
			pattern: {
					value: /^0/gim,
					message: 'Введите телефонный номер в международном формате'
			},
			phoneNumbers: true,
    	target : '.js-errorPhone',
    	classError : 'error-for-form'
    };
    var configCompany = {
			maxLenght: {
					value: 100,
					message: 'больше 100 символов ввести нельзя '
			},
			minLenght: {
					value: 2,
					message: 'Название компании не может быть короче 2 символов/The company name cannot be shorter than 2 symbols'
			},
			required: {
					value: true,
					message: 'Укажите название компании/Specify your company name'
			},
    	target : '.js-errorCompany',
    	classError : 'error-for-form'
    };
    var configEmail = {
			maxLenght: {
					value: 318,
					message: 'больше 318 символов ввести нельзя '
			},
			validEmail: {
					value: true,
					message: 'Некорректный адрес электронной почты'
			}
    	target : '.js-errorEmail',
    	classError : 'error-for-form'
    };
    $('.js-inputName').validateForm(configName);
    $('.js-inputPass').validateForm(configPass);
    $('.js-inputPhone').validateForm(configPhone);
    $('.js-inputCompany').validateForm(configCompany);
    $('.js-inputEmail').validateForm(configEmail);
});
