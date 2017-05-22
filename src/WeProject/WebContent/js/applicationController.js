(function () {
  'use strict';

  angular.module('app-web').controller('applicationController', ['$scope','USER_ROLES','AUTH_EVENTS','authService',applicationController])

  function applicationController($scope, USER_ROLES, AUTH_EVENTS, authService) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.currentUser = null;
    vm.userRoles = USER_ROLES;
    vm.setCurrentUser = function (user) {
      vm.currentUser = user;
    };

    vm.setCurrentUser({userID:'Bobby', userRole:'2'});

    vm.isSuperAdmin = function () {
      return vm.currentUser.userRole == vm.userRoles.superAdmin;
    }

    $scope.$on(AUTH_EVENTS.loginSuccess, function (event, msg) {
      vm.setCurrentUser(msg);
    })
  }

})();