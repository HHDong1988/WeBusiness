(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope', '$scope', 'authService', 'menuService', 'USER_ROLES', 'AUTH_EVENTS','MENU_EVENT', appController]);

  function appController($rootScope, $scope, authService, menuService, USER_ROLES, AUTH_EVENTS,MENU_EVENT) {
    var vm = this;

    // $scope.$on(MENU_EVENT.menuList, function (event, msg) {
    //   vm.menus = [];
    //   for (var i = 0; i < msg.menuList.length; i++) {
    //     var element = msg.menuList[i];
    //     vm.menus.push(vm.menuList[element]);       
    //   }
    // });

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
      vm.menuList = [{ value: vm.language.USER_MANAGEMENT, href: '#!/userManagement' },
                      { value: vm.language.PRODUCTS_MANAGEMENT, href: '#!/productsManagement' },
                      { value: vm.language.FINANCE_MANAGEMENT, href: '#!/financeManagement' },
                      { value: vm.language.STORAGE_MANAGEMENT, href: '#!/storageManagement' }];
      vm.menus = vm.menuList;
    };

    vm.init();
  }

})();