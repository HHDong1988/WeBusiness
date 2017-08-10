(function () {
  'use strict';

  angular.module('app-web').controller('productDetailController', ['$rootScope', '$scope','productService','cartService', productDetailController]);

  function productDetailController($rootScope, $scope,productService,cartService) {
    var vm = this;
    

    vm.getProductDetail = function () {
      productService.getProductDetail().then(function (res) {
        
      },function (error) {
        
      });
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
      cartService.addToCart(vm.productID, vm.productDetail.Picture1,vm.productDetail.Description, vm.productDetail.Title, vm.productDetail.Price, vm.count);
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
        Picture1:'/img/xianyadan.jpg',
        Picture2:'/img/xianyadan.jpg',
        Picture3:'/img/xianyadan.jpg',
        Picture4:'/img/xianyadan.jpg',
        Title:'咸鸭蛋', 
        Description:'正宗家养鸭',
        Price:100};
    };

    vm.init();
  }

})();