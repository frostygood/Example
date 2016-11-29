import svg4everybody from 'svg4everybody';
import $ from 'jquery';

"use strict";

$(() => {
	$.fn.validateForm = function (config) {//создаем виджет
		var form = $(this).closest('form'); //по зис попали на инпут, потом поднялись к ближайшему родителю и записали в переменную
		var input = $(this); //записали в переменную обращение к инпуту

		$(this).on('checkInput keyup', function(_event) { //в константу запихнули валидатор, чтобы его нельзя было изменить, и не вызывать когда нужно
			var error = []; //создали массив для записи ошибок
			var value = $(input).val().trim(); //записали в переменную содержимое текущего инпута без пробелов справа и слева

			if (('phoneNumbers' in config) && (config.phoneNumbers == true)) { //если в конфиге есть свойство фоннамбер, то
				$(input).val(value.replace(/^\+|\D+/gi, '')); //удалять все символы кроме цифр
				$(input).blur(function() { //срабатывает при снятии фокуса
					if ((value.substr(0, 1) == 8) && (value.length == 11)) { //если первая цифра 8 и общая длина 11, то
						$(input).val('+7' + value.substr(1, value.length)); //убить првый символ и добавить в начала +7
					} else {
						$(input).val('+' + value); //иначе просто добавить плюсик
					}
				});
			}

			if (('validEmail' in config) && (config.validEmail.value == true)) { //если в конфиге есть свойство валидЭмейл, то
				var emails = /^[\w\-\.]{1,64}@[\w\-]{1,253}\.[\w\-]{2,6}$/gim; //начало строки, английские буквы от одной до бесконечности + разрешенные символы, собака, опять буквы от одной до бесконечности + разрешенные символы, точка, буквы от двух до четырёх (если почта где-нибудь на .info), конец строки. Регистр букв не учитывается
				console.log('вошли в валидацию почты')
				if (!emails.test(value)) {
					error.push(config.validEmail.message);
				}
			}

			if (('pattern' in config)) { //если в конфиге есть свойство паттерн, то
				var patterns = config.pattern; //занесли свойство в перменную
				if (!(patterns instanceof Array)) { //если паттерн - это НЕ массив, то
					patterns = [patterns]; //то превращаем паттерн в массив, чтобы можно было в будущем использовать несколько паттернов сразу
				}
				for (var i = 0; i < patterns.length; i++) { //проходим по массиву патернов по очереди по каждом паттерну, начиная с первого
					var pattern = patterns[i]; //заносим в переменную
					if (value.match(pattern.value)) { //проверили регулярное выражение из конкретного паттерна с содержимым инпута
						error.push(pattern.message); //если совпало, то записали мессагу из паттерна в конец массива с эррорами
					}
				}
			}

			if (('maxLenght' in config) && (value.length > config.maxLenght.value)) { //если есть в конфиге есть свойство максЛенгхт, и выполняется сл.условие
				error.push(config.maxLenght.message); //записали в конец массива месагу из масЛенгхт
			}

			if (('required' in config) && (!!value.length != config.required.value)) { //если есть рекваед(проверка на наличие заполнения) и он совпадает булом числового значения
				error.push(config.required.message); //записали в конец массива месагу из рекваед
			} else if (('minLenght' in config) && (value.length < config.minLenght.value)) { //иначе если есть минХейгхт есть в конфиге и они меньше длины значения инпута то
				error.push(config.minLenght.message); //записали в конец массива месагу из минЛенгхт
			}

			var isInvalid = error.length > 0; //если в массиве эрроров что-то есть, то записываем в переменную true , иначе false
			$(config.classTarget).text(isInvalid ? error[error.length - 1] : ''); //в класс указанный в свойстве таргет в конкретном конфиге записывается мессага из последнего элемента в массиве эрроров
			$(input).toggleClass(config.classError, isInvalid); //на выбранном инпуте включился/выключился классЭррор в зависимсти от того, если в массиве эрроров что-то или нет
			$(form).toggleClass(config.classError, isInvalid); //если есть ошибки, то вегаем на всю форму класс ошибки, чтобы стопиться в дальнейшем при попытке отправки формы
		});

		$(form).on('submit', function(_event) { //перехват события отправки формы, перед отправкой обрабатываем содержимое внутри
			$(input).trigger('checkInput'); //принудительный запуск валидации
			if ($(this).hasClass(config.classError)) { //проверили наличие класса ошибки из конфига на ФОРМЕ
				_event.preventDefault(); //отменяет действие по умолчанию (отправку формы, если есть класс ошибки)
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
		classTarget: '.js-errorName',
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
		classTarget: '.js-errorPass',
		classError: 'error-for-form'
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
		required: {
			value: true,
			message: 'Введите номер телефона'
		},
		classTarget: '.js-errorPhone',
		classError: 'error-for-form'
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
		classTarget: '.js-errorCompany',
		classError: 'error-for-form'
	};
	var configEmail = {
		classTarget: '.js-errorEmail',
		classError: 'error-for-form',
		maxLenght: {
			value: 318,
			message: 'больше 318 символов ввести нельзя '
		},
		validEmail: {
			value: true,
			message: 'Некорректный адрес электронной почты'
		}
	};
	$('.js-inputName').validateForm(configName);
	$('.js-inputPass').validateForm(configPass);
	$('.js-inputPhone').validateForm(configPhone);
	$('.js-inputCompany').validateForm(configCompany);
	$('.js-inputEmail').validateForm(configEmail);
});

$(() => {
	svg4everybody();
	var query = getUrlVars(); //вызываем функцию получения перменных
	var varialbes={ //сказали так круче , порефакторил
		'.js-inputName':'name',
			'.js-inputPhone':'phone',
				'.js-inputCompany':'co',
					'.js-inputEmail':'email'
	};
for(var i in varialbes){
	if(typeof query[varialbes[i]]!=='undefined'){
		$(i).val(query[varialbes[i]]).trigger('keyup');
	}
}
	// if (Object.keys(query).length > 0) { //если в урл были найдены данные для заполнения формы, то она заполняется (keys получает все ключи объекта)
	// 	$('.js-inputName').val(query['firstAndLastName']).trigger('keyup'); //записываем значение но ключу name и вызываем событие "клавиша вверх", чтобы запустить валидацию
	// 	$('.js-inputPhone').val(query['phone']).trigger('keyup');
	// 	$('.js-inputCompany').val(query['company']).trigger('keyup');
	// 	$('.js-inputEmail').val(query['email']).trigger('keyup');
	// 	$('.js-inputPass').val(query['password']).trigger('keyup');
  // }
});

function getUrlVars() { //инициализировали функцию получения переменных из урл строки
    var vars = {}; //создали объект для хранения переменных из урл
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { //выковырнули все переменные из урла (тут копипаст)
        vars[key] = decodeURIComponent(value);//записывает в массив с ключем key и декодирует русские символы
				//   url /?phone=12345&email=test@mail.ru
				// vars = {phone: 12345, email: test@mail.ru}
				//это шобы не забыть
    });
    return vars; //возвращаем заполненный объект
}
