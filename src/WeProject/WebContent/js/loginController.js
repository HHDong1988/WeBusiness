(function () {
  'use strict';

  angular.module('app-web').controller('loginController', ['authService', 'AUTH_EVENTS', loginController]);

  function loginController(authService, AUTH_EVENTS) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = vm.language.LOGIN;
    vm.credential = { username: 'Bobby', password: '111' };
    //vm.isUserAuth = authService.isAuthenticated;
    vm.isUserAuth = false;
    vm.currentUser = { userID: '', userRole: '' };


    vm.login = function () {
      authService.logIn(vm.credential).then(function (user) {
        vm.currentUser = user;
        vm.isUserAuth = true;
        //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      }, function (error) {
        alert('error');
        //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
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