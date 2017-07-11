(function () {
  'use strict';

  angular.module('app-web').controller('stockManageController', ['$scope','PAGE_SIZE_OPTIONS', stockManageController])

  function stockManageController($scope, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAdd = function () {
      vm.dataDirty = true;
      vm.refreshPaginator();
    }

    vm.onDelete = function () {
      $('#deleteModal').modal();
    }

    vm.delete = function () {
      $('#deleteModal').modal('hide');

      vm.bSelectCurrentPage = false;
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
      vm.dataEnd = vm.users.length + (vm.currentPage - 1) * vm.pageSize;

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

    vm.selectPage = function () {
      for (var i = 0; i < vm.users.length; i++) {
        var user = vm.users[i];
        if (!user.bDelete) {
          user.bSelect = !user.bSelect;
        }
      }
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

      vm.columnHeaders = [vm.language.STOCK_NAME,
      vm.language.STOCK_THUMBNAIL,
      vm.language.STOCK_PURCHASE_COUNT,
      vm.language.STOCK_STOCK_COUNT,
      vm.language.STOCK_INFORMATION,
      vm.language.STOCK_SALES_INFORMATION,
      vm.language.STOCK_SALES_STATICS];

      vm.stocks = [];
    
      vm.gotoPage(vm.currentPage);
    };

    vm.init();
  }
})();