(function () {
  'use strict';

  angular.module('app-web').controller('purchaseInfoController', ['$scope', 'userService', 'stockService', 'purchaseService', 'toastService', 'PAGE_SIZE_OPTIONS', purchaseInfoController])

  function purchaseInfoController($scope, userService, stockService, purchaseService, toastService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onAdd = function () {
      var newStock = {
        ID: '',
        ProductID: '',
        Amount: 0,
        Remaining: 0,
        PurchasePrice: 0,
        VendorName: '',
        ProducedTime: new Date(),
        ExpirationTime: 0,
        BatchNum: 0,
        PackageType: '',
        Standard: '',
        PurchaserID: '',
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
      var addItems = [];
      for (var i = 0; i < vm.stocks.length; i++) {
        var stock = vm.stocks[i];
        if (stock.ID == '') {
          var newStock = {
            ID: parseInt(stock.ID),
            ProductID: parseInt(stock.ProductID),
            Amount: stock.Amount,
            Remaining: stock.Remaining,
            PurchasePrice: stock.PurchasePrice,
            VendorName: stock.VendorName,
            ProducedTime: stock.ProducedTime.getTime(),
            ExpirationDate: stock.ExpirationDate,
            BatchNum: stock.BatchNum,
            PackageType: stock.PackageType,
            Standard: stock.Standard,
            PurchaserID: parseInt(stock.PurchaserID),
          };

          addItems.push(newStock);
        }
      }

      var purchaseData = { Add: addItems };
      purchaseService.syncPurchaseData(purchaseData).then(function (res) {
        vm.onRefresh();
        toastService.toast('success', vm.language.SUCCESS_MESAAGE_SYNC_PURCHASE, vm.language.SUCCESS_TITTLE);
      }, function (error) {
        toastService.toast('error', vm.language.ERROR_MESSAGE_SYNC_PURCHASE, vm.language.FAILED_TITTLE);
      });
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
      purchaseService.getAllPurchases(vm.currentPage, vm.pageSize).then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var stock = res.data.data[i];
          var producedTime = new Date();
          producedTime.setTime(stock.ProducedTime);
          var newStock = {
            ID: stock.ID,
            ProductID: stock.ProductID.toString(),
            Amount: stock.Amount,
            Remaining: stock.Remaining,
            PurchasePrice: stock.PurchasePrice,
            VendorName: stock.VendorName,
            ProducedTime: producedTime,
            ExpirationDate: stock.ExpirationDate,
            BatchNum: stock.BatchNum,
            PackageType: stock.PackageType,
            Standard: stock.Standard,
            PurchaserID: stock.PurchaserID.toString(),
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

    vm.getAllInitialData = function () {
      vm.productList = [];
      stockService.getAllStocks(1, -1).then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var stock = res.data.data[i];
          var newStock = {
            ID: stock.ID.toString(),
            Name: stock.Name
          };
          vm.productList.push(newStock);
        }
        vm.getAllStoreKeeper();
      }, function (error) {

      })
    }

    vm.getAllStoreKeeper = function () {
      vm.storeKeeperList = [];
      userService.getAllStoreKeeper().then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          var user = res.data.data[i];
          vm.storeKeeperList.push({ ID: user.ID.toString(), UserName: user.UserName });
        }
        vm.gotoPage(vm.currentPage);
      }, function (error) {

      })
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
      vm.language.PURCHASE_PRICE,
      vm.language.PURCHASE_VENDOR,
      vm.language.PURCHASE_PRODUCTION_DATE,
      vm.language.PURCHASE_SHELF_LIFE,
      vm.language.PURCHASE_BATCH_NUMBER,
      vm.language.PURCHASE_PACKING,
      vm.language.PURCHASE_SPECIFICATION,
      vm.language.PURCHASE_BUYER];

      vm.stocks = [];
      vm.productList = [];
      vm.storeKeeperList = [];

      vm.getAllInitialData();
    };

    vm.init();
  }
})();