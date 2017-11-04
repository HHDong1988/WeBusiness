(function () {
  'use strict';

  angular.module('app-web').controller('productManageController', ['$scope','menuService', '$location', 'stockService', 'salesProductService', 'productService', 'toastService', 'PAGE_SIZE_OPTIONS', productManageController])

  function productManageController($scope,menuService, $location, stockService, salesProductService, productService, toastService, PAGE_SIZE_OPTIONS) {
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
      vm.dataEnd = vm.stocks.length + (vm.currentPage - 1) * vm.pageSize;

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
      //vm.stocks = [];
      stockService.getAllStocks(vm.currentPage, vm.pageSize).then(function (res) {
        if (res.data.success == true) {
          vm.stocks = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var stock = res.data.data[i];
            var newStock = {
              ID: stock.ID,
              Name: { value: stock.Name, bDirty: false },
              TotalAmount: stock.TotalAmount,
              CurrentAmount: stock.CurrentAmount,
              imgUrl: '',
              bDirty: false,
            };

            vm.stocks.push(newStock);

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

    vm.onSale = function (ID, Name) {
      salesProductService.setOnSaleProudct(ID, Name);
      $location.path('/onSale');
    }

    vm.init = function () {
      menuService.setMenuActive(4);
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
      vm.language.STOCK_PURCHASE_COUNT,
      vm.language.STOCK_STOCK_COUNT,
      vm.language.STOCK_ON_SALE];

      vm.stocks = [{
        ID: 1,
        Name: { value: "西班牙等离子鸭蛋", bDirty: false },
        TotalAmount: 3000,
        CurrentAmount: 2000,
        imgUrl: '',
        bDirty: false
      },
      {
        ID: 2,
        Name: { value: "日本北海道鞋垫", bDirty: false },
        TotalAmount: 3000,
        CurrentAmount: 2000,
        imgUrl: '',
        bDirty: false
      },
      {
        ID: 3,
        Name: { value: "南美肌肉拖鞋", bDirty: false },
        TotalAmount: 3000,
        CurrentAmount: 2000,
        imgUrl: '',
        bDirty: false
      },
      {
        ID: 4,
        Name: { value: "菲律宾跳楼槟榔", bDirty: false },
        TotalAmount: 3000,
        CurrentAmount: 2000,
        imgUrl: '',
        bDirty: false
      }];

      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();