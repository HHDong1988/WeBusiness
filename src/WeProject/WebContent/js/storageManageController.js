(function () {
  'use strict';

  angular.module('app-web').controller('storageManageController', ['$scope',storageManageController])

  function storageManageController($scope, userService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAddUser = function () {
      vm.userModalTittle = vm.language.USER_NEW;
      $('#userModal').modal()
    }

    vm.onEditUser = function (user) {
      vm.userModalTittle = vm.language.USER_EDIT;
      vm.editUser = user;
      $('#userModal').modal();
    }

    vm.onDeleteUser = function () {
      var startIndex = (vm.currentPage - 1) * vm.pageSize;
      var endIndex = vm.currentPage * vm.pageSize;

      for (var i = startIndex; i < endIndex; i++) {
        var user = vm.users[i];
        if (user.bSelect) {
          userService.deleteUser(user).then(function (res) {

          }, function (error) {

          });
        }
      }
      vm.refreshPage();
    }

    vm.saveUserChange = function () {
      if (vm.userModalTittle == vm.language.USER_NEW) {
        vm.editUser.UserTypeID = vm.editUser.UserType.id;
        userService.addUser(vm.editUser).then(function (res) {

        }, function (error) {

        });
      }
      else if (vm.userModalTittle == vm.language.USER_EDIT) {
        vm.editUser.UserTypeID = vm.editUser.UserType.id;
        userService.updateUser(vm.editUser).then(function (res) {

        }, function (error) {

        });
      }
      vm.editUser = {};
      $('#userModal').modal('hide');
      vm.refreshPage();
    }

    vm.createPages = function () {
      vm.pages = [];
      vm.totalPage =Math.ceil(vm.dataTotal / vm.pageSize);
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
          user.UserType = {name:vm.userTypes[user.UserTypeID - 1].name, id:user.UserTypeID};
          vm.dataTotal = res.data.total;
          vm.createPages();
        }
      }, function (error) {

      });
    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.selectPage = function () {
      var startIndex = (vm.currentPage - 1) * vm.pageSize;
      var endIndex = vm.currentPage * vm.pageSize;

      for (var i = startIndex; i < endIndex; i++) {
        var user = vm.users[i];
        user.bSelect = vm.bSelectCurrentPage;
      }
    }
    vm.init = function () {

      vm.language = new LanguageUtility();

      vm.userCount = 100;
      vm.pageSizeOptions = PAGE_SIZE_OPTIONS;
      vm.pageSize = PAGE_SIZE_OPTIONS[0];
      vm.pages = [];
      vm.currentPage = 1;
      vm.totalPage = 1;

      vm.dataTotal = 100;
      vm.dataBegin = 1;
      vm.dataEnd = 5;

      vm.userModalTittle = vm.language.USER_NEW;
      vm.editUser = { UserName: '', Password: '', UserType: {name:'', UserTypeID:''}, UserTypeID:'', Tel: '', RealName: '', Address: '' };

      vm.bSelectCurrentPage = false;

      vm.columnHeaders = [vm.language.STORAGE_ID,
      vm.language.STORAGE_NAME,
      vm.language.STORAGE_AMOUNT,
      vm.language.STORAGE_SOLD_AMOUNT];

      vm.userTypes = [{ name: vm.language.USER_ROLE_ADMIN, id: 1 },
      { name: vm.language.USER_ROLE_ASSISTENT, id: 2 },
      { name: vm.language.USER_ROLE_ACCOUNTANT, id: 3 },
      { name: vm.language.USER_ROLE_STORE, id: 4 },
      { name: vm.language.USER_ROLE_AGENCY_PRIMARY, id: 5 },
      { name: vm.language.USER_ROLE_AGENCY_SECONDAY, id: 6 },
      { name: vm.language.USER_ROLE_SUPER_ADMIN, id: 7 }];

      // vm.users = [{ UserName: 'bobby', UserTypeID: 'administrator', telephone: '123456', realName: 'DongHH', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Spencer', UserTypeID: 'administrator', telephone: '234567', realName: 'WangH', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false},
      // { UserName: 'Dennis', UserTypeID: 'administrator', telephone: '345678', realName: 'Dennis', address: 'Dalian', CreateTime: '2017-06-01', LastLoginTime: '2017-06-02', bSelect: false}];

      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();