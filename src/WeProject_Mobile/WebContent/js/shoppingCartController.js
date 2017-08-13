(function () {
  'use strict';

  angular.module('app-web').controller('shoppingCartController', ['$rootScope', '$scope', '$location', 'cartService', shoppingCartController]);

  function shoppingCartController($rootScope, $scope, $location, cartService) {
    var vm = this;

    vm.getTotal = function () {
      var amount = 0;
      for (var i = 0; i < vm.products.length; i++) {
        var product = vm.products[i];
        amount += product.productCount * product.productPrice;
      }
      return amount;
    }

    vm.decreaseCount = function (product) {
      if (product.productCount <= 1) {
        return;
      }
      
      product.productCount--;
      vm.amount = vm.getTotal();
    }

    vm.increaseCount = function (product) {
      product.productCount++;
      vm.amount = vm.getTotal();
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.products = cartService.getAllItems();
      vm.amount = vm.getTotal();
    };

    vm.init();
  }

})();