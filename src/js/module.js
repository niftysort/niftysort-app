'use strict';

var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('main', { url: '/', templateUrl: '/partials/main.html', controller: 'mainCtrl' })

  $urlRouterProvider.otherwise('/');
});
