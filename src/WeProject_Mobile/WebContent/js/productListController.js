(function () {
  'use strict';

  angular.module('app-web').controller('productListController', ['$rootScope', '$scope', '$location','authService', 'productService','cartService', productListController]);

  function productListController($rootScope, $scope, $location,authService, productService,cartService) {
    var vm = this;

    vm.gotoDetail = function (ID) {
      var path = 'productDetail/' + ID;
      $location.path(path);
    }
    vm.getAllProducts = function () {
      productService.getAllProducts(1, 5).then(function (res) {
        vm.productList = [];
        angular.copy(res.data.data, vm.productList);
      }, function (error) {

      })
    }

    vm.onShoppingCartClick = function () {
      var path = null;
      if (authService.isAuthenticated()) {
        path = '/shoppingCart';
      }else{
        path = '/login';
      }
      $location.path(path);
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.cartItemCount = cartService.getItemCount();

      vm.productList = [
        {ID:1, ProductID: 1, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:2, ProductID: 2, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:3, ProductID: 3, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:4, ProductID: 4, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:5, ProductID: 5, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:6, ProductID: 6, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 }
      ];

      vm.getAllProducts();
    };

    vm.init();
  }

})();