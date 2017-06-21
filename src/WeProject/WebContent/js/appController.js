(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope','$scope','authService', 'menuService','USER_ROLES', 'AUTH_EVENTS', appController]);

  function appController($rootScope, $scope,authService,menuService, USER_ROLES, AUTH_EVENTS) {
    var vm = this;
    vm.language = new LanguageUtility();
    vm.tittle = vm.language.LOGIN;

    vm.credential = { username: '', password: '' };
    vm.isUserAuth = authService.isAuthenticated;

    vm.currentUser = { userID: '', userRole: '' };
    vm.userRoles = USER_ROLES;

    vm.menus = [{value: vm.language.USER_MANAGEMENT, href: '#!/userManagment'},
                {value: vm.language.STORAGE_MANAGEMENT, href: '#!/storageManagement'},
                {value: vm.language.PRODUCTS_MANAGEMENT, href: '#!/productsManagement'}];

    vm.login = function () {
      authService.logIn(vm.credential).then(function (user) {
        vm.currentUser = user;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess,user);
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };

    vm.logOff = function () {
      authService.logOff().then(function (res) {
        vm.currentUser = { userID: '', userRole: '' };
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
      });
    }
    $scope.$on(AUTH_EVENTS.gotCookie, function (event, msg) {
      vm.currentUser = msg;
    })
  }

})();