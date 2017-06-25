(function () {
  'use strict';

  angular.module('app-web').controller('userManageController', ['$scope', 'userService', 'PAGE_SIZE_OPTIONS', userManageController])

  function userManageController($scope, userService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAddUser = function () {
      vm.userModalTittle = vm.language.USER_NEW;
      $('#userModal').modal()
    }

    vm.onEditUser = function (user) {
      vm.userModalTittle = vm.language.USER_EDIT;
      user.UserTypeID = user.UserType.id;
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
    }

    vm.saveUserChange = function () {
      if (vm.userModalTittle == vm.language.USER_NEW) {
        userService.addUser(vm.editUser).then(function (res) {

        }, function (error) {

        });
      }
      else if (vm.userModalTittle == vm.language.USER_EDIT) {
        userService.updateUser(vm.editUser).then(function (res) {

        }, function (error) {

        });
      }
      vm.editUser = {};
      $('#userModal').modal('hide')

    }

    vm.createPages = function () {
      vm.pages = [];
      var pageCount = vm.userCount / vm.pageSize;
      for (var i = 1; i <= pageCount; i++) {
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
      if (page < 1 || page > vm.totalPage) {
        return;
      }

      vm.currentPage = page;

      userService.getAllUsers(vm.currentPage, vm.pageSize).then(function (res) {
        vm.users = res.data.data;
        for (var i = 0; i < vm.users.length; i++) {
          var user = vm.users[i];
          user.bSelect = false;
          user.UserType = {name:vm.userTypes[user.UserTypeID - 1].name, id:user.UserTypeID};
        }
      }, function (error) {

      });
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
      vm.editUser = { UserName: '', PassWord: '', UserType: {name:'', UserTypeID:''}, Tel: '', RealName: '', Address: '' };

      vm.bSelectCurrentPage = false;


      vm.columnHeaders = [vm.language.USER_NAME,
      vm.language.USER_TYPE,
      vm.language.USER_TEL,
      vm.language.USER_REAL_NAME,
      vm.language.USER_ADDRESS,
      vm.language.USER_CREATE_TIME,
      vm.language.USER_LAST_LOGIN_TIME];

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
      vm.createPages();
    };

    vm.init();
  }
})();