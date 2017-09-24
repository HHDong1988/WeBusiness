(function () {
  'use strict';

  angular.module('app-web').controller('financeManageController', ['$scope', 'PAGE_SIZE_OPTIONS', '$timeout', '$q', '$log','userService', 'financeService', financeManageController]);

  function financeManageController($scope, PAGE_SIZE_OPTIONS, $timeout, $q, $log, userService,financeService) {
    var vm = this;

    vm.init = function () {
      vm.simulateQuery = false;
      vm.isDisabled = false;

      vm.currentCartID = 0;
      vm.deleteCartID = 0;
      vm.currentTotalPrice = 0;
      vm.confirmTotalPrice = 0;

      vm.dateBegin = null;
      vm.dateEnd = null;

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
        },function (error) {
          
        });
      }

    }

    vm.confirmDelete = function () {
      financeService.deleteCart(vm.deleteCartID).then(function (res) {
        $('#deleteModal').modal('hide');
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
