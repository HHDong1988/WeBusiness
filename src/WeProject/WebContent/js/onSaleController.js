(function () {
  'use strict';

  angular.module('app-web').controller('onSaleController', ['$scope', 'stockService', 'salesProductService','fileReader', 'toastService', 'PAGE_SIZE_OPTIONS', onSaleController])

  function onSaleController($scope, stockService, salesProductService,fileReader, toastService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onSave = function () {
      salesProductService.onSale(vm.product).then(function (res) {
        toastService.toast('success', '上架成功', '上架');
      },function (error) {
        toastService.toast('error', '上架失败', '上架');
      });
    }

    vm.getFile = function (index) {
      fileReader.readAsDataUrl(vm.file, $scope)
        .then(function (result) {
          switch (index) {
          case 0:
            vm.product.Picture1 = result;
            break;
          case 1:
            vm.product.Picture2 = result;
            break;
          case 2:
            vm.product.Picture3 = result;
            break;
          case 3:
            vm.product.Picture4 = result;
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
      vm.product = {ID:0, ProductID: onSaleProduct.ID, Title: onSaleProduct.Name, Price:0, Picture1:"", Picture2: "", Picture3: "", Picture4: "", Description: "" };
    };

    vm.init();
  }
})();