(function () {
  'use strict';

  angular.module('app-web').controller('loginController', ['authService', loginController]);

  function loginController(authService) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = languange.LOGIN;
    vm.credential = { userName: '', passWord: '' };

    vm.login = function (credential) {
      authService.login(redential).then(function (user) {

      }, function () {

      });
    };
  }

})();