(function () {
  'use strict';

  angular.module('app-web').controller('productListController', ['$scope', '$location', 'stockService', 'salesProductService','productService', 'toastService', 'PAGE_SIZE_OPTIONS', productListController])

  function productListController($scope, $location, stockService, salesProductService,productService, toastService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onRefresh = function () {
      vm.gotoPage(vm.currentPage);
    }
    vm.refreshPaginator = function () {

      vm.pages = [];
      if (vm.dataTotal <= vm.pageSize) {
        vm.pages.push(1);
      }
      else {
        vm.totalPage = Math.ceil(vm.dataTotal / vm.pageSize);
        for (var i = 1; i <= vm.totalPage; i++) {
          vm.pages.push(i);
        }
      }
      vm.dataBegin = (vm.currentPage - 1) * vm.pageSize + 1;
      vm.dataEnd = vm.productList.length + (vm.currentPage - 1) * vm.pageSize;

    }

    vm.prevPage = function () {
      if (vm.currentPage <= 1) {
        return;
      }

      vm.currentPage--;
      vm.gotoPage(vm.currentPage);
    }

    vm.nextPage = function () {
      if (vm.currentPage >= vm.totalPage) {
        return;
      }

      vm.currentPage++;
      vm.gotoPage(vm.currentPage);
    }

    vm.gotoPage = function (page) {
      if (page < 1) {
        return;
      }

      vm.currentPage = page;

      salesProductService.getAllProducts(vm.currentPage, vm.pageSize).then(function (res) {
        if (res.data.success == true) {
          vm.productList = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var product = res.data.data[i];
            var newProduct = {
              ID: product.ID,
              ProductID: product.ProductID,
              Picture1: product.Picture1,
              Title: product.Title,
              Description: product.Description,
              Price: product.Price,
              bDirty: false,
            };

            vm.productList.push(newProduct);

            vm.dataTotal = res.data.total;
            vm.dataDirty = false;
            vm.bSelectCurrentPage = false;
            vm.refreshPaginator();
          }
        }

      }, function (error) {

      });
    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.onStockChange = function (stock, stockInfo) {
      stockInfo.bDirty = true;
      stock.bDirty = true;
      vm.dataDirty = true;
    }

    vm.offSale = function (id) {
      
    }

    vm.init = function () {

      vm.language = new LanguageUtility();

      vm.pageSizeOptions = PAGE_SIZE_OPTIONS;
      vm.pageSize = PAGE_SIZE_OPTIONS[0];
      vm.pages = [];
      vm.currentPage = 1;
      vm.totalPage = 1;

      vm.dataTotal = 0;
      vm.currentDataCount = 0;
      vm.dataBegin = 0;
      vm.dataEnd = 0;
      vm.currentPageSize = 0;

      vm.bSelectCurrentPage = false;
      vm.dataDirty = false;

      vm.columnHeaders = [vm.language.ITEM_ID,
      vm.language.STOCK_NAME,
      vm.language.PRODUCT_PRICE,
      vm.language.PRODUCT_DESCRIPTION,
      vm.language.OFF_SALE];

      vm.productList = [
        {ID:1, ProductID: 1, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:2, ProductID: 2, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:3, ProductID: 3, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:4, ProductID: 4, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:5, ProductID: 5, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 },
        {ID:6, ProductID: 6, Picture1: '/img/xianyadan.jpg', Title: '咸鸭蛋', Description: '正宗家养鸭', Price: 100 }
      ];


      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();