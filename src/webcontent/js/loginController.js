(function () {
  'use strict';

  angular.module('app-user').controller('loginController', loginController);

  function loginController() {
    var vm = this;
    vm.tittle = 'admnistrator Login';
  }
  
})();