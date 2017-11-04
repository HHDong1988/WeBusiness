(function () {
  'use strict';

  angular.module('app-web').controller('financeManageController', ['$scope','menuService', 'PAGE_SIZE_OPTIONS', '$timeout', '$q', '$log','toastService','userService', 'financeService', financeManageController]);

  function financeManageController($scope,menuService, PAGE_SIZE_OPTIONS, $timeout, $q, $log,toastService, userService,financeService) {
    var vm = this;

    vm.init = function () {
      menuService.setMenuActive(1);
      vm.simulateQuery = false;
      vm.isDisabled = false;

      vm.currentCartID = 0;
      vm.deleteCartID = 0;
      vm.currentTotalPrice = 0;
      vm.confirmTotalPrice = 0;

      vm.dateBegin = new Date();
      vm.dateEnd = new Date();

      vm.myDate = new Date();
      vm.isOpen = false;

      vm.carts = [];    
    }

    vm.onQueryBills = function () {
      vm.getAllBills();
    }

    vm.getAllBills = function () {
      vm.carts = [];
      financeService.getAllBills(vm.dateBegin.getTime(),vm.dateEnd.getTime()).then(function (res) {
        if (res.data.success) {
          angular.copy(res.data.data, vm.carts);
        }
      },function (error) {
        
      })
    }

    vm.passAudit = function (id, price) {
      vm.currentCartID = id;
      vm.currentTotalPrice = price;
      $('#confirmModal').modal();

    }

    vm.deleteCart = function (id) {
      vm.deleteCartID  = id;
      $('#deleteModal').modal();

    }

    vm.confirmPass = function () {
      if (vm.currentTotalPrice == vm.confirmTotalPrice) {
        financeService.passAudit(vm.currentCartID).then(function (res) {
          $('#confirmModal').modal('hide');
          vm.getAllBills();
        },function (error) {
        });
      }
      else{
        toastService.toast('error', '财务审计', '请输入正确的购物车金额');
      }

    }

    vm.confirmDelete = function () {
      financeService.deleteCart(vm.deleteCartID).then(function (res) {
        $('#deleteModal').modal('hide');
        vm.getAllBills();
      },function (error) {
        
      });
    }

    function querySearch(query) {
      var results = query ? vm.agencies.filter(createFilterFor(query)) : vm.agencies,
        deferred;
      if (vm.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    vm.init();
  }
})();
