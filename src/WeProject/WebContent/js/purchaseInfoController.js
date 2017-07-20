(function () {
  'use strict';

  angular.module('app-web').controller('purchaseInfoController', ['$scope', 'PAGE_SIZE_OPTIONS', purchaseInfoController])

  function purchaseInfoController($scope, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAdd = function () {
      var newStock = {
        ID: '',
        Name: { value: '', bDirty: false },
        purchaseCount: { value: 0, bDirty: false },
        restCount: { value: 0, bDirty: false },
        price: { value: 0, bDirty: false },
        vendor: { value: '', bDirty: false },
        productionDate: { value: '', bDirty: false },
        shelfLife: { value: '', bDirty: false },
        batchNumber: { value: '', bDirty: false },
        packing: { value: '', bDirty: false },
        specification: { value: '', bDirty: false },
        buyer: { value: '', bDirty: false },
        bDirty: false,
      };

      vm.stocks.push(newStock);
      vm.dataDirty = true;
      vm.refreshPaginator();
    }


    vm.onRefresh = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.onSync = function () {

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
    }

    vm.refreshPage = function () {
      vm.gotoPage(vm.currentPage);
    }

    vm.onViewPurchaseInfo = function (stock) {

    }

    vm.onViewSalesInfo = function (stock) {

    }

    vm.onViewSalesStatics = function () {

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
      vm.language.STOCK_PURCHASE_COUNT,
      vm.language.PURCHASE_REST_COUNT,
      vm.language.PURCHASE_PRICE,
      vm.language.PURCHASE_VENDOR,
      vm.language.PURCHASE_PRODUCTION_DATE,
      vm.language.PURCHASE_SHELF_LIFE,
      vm.language.PURCHASE_BATCH_NUMBER,
      vm.language.PURCHASE_PACKING,
      vm.language.PURCHASE_SPECIFICATION,
      vm.language.PURCHASE_BUYER];

      vm.stocks = [];


      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();