(function () {
  'use strict';

  angular.module('app-web').controller('userManageController', ['$scope','menuService', 'userService', 'USER_ROLES', 'toastService', 'passwordGenerator', 'PAGE_SIZE_OPTIONS', userManageController])

  function userManageController($scope,menuService, userService, USER_ROLES, toastService, passwordGenerator, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAddUser = function () {
      var currentCount = 0;
      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (!user.bDelete) {
          currentCount++;
        }
      }
      if (currentCount >= vm.pageSize + 1) {
        toastService.toast('warning', vm.language.WARNING_MESSAGE_SAVE_USERS, vm.language.WARNING_TITTLE);
        return;
      }

      var newPassword = passwordGenerator.createRandomPassword(8);
      var newUser = {
        ID: '',
        UserName: '',
        UserTypeID: { value: 4, bDirty: false },
        RealName: { value: '', bDirty: false },
        Tel: { value: '', bDirty: false },
        Password: newPassword,
        Address: { value: '', bDirty: false },
        UpperID: { value: 0, bDirty: false },
        AliveUser: true,
        bSelect: false,
        bResetPassword: false,
        bDirty: false
      };

      vm.users.push(newUser);
      vm.dataDirty = true;
      vm.refreshPaginator();
    }

    vm.onDeleteUser = function () {
      $('#deleteUserModal').modal();

    }

    vm.deleteUser = function () {
      $('#deleteUserModal').modal('hide');
      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (user.bSelect) {
          user.AliveUser = false;
        }
      }
      vm.bSelectCurrentPage = false;
      vm.dataDirty = true;
      vm.refreshPaginator();
    }

    vm.onUserChange = function (user, userInfo) {
      userInfo.bDirty = true;
      user.bDirty = true;
      vm.dataDirty = true;
    }

    vm.onRefresh = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.onSync = function () {
      var addItems = [];
      var editItems = [];
      var deleteItems = [];

      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (user.ID == '') {
          var newUser = {
            UserName: user.UserName,
            Password: user.Password,
            Tel: user.Tel.value,
            RealName: user.RealName.value,
            UserTypeID: user.UserTypeID.value,
            Address: user.Address.value,
            UpperID: user.UpperID.value,
            AliveUser: true
          };

          addItems.push(newUser);
        }
        else if (!user.AliveUser) {
          var deleteUser = new Object();
          deleteUser.ID = user.ID;
          deleteItems.push(deleteUser);
        }
        else if (user.bDirty) {
          var changedUser = new Object();
          if (user.UserTypeID.bDirty) {
            changedUser.UserTypeID = user.UserTypeID.value;
          }
          if (user.RealName.bDirty) {
            changedUser.RealName = user.RealName.value;
          }
          if (user.Tel.bDirty) {
            changedUser.Tel = user.Tel.value;
          }
          if (user.Address.bDirty) {
            changedUser.Address = user.Address.value;
          }
          if (user.UpperID.bDirty) {
            changedUser.UpperID = user.UpperID.value;
          }
          if (user.bResetPassword) {
            changedUser.bResetPassword = true;
            changedUser.Password = user.Password;
          }

          changedUser.ID = user.ID;
          editItems.push(changedUser);
        }
      }

      var userData = { Add: addItems, Edit: editItems, Delete: deleteItems };
      userService.syncUserData(userData).then(function (res) {
        vm.onRefresh();
        toastService.toast('success', vm.language.SUCCESS_MESAAGE_SYNC_USERS, vm.language.SUCCESS_TITTLE);
      }, function (error) {

      });
    }

    vm.onResetPassword = function (user) {
      var newPassword = passwordGenerator.createRandomPassword(8);
      user.Password = newPassword;
      user.bResetPassword = true;
      user.bDirty = true;
      vm.dataDirty = true;
    }

    vm.refreshPaginator = function () {

      vm.pages = [];
      if (vm.dataTotal <= vm.pageSize) {
        vm.pages.push(1);
      }
      else {
        vm.totalPage = Math.ceil(vm.dataTotal / vm.pageSize);
        for (var i = 1; i <= vm.totalPage; i++) {
          vm.pages.push(i);
        }
      }
      vm.dataBegin = (vm.currentPage - 1) * vm.pageSize + 1;
      vm.dataEnd = vm.users.length + (vm.currentPage - 1) * vm.pageSize;

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
      vm.users = [];
      userService.getAllUsers(vm.currentPage, vm.pageSize).then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var user = res.data.data[i];
          var newUser = {
            ID: user.ID,
            UserName: user.UserName,
            UserTypeID: { value: user.UserTypeID, bDirty: false },
            RealName: { value: user.RealName, bDirty: false },
            Tel: { value: user.Tel, bDirty: false },
            Password: user.Password,
            Address: { value: user.Address, bDirty: false },
            UpperID: { value: user.UpperID, bDirty: false },
            LastLoginTime: user.LastLoginTime,
            AliveUser: user.AliveUser,
            bSelect: false,
            bResetPassword: false,
            bDirty: false
          };

          vm.users.push(newUser);

          vm.dataTotal = res.data.total;
          vm.dataDirty = false;
          vm.bSelectCurrentPage = false;
          vm.refreshPaginator();
        }
      }, function (error) {

      });
    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.selectPage = function () {
      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (!user.bDelete) {
          user.bSelect = !user.bSelect;
        }
      }
    }

    vm.IsSecondaryAgency = function (user) {
      if (user.UserTypeID.value == USER_ROLES.secondaryAgency) {
        return true;
      }

      return false;
    }

    vm.onUserNameChange = function (valid) {
      if (!valid) {
        toastService.toast('error', vm.language.ERROR_MESSAGE_INVALID_USERNAME, vm.language.ERROR_TITTLE_USERINFO);
      }
    }

    vm.onTelChange = function (valid) {
      if (!valid) {
        toastService.toast('error', vm.language.ERROR_MESSAGE_INVALID_TEL, vm.language.ERROR_TITTLE_USERINFO);
      }
    }

    vm.init = function () {

      menuService.setMenuActive(0);
      vm.language = new LanguageUtility();

      vm.pageSizeOptions = PAGE_SIZE_OPTIONS;
      vm.pageSize = PAGE_SIZE_OPTIONS[0];
      vm.pages = [];
      vm.currentPage = 1;
      vm.totalPage = 1;

      vm.dataTotal = 0;
      vm.currentDataCount = 0;
      vm.dataBegin = 0;
      vm.dataEnd = 0;
      vm.currentPageSize = 0;

      vm.bSelectCurrentPage = false;
      vm.dataDirty = false;

      vm.columnHeaders = [vm.language.ITEM_ID,
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


      vm.primaryAgencies = [];
      angular.copy(userService.allPrimaryAgencies, vm.primaryAgencies);
      vm.users = [];
      vm.primaryAgencyFilter = '';
      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();