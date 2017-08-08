(function () {
  'use strict';

  angular.module('app-web').controller('productDetailController', ['$rootScope', '$scope','productService', productDetailController]);

  function productDetailController($rootScope, $scope,productService) {
    var vm = this;
    

    vm.getProductDetail = function () {
      productService.getProductDetail().then(function (res) {
        
      },function (error) {
        
      });
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;
      
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