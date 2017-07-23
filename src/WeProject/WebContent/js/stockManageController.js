(function () {
  'use strict';

  angular.module('app-web').controller('stockManageController', ['$scope', 'PAGE_SIZE_OPTIONS', stockManageController])

  function stockManageController($scope, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAdd = function () {
      var newStock = {
        ID:'',
        Name: { value: '', bDirty: false },
        purchaseCount: { value: 0,bDirty: false },
        currentCount: { value: 0, bDirty: false },
        imgUrl:'',
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
      vm.language.STOCK_THUMBNAIL,
      vm.language.STOCK_PURCHASE_COUNT,
      vm.language.STOCK_STOCK_COUNT,
      vm.language.STOCK_PURCHASE_INFORMATION,
      vm.language.STOCK_SALES_INFORMATION,
      vm.language.STOCK_SALES_STATICS];

      vm.stocks = [{
        ID:1,
        Name: { value: "西班牙等离子鸭蛋", bDirty: false },
        purchaseCount: { value: 3000, bDirty: false },
        currentCount: { value: 2000, bDirty: false },
        imgUrl:'',
        bDirty: false
      },
      {
        ID:2,
        Name: { value: "日本北海道鞋垫", bDirty: false },
        purchaseCount: { value: 2000, bDirty: false },
        currentCount: { value: 1500, bDirty: false },
        imgUrl:'',
        bDirty: false
      },
      {
        ID:3,
        Name: { value: "南美肌肉拖鞋", bDirty: false },
        purchaseCount: { value: 3000, bDirty: false },
        currentCount: { value: 2000, bDirty: false },
        imgUrl:'',
        bDirty: false
      },
      {
        ID:4,
        Name: { value: "菲律宾跳楼槟榔", bDirty: false },
        purchaseCount: { value: 3000, bDirty: false },
        currentCount: { value: 2000, bDirty: false },
        imgUrl:'',
        bDirty: false
      }];

      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();