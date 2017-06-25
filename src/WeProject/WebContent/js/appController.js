(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope', '$scope', 'authService', 'menuService', 'USER_ROLES', 'AUTH_EVENTS', appController]);

  function appController($rootScope, $scope, authService, menuService, USER_ROLES, AUTH_EVENTS) {
    var vm = this;

    $scope.$on(AUTH_EVENTS.gotCookie, function (event, msg) {
      vm.currentUser = msg;
    });

    vm.login = function () {
      authService.logIn(vm.credential).then(function (user) {
        vm.currentUser = user;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
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
    };

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.credential = { username: '', password: '' };
      vm.isUserAuth = authService.isAuthenticated;
      // vm.isUserAuth = function () {
      //   return true;
      // }
      
      vm.currentUser = { userID: '', userRole: '' };
      vm.userRoles = USER_ROLES;

      vm.menus = [];
      var menuList = [{ value: vm.language.USER_MANAGEMENT, href: '#!/userManagement' },
                      { value: vm.language.PRODUCTS_MANAGEMENT, href: '#!/productsManagement' },
                      { value: vm.language.FINANCE_MANAGEMENT, href: '#!/financeManagement' },
                      { value: vm.language.STORAGE_MANAGEMENT, href: '#!/storageManagement' }];

      // vm.menus = menuList;

      for (var index = 0; index < menuService.menus.length; index++) {
        var element = menuService.menus[index];
        vm.menus.push(menuList[element]);
      }
    };

    vm.init();
  }

})();