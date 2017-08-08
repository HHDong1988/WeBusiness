(function () {
  'use strict';

  angular.module('app-web').controller('productListController', ['$rootScope', '$scope', '$location', 'productService', productListController]);

  function productListController($rootScope, $scope, $location, productService) {
    var vm = this;

    vm.gotoDetail = function (productID) {
      var path = 'productDetail/' + productID;
      $location.path(path);
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.getAllProducts = function () {
        productService.getAllProducts(1, 5).then(function (res) {
         // vm.productList = [];
          //angular.copy(res.data.data, vm.productList);
        }, function (error) {

        })
      }

      vm.productList = [
        {ProductID: 1, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100},
        {ProductID: 2, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100},
        {ProductID: 3, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100},
        {ProductID: 4, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100},
        {ProductID: 5, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100},
        {ProductID: 6, Picture1:'/img/xianyadan.jpg',Title:'咸鸭蛋', Description:'正宗家养鸭',Price:100}
      ];

      vm.getAllProducts();
    };

    vm.init();
  }

})();