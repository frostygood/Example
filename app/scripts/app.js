import svg4everybody from 'svg4everybody';
import $ from 'jquery';
"use strict";

$(() => {
	svg4everybody();
});

$(() => {
	$.fn.validateName = function(configName){
		$(this).on('keyup', function (){
			var error = [];
			var value = $(this).val().trim();
			if (('maxLenght' in configName) && (value.length > configName.maxLenght) ) {
				error.push('больше 100 символов ввести нельзя');
			}
			$(configName.target).text(error.join(' '));
			$(this).toggleClass(configName.classError, error.length > 0);
		});
	};
	$.fn.validatePass = function(configPass){
		$(this).on('keyup', function (){
			var error = [];
			var value = $(this).val().trim();
			if (('maxLenght' in configPass) && (value.length > configPass.maxLenght) ) {
				error.push('больше 100 символов ввести нельзя');
			}
			if (('minLenght' in configPass) && (value.length < configPass.minLenght) ) {
				error.push('Пароль не может быть короче 6 символов');
			}
			$(configPass.target).text(error.join(' '));
			$(this).toggleClass(configPass.classError, error.length > 0);
		});
	};
	$.fn.validatePhone = function(configPhone){
		$(this).on('keyup', function (){
			var error = [];
			var value = $(this).val().trim();
			if (('maxLenght' in configPhone) && (value.length > configPhone.maxLenght) ) {
				error.push('больше 100 символов ввести нельзя');
			}
			$(configPhone.target).text(error.join(' '));
			$(this).toggleClass(configPhone.classError, error.length > 0);
		});
	};
	$.fn.validateCompany = function(configCompany){
		$(this).on('keyup', function (){
			var error = [];
			var value = $(this).val().trim();
			if (('maxLenght' in configCompany) && (value.length > configCompany.maxLenght) ) {
				error.push('больше 100 символов ввести нельзя');
			}
			if (('minLenght' in configCompany) && (value.length < configCompany.minLenght) ) {
				error.push('Название компании не может быть короче 2 символов/The company name cannot be shorter than 2 symbols');
			}
			$(configCompany.target).text(error.join(' '));
			$(this).toggleClass(configCompany.classError, error.length > 0);
		});
	};
	$.fn.validateEmail = function(configEmail){
		$(this).on('keyup', function (){
			var error = [];
			var value = $(this).val().trim();
			if (('maxLenght' in configEmail) && (value.length > configEmail.maxLenght) ) {
				error.push('больше 318 символов ввести нельзя');
			}
			$(configEmail.target).text(error.join(' '));
			$(this).toggleClass(configEmail.classError, error.length > 0);
		});
	};
	var configName = {
		maxLenght : 10,
		target : '.js-errorName',
		classError : 'error-for-form'
	};
	var configPass = {
		maxLenght : 10,
		minLenght : 6,
		target : '.js-errorPass',
		classError : 'error-for-form'
	};
	var configPhone = {
		maxLenght : 10,
		target : '.js-errorPhone',
		classError : 'error-for-form'
	};
	var configCompany = {
		maxLenght : 10,
		minLenght : 2,
		target : '.js-errorCompany',
		classError : 'error-for-form'
	};
	var configEmail = {
		maxLenght : 18,
		target : '.js-errorEmail',
		classError : 'error-for-form'
	};
	$('.js-inputName').validateName(configName);
	$('.js-inputPass').validatePass(configPass);
	$('.js-inputPhone').validatePhone(configPhone);
	$('.js-inputCompany').validateCompany(configCompany);
	$('.js-inputEmail').validateCompany(configEmail);
});
