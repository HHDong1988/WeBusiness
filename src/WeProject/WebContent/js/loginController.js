(function () {
  'use strict';

  angular.module('app-web').controller('loginController', ['$rootScope','authService', 'AUTH_EVENTS', loginController]);

  function loginController($rootScope, authService, AUTH_EVENTS) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = vm.language.LOGIN;
    vm.credential = { username: '', password: '' };
    vm.isUserAuth = authService.isAuthenticated;
    vm.currentUser = { userID: '', userRole: '' };


    vm.login = function () {
      authService.logIn(vm.credential).then(function (user) {
        vm.currentUser = user;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess,user);
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };

    vm.logOut = function () {
      authService.logOut().then(function (res) {
        vm.currentUser = { userID: '', userRole: '' };
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
      });
    }
  }

})();