(function () {
  'use strict';

  angular.module('app-web').controller('onSaleController', ['$scope', 'stockService', 'salesProductService','fileReader', 'toastService', 'PAGE_SIZE_OPTIONS', onSaleController])

  function onSaleController($scope, stockService, salesProductService,fileReader, toastService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onSave = function () {

    }

    vm.getFile = function (index) {
      fileReader.readAsDataUrl(vm.file, $scope)
        .then(function (result) {
          switch (index) {
          case 0:
            vm.product.ImgSrc1 = result;
            break;
          case 1:
            vm.product.ImgSrc2 = result;
            break;
          case 2:
            vm.product.ImgSrc3 = result;
            break;
          case 3:
            vm.product.ImgSrc4 = result;
            break;
          default:
            break;
        }
        });
    };

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.reader = new FileReader();
      vm.file = {};
      var onSaleProduct = salesProductService.getOnSaleProudct();
      vm.product = { ID: onSaleProduct.ID, Name: onSaleProduct.Name, Price:0, ImgSrc1:"", ImgSrc2: "", ImgSrc3: "", ImgSrc4: "", Description: "" };
    };

    vm.init();
  }
})();