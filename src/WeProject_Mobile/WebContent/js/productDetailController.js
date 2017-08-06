(function () {
  'use strict';

  angular.module('app-web').controller('productDetailController', ['$rootScope', '$scope','productService', productDetailController]);

  function productDetailController($rootScope, $scope,productService) {
    var vm = this;
    
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;
      
      vm.product = productService.selectProduct;
    };

    vm.init();
  }

})();