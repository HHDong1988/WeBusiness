(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope', '$scope', 'authService', 'userService', 'AUTH_EVENTS', appController]);

  function appController($rootScope, $scope, authService,userService, AUTH_EVENTS) {
    var vm = this;
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

    };

    vm.init();
  }

})();