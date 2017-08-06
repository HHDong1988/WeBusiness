(function () {
  'use strict';

  angular.module('app-web').controller('productListController', ['$rootScope', '$scope', '$location', 'productService', productListController]);

  function productListController($rootScope, $scope, $location, productService) {
    var vm = this;

    vm.gotoDetail = function (product) {
      productService.selectProduct = product;
      $location.path('productDetail');
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.getAllProducts = function () {
        productService.getAllProducts(1, 5).then(function (res) {
          vm.productList = [];
          angular.copy(res.data.data, vm.productList);
        }, function (error) {

        })
      }

      vm.productList = [];

      vm.getAllProducts();
    };

    vm.init();
  }

})();