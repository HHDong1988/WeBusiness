(function () {
  'use strict';

  angular.module('app-web').controller('headerController', headerController);

  function headerController(authService) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = vm.language.LOGIN;
    vm.logo = vm.language.LOGO;
  }

})();