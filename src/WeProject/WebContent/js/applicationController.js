(function () {
  'use strict';

  angular.module('app-web').controller('applicationController', ['USER_ROLES','authService',applicationController])

  function applicationController(USER_ROLES, authService) {
    var vm = this;

    vm.currentUser = null;
    vm.userRoles = USER_ROLES;
    vm.isAuthorized = authService.isAuthorized;

    vm.setCurrentUser = function (user) {
      vm.currentUser = user;
    };
  }

})();