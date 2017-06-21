(function () {
  'use strict';

  angular.module('app-web').controller('userManageController', ['$scope',,userManageController])

  function userManageController($scope) {
    var vm = this;
    vm.language = new LanguageUtility();
  }
})();