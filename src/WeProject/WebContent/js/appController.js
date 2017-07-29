(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope', '$scope', 'authService', 'userService', 'menuService', 'USER_ROLES', 'AUTH_EVENTS', 'MENU_EVENT', appController]);

  function appController($rootScope, $scope, authService,userService, menuService, USER_ROLES, AUTH_EVENTS, MENU_EVENT) {
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
        if (user.userID == '') {
          vm.errorMessage = user.message;
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        }
        else{
          vm.currentUser = user;
          vm.errorMessage = '';
          userService.getAllPrimaryAgencies();
          menuService.getMenus();
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
        }
      }, function (error) {
        vm.errorMessage = error;
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };

    vm.logOff = function () {
      authService.logOff().then(function (res) {
        vm.currentUser = { userID: '', userRole: '', bNewUser: true };
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
      });
    };

    vm.ChangePassword = function () {
      
    }

    vm.setPersonalInfo = function () {
      userService.setPersonInfo(vm.userInfo).then(function (res) {
        
      }, function (error) {
        
      });
    }


    vm.resetPassword = function () {
      var passwordData = {OldPassword: vm.passwordReset.oldPassword, NewPassword:vm.passwordReset.newPassword};
      userService.resetPassword(passwordData).then(function (res) {
        vm.currentUser.bNewUser = false;
      }, function (error) {

      });
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.credential = { username: '', password: '' };
      vm.currentUser = { userID: '', userRole: '', bNewUser: false };
      vm.userInfo = {Tel:'',RealName:'',Address:''};
      vm.userRoles = USER_ROLES;
      vm.passwordReset = { oldPassword: '', newPassword: '', confirmPassword: '' };
      vm.errorMessage = '';
      vm.isUserAuth = authService.isAuthenticated;
      // vm.isUserAuth = function () {
      //   return true;
      // }
      vm.isNewUser = function () {
       return vm.currentUser.bNewUser;
      }

      // vm.isNewUser = function () {
      //  return false;
      // }

      vm.showLogin = function () {
        return !vm.isUserAuth();
      }

      vm.showResetPassword = function () {
        return vm.isUserAuth() && vm.isNewUser();
      }

      vm.showMainWindow = function () {
        return vm.isUserAuth() && !vm.isNewUser();
      }

      vm.menus = [];
      vm.menuList = [{ value: vm.language.USER_MANAGEMENT, href: '#!/userManagement' },
      { value: vm.language.FINANCE_MANAGEMENT, href: '#!/financeManagement' },
      { value: vm.language.STOCK_MANAGEMENT, href: '#!/stockManagement' },
      { value: vm.language.SALES_MENU_SALES_INFO, href: '#!/salesInfo' }];
      vm.menus = vm.menuList;
    };

    vm.init();
  }

})();