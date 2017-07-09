(function () {
  'use strict';

  angular.module('app-web').controller('storageManageController', ['$scope', storageManageController])

  function storageManageController($scope, userService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.init = function () {
      $('#demoSelect').editableSelect({ effects: 'default' });
    }
    vm.load = function () {
      $('#demoSelect').editableSelect({ effects: 'default' });
    }

    vm.init();
  }
})();