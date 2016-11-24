import svg4everybody from 'svg4everybody';
import $ from 'jquery';
"use strict";

$(() => {
	svg4everybody();
});

$(() => {
	$.fn.validateForm = function(config){
	var form= $(this).closest('form');

const _check=function (){
	var error = [];
	var value = $(this).val().trim();

	if (('maxLenght' in config) && (value.length > config.maxLenght.value) ) {
		error.push(config.maxLenght.message);
	}
	if (('required' in config) && (!!value.length != config.required.value)) {
		error.push(config.required.message);
	} else if (('minLenght' in config) && (value.length < config.minLenght.value)) {
		error.push(config.minLenght.message);
	}

	if (('pattern' in config)) {
		var patterns=config.pattern;
		if(!(patterns instanceof Array)){
			patterns=[patterns];
		}
		for(var i=0;i<patterns.length;i++){
			var pattern=patterns[i];
			if(pattern.value.test(value)){
				error.push(pattern.message);
			}
		}
	}

		var isValid=error.length > 0;
		$(config.target).text(error[error.length-1]);
		$(this).toggleClass(config.classError, isValid);
		$(form).toggleClass(config.classError, isValid);
	};

	$(this).on('keyup', _check);

		$(form).on('submit',function(_event){ //перехват события отправки формы, перед отправкой обрабатываем содержимое внутри
			_check();//принудительный запуск валидации

			if($(this).hasClass(config.classError)){ //проверили наличие класса ошибки из конфига на ФОРМЕ
				_event.preventDefault(); //отменяет действие по умолчанию (отправку формы, если есть класс ошибки)
			}
		});
	};

	var configName = {
		maxLenght : {value:10 , message:'больше ввести нельзя '},
		minLenght : {value:3 , message:'меньше ввести нельзя '},
	 	required : {value:true , message:'Пожалуйста, укажите имя и фамилию/Please specify your first and last name'},
		pattern : {value:/^0/gim, message:'Введите телефонный номер в международном формате'},
		target : '.js-errorName',
		classError : 'error-for-form'
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
