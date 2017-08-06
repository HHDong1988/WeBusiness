(function () {
  'use strict';

  angular.module('app-web').controller('appController', ['$rootScope', '$scope', 'authService', 'userService', 'AUTH_EVENTS', appController]);

  function appController($rootScope, $scope, authService,userService, AUTH_EVENTS) {
    var vm = this;


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
      vm.passwordReset = { oldPassword: '', newPassword: '', confirmPassword: '' };
      vm.errorMessage = '';
      vm.isUserAuth = authService.isAuthenticated;
      vm.isUserAuth = function () {
        return true;
      }
      vm.isNewUser = function () {
       return vm.currentUser.bNewUser;
      }

      vm.isNewUser = function () {
       return false;
      }

      vm.showLogin = function () {
        return !vm.isUserAuth();
      }

      vm.showResetPassword = function () {
        return vm.isUserAuth() && vm.isNewUser();
      }

      vm.showMainWindow = function () {
        return vm.isUserAuth() && !vm.isNewUser();
      }

    };

    vm.init();
  }

})();