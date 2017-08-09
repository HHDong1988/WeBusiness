(function () {
  'use strict';

  angular.module('app-web').controller('shoppingCartController', ['$rootScope', '$scope','$location','cartService', shoppingCartController]);

  function shoppingCartController($rootScope, $scope,$location,cartService) {
    var vm = this;

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.products = cartService.products;
    };

    vm.init();
  }

})();