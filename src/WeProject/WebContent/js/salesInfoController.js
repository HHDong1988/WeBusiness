(function () {
  'use strict';

  angular.module('app-web').controller('salesInfoController', ['$scope','menuService', 'salesService', 'PAGE_SIZE_OPTIONS', salesInfoController])

  function salesInfoController($scope,menuService, salesService, PAGE_SIZE_OPTIONS) {
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
      vm.stocks = [];
      salesService.getAllSales(vm.currentPage, vm.pageSize).then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var stock = res.data.data[i];
          var newStock = {
            ID: stock.ID,
            Name: { value: stock.Name, bDirty: false },
            purchaseCount: { value: stock.TotalAmount, bDirty: false },
            currentCount: { value: stock.CurrentAmount, bDirty: false },
            imgUrl: '',
            bDirty: false,
          };

          vm.stocks.push(newStock);

          vm.dataTotal = res.data.total;
          vm.dataDirty = false;
          vm.bSelectCurrentPage = false;
          vm.refreshPaginator();
        }
      }, function (error) {

      });

    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.init = function () {
      menuService.setMenuActive(3);
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
      vm.language.SALES_COUNT,
      vm.language.SALES_PRICE,
      vm.language.SALES_DATE,
      vm.language.SALES_BUYER,
      vm.language.SALES_MAIL_ADDRESS,
      vm.language.SALES_SHIPMENT_VENDOR,
      vm.language.SALES_TRACKING_NUMBER,
      vm.language.SALES_BATCH_NUMBER];

      vm.stocks = [];


      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();