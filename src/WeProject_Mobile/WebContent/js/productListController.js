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

      vm.productList =
        [{ ProductID: 1, imgSrc: '/img/hailizi.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' },
        { ProductID: 2, imgSrc: '/img/xianyadan.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' },
        { ProductID: 3, imgSrc: '/img/xianyadan.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' },
        { ProductID: 4, imgSrc: '/img/xiedian.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' },
        { ProductID: 5, imgSrc: '/img/xiedian.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' },
        { ProductID: 6, imgSrc: '/img/tuoxie.jpg', introduction: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳', detail: '大连鲜活海蛎子，产自小平岛海域，个大肥美，滋阴壮阳' }];

      vm.getAllProducts();
    };

    vm.init();
  }

})();