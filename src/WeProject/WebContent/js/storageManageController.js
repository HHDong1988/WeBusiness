(function () {
  'use strict';

  angular.module('app-web').controller('storageManageController', ['$scope',storageManageController])

  function storageManageController($scope) {
    var vm = this;
    vm.language = new LanguageUtility();

    
  }

})();