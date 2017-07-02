(function () {
  'use strict';

  angular.module('app-web').controller('myBussinessController', ['$scope', 'userService', 'passwordGenerator', 'PAGE_SIZE_OPTIONS', userManageController])

  function myBussinessController($scope, userService, passwordGenerator, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAddUser = function () {
      var newPassword = passwordGenerator.createRandomPassword(8);
      var newUser = {
        ID: '',
        UserName: '',
        UserType: { value: { name: '', id: '' }, bDirty: false },
        RealName: { value: '', bDirty: false },
        Tel: { value: '', bDirty: false },
        Password: newPassword,
        Address: { value: '', bDirty: false },
        bSelect: false,
        bDelete: false,
        bDirty: false
      };

      vm.users.push(newUser);
      vm.refreshPaginator();
    }

    vm.onDeleteUser = function () {
      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (user.bSelect) {
          user.bDelete = true;
        }
      }

      vm.bSelectCurrentPage = false;
      vm.refreshPaginator();
    }

    vm.onRefresh = function () {

    }

    vm.onSync = function () {

    }

    vm.onResetPassword = function (user) {
      authService.resetPassword(user).then(function (res) {

      }, function (error) {

      });
    }

    vm.refreshPaginator = function () {
      vm.pages = [];
      vm.totalPage = Math.ceil(vm.dataTotal / vm.pageSize);
      for (var i = 1; i <= vm.totalPage; i++) {
        vm.pages.push(i);
      }
    }

    vm.prevPage = function () {
      if (vm.currentPage <= 1) {
        return;
      }

      vm.currentPage--;
      vm.gotoPage(vm.currentPage);
    }

    vm.nextPage = function () {
      if (vm.currentPage >= vm.totalPage) {
        return;
      }

      vm.currentPage++;
      vm.gotoPage(vm.currentPage);
    }

    vm.gotoPage = function (page) {
      if (page < 1) {
        return;
      }

      vm.currentPage = page;

      userService.getAllUsers(vm.currentPage, vm.pageSize).then(function (res) {
        vm.users = res.data.data;
        for (var i = 0; i < vm.users.length; i++) {
          var user = vm.users[i];
          user.bSelect = false;
          user.UserType = { name: vm.userTypes[user.UserTypeID - 1].name, id: user.UserTypeID };
          vm.dataTotal = res.data.total;
          vm.refreshPaginator();
        }
      }, function (error) {

      });
    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.selectPage = function () {
      var startIndex = (vm.currentPage - 1) * vm.pageSize;
    }
    vm.init = function () {

      vm.language = new LanguageUtility();

      vm.pageSizeOptions = PAGE_SIZE_OPTIONS;
      vm.pageSize = PAGE_SIZE_OPTIONS[0];
      vm.pages = [];
      vm.currentPage = 1;
      vm.totalPage = 1;

      vm.dataTotal = 100;
      vm.currentPageSize = 0;

      vm.bSelectCurrentPage = false;

      vm.columnHeaders = [vm.language.USER_ID,
      vm.language.USER_NAME,
      vm.language.USER_TYPE,
      vm.language.USER_REAL_NAME,
      vm.language.USER_TEL,
      vm.language.USER_ADDRESS,
      vm.language.USER_PASSWORD,
      vm.language.USER_LAST_LOGIN_TIME,
      vm.language.USER_SUPERIOR_USER];

      vm.userTypes = [{ name: vm.language.USER_ROLE_ADMIN, id: 1 },
      { name: vm.language.USER_ROLE_ASSISTENT, id: 2 },
      { name: vm.language.USER_ROLE_ACCOUNTANT, id: 3 },
      { name: vm.language.USER_ROLE_STORE, id: 4 },
      { name: vm.language.USER_ROLE_AGENCY_PRIMARY, id: 5 },
      { name: vm.language.USER_ROLE_AGENCY_SECONDAY, id: 6 },
      { name: vm.language.USER_ROLE_SUPER_ADMIN, id: 7 }];

      vm.users = [];



      // vm.users = [{ UserName: 'bobby', UserTypeID: 'administrator', telephone: '123456', realName: 'DongHH', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Spencer', UserTypeID: 'administrator', telephone: '234567', realName: 'WangH', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false}];

      //vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();