(function () {
  'use strict';

  angular.module('app-user', ['ngRoute'])
    .config(function ($routeProvider) {

      $routeProvider.when('/', {
        controller: 'loginController',
        controllerAs:'vm',
        templateUrl: 'views/userlogin.html'
      });

      $routeProvider.otherwise({ redirectTo: "/" });

    })

})();