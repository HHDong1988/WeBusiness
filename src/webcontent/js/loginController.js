(function () {
  'use strict';

  angular.module('app-web').controller('loginController', ['authService', loginController]);

  function loginController(authService) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = vm.language.LOGIN;
    vm.credential = { userName: 'bobby', passWord: '123456' };
    vm.isUserAuth = false;


    vm.login = function () {
      alert('login');
      authService.login(vm.credential).then(function (user) {

      }, function () {

      });
    };
  }

})();