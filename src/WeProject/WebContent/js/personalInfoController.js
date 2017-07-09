(function () {
  'use strict';

  angular.module('app-web').controller('personalInfoController', ['$scope', 'userService', 'toastService', personalInfoController])

  function personalInfoController($scope, userService, toastService) {
    var vm = this;

    vm.resetPassword = function () {
      var passwordData = { OldPassword: vm.passwordReset.oldPassword, NewPassword: vm.passwordReset.newPassword };
      userService.resetPassword(passwordData).then(function (res) {
        window.history.back();
      }, function (error) {

      });
    }

    vm.setPersonalInfo = function () {
      var changedUser = new Object();
      var editItems = [];
      changedUser.ID = vm.personalAccount.ID;
      changedUser.Tel = vm.userInfo.Tel;
      changedUser.RealName = vm.userInfo.RealName;
      changedUser.addItems = vm.userInfo.Address;
      editItems.push(changedUser);

      var userData = {Add:'', Edit: editItems,Delete:'' };

      userService.syncUserData(userData).then(function (res) {
        toastService.toast('success', vm.language.SUCCESS_MESSAGE_SET_PERSON_INFO, vm.language.SUCCESS_TITTLE);
        window.history.back();
      }, function (error) {

      });
    }
    vm.init = function () {

      vm.language = new LanguageUtility();
      vm.personalAccount = { UserName: '', ID: '', Password: '' };
      vm.passwordReset = { oldPassword: '', newPassword: '', confirmPassword: '' };
      vm.userInfo = { Tel: '', RealName: '', Address: '' };
      vm.errorMessage = '';
    };

    vm.init();
  }
})();