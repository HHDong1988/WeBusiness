(function () {
  'use strict';

  angular.module('app-web').controller('productDetailController', ['$rootScope', '$scope','productService', productDetailController]);

  function productDetailController($rootScope, $scope,productService) {
    var vm = this;
    
    vm.getProductDetail = function () {
      productService.getProductDetail(productService.selectProductID).then(function (res) {
        
      },function (error) {
        
      });
    }
    
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.getProductDetail();

      vm.product = {ProductID:0,imgSrc1:'/img/hailizi.jpg',imgSrc2:'/img/hailizi.jpg',imgSrc3:'/img/hailizi.jpg',imgSrc4:'/img/hailizi.jpg'}
    };

    vm.init();
  }

})();