(function () {
  'use strict';

  angular.module('app-web').controller('productListController', ['$rootScope', '$scope', productListController]);

  function productListController($rootScope, $scope) {
    var vm = this;

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;
    };

    vm.init();
  }

})();