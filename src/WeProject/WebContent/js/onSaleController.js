(function () {
  'use strict';

  angular.module('app-web').controller('onSaleController', ['$scope', 'stockService', 'salesProductService', 'toastService', 'PAGE_SIZE_OPTIONS', onSaleController])

  function onSaleController($scope, stockService, salesProductService, toastService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onSave = function () {

    }

    vm.onImgUpload1 = function () {
    }

    vm.onImgUpload2 = function (files) {
      vm.img_upload(files, 1);
    }

    vm.onImgUpload3 = function (files) {
      vm.img_upload(files, 2);
    }

    vm.onImgUpload4 = function (files) {
      vm.img_upload(files, 3);
    }

    vm.img_upload = function (files, index) {
      vm.reader.readAsDataURL(files[0]);
      vm.reader.onload = function (ev) {
        switch (index) {
          case 0:
            vm.product.Pic1 = ev.target.result;
            break;
          case 1:
            vm.product.Pic2 = ev.target.result;
            break;
          case 2:
            vm.product.Pic3 = ev.target.result;
            break;
          case 3:
            vm.product.Pic4 = ev.target.result;
            break;
          default:
            break;
        }
      };
    };

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.reader = new FileReader();
      var onSaleProduct = salesProductService.getOnSaleProudct();
      vm.product = { ID: onSaleProduct.ID, Name: onSaleProduct.Name, Pic1: "", Pic2: "", Pic3: "", Pic4: "", Description: "" };
    };

    vm.init();
  }
})();