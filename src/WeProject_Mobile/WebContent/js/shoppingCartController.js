(function () {
  'use strict';

  angular.module('app-web').controller('shoppingCartController', ['$rootScope', '$scope','$location','productService', shoppingCartController]);

  function shoppingCartController($rootScope, $scope,$location,productService) {
    var vm = this;

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;
    };

    vm.init();
  }

})();