(function () {
  'use strict';

  angular.module('app-web').controller('productDetailController', ['$rootScope', '$scope', '$location', 'authService', 'productService', 'cartService', productDetailController]);

  function productDetailController($rootScope, $scope, $location, authService, productService, cartService) {
    var vm = this;


    vm.getProductDetail = function () {
      productService.getProductDetail().then(function (res) {
        vm.productDetail = {
          ProductID: res.data.data[0].ProductID,
          Picture1: res.data.data[0].Picture1,
          Picture2: res.data.data[0].Picture2,
          Picture3: res.data.data[0].Picture3,
          Picture4: res.data.data[0].Picture4,
          Title: res.data.data[0].Title,
          Description: res.data.data[0].Description,
          Price: res.data.data[0].Price
        };
      }, function (error) {

      });
    }

    vm.onShoppingCartClick = function () {
      var path = null;
      if (authService.isAuthenticated()) {
        path = '/shoppingCart';
      } else {
        path = '/login';
      }
      // path = '/shoppingCart';
      $location.path(path);
    }

    vm.decreaseCount = function () {
      if (vm.count <= 1) {
        return;
      }
      vm.count--;
    }

    vm.increaseCount = function () {
      vm.count++;
    }

    vm.addToCart = function () {
      cartService.addToCart(vm.productID, vm.productDetail.Picture1, vm.productDetail.Description, vm.productDetail.Title, vm.productDetail.Price, vm.count);
      vm.cartItemCount = cartService.getItemCount();

    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.cartItemCount = cartService.getItemCount();
      vm.count = 1;
      vm.productID = productService.productID;
      vm.productDetail = {
        ProductID: 1,
        Picture1: '/img/xianyadan.jpg',
        Picture2: '/img/xianyadan.jpg',
        Picture3: '/img/xianyadan.jpg',
        Picture4: '/img/xianyadan.jpg',
        Title: '咸鸭蛋',
        Description: '正宗家养鸭',
        Price: 100
      };
      vm.productDetail = null;
      vm.getProductDetail();
    };

    vm.init();
  }

})();