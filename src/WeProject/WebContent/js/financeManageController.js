(function () {
  'use strict';

  angular.module('app-web').controller('financeManageController', ['$scope', 'PAGE_SIZE_OPTIONS', '$timeout', '$q', '$log','userService', 'financeService', financeManageController]);

  function financeManageController($scope, PAGE_SIZE_OPTIONS, $timeout, $q, $log, userService,financeService) {
    var vm = this;

    vm.init = function () {
      vm.simulateQuery = false;
      vm.isDisabled = false;

      vm.agencies = loadAll();
      vm.querySearch = querySearch;
      vm.selectedItemChange = selectedItemChange;
      vm.searchTextChange = searchTextChange;
      vm.dateBegin = null;
      vm.dateEnd = null;

      vm.myDate = new Date();
      vm.isOpen = false;

      vm.carts = [{
        cardID: 1,
        carttime:"2017-12-06",
        orders: [
          { Title: '鞋垫',Amount:10, Price: 250, img: "" },
          { Title: '咸鱼',Amount:10, Price: 150, img: "" },
          { Title: '鸡蛋',Amount:10, Price: 500, img: "" }
        ],
        price: 900
      }, {
        cardID: 2,
        carttime:"2017-12-06",
        orders: [
          { Title: '鞋垫',Amount:10, Price: 250, img: "" },
          { Title: '咸鱼',Amount:10, Price: 150, img: "" },
          { Title: '鸡蛋',Amount:10, Price: 500, img: "" }
        ],
        price: 900
      }, {
        cardID: 3,
        carttime:"2017-12-06",
        orders: [
          { Title: '鞋垫',Amount:10, Price: 250, img: "" },
          { Title: '咸鱼',Amount:10, Price: 150, img: "" },
          { Title: '鸡蛋',Amount:10, Price: 500, img: "" }
        ],
        price: 900
      }, {
        cardID: 4,
        carttime:"2017-12-06",
        orders: [
          { Title: '鞋垫',Amount:10, Price: 250, img: "" },
          { Title: '咸鱼',Amount:10, Price: 150, img: "" },
          { Title: '鸡蛋',Amount:10, Price: 500, img: "" }
        ],
        price: 900
      }];

      vm.getAllAgency();
      
    }

    vm.onQueryBills = function () {
      vm.getAllBills();
    }

    vm.getAllBills = function () {
      financeService.getAllBills(1,vm.dateBegin.getTime(),vm.dateEnd.getTime()).then(function (res) {
        if (res.data.success) {
          angular.copy(res.data.data, vm.carts);
        }
      },function (error) {
        
      })
    }

    vm.getAllAgency = function () {
      
    }

    vm.passAudit = function (id) {
      financeService.passAudit(id).then(function (res) {
        
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

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }


    function loadAll() {
      var allAgencies = [
        { ID: 1, Name: '张三' },
        { ID: 2, Name: '李四' },
        { ID: 3, Name: '王五' },
        { ID: 4, Name: '赵六' },
        { ID: 5, Name: '田七' },
        { ID: 6, Name: '刘八' }
      ];

      var results = [];
      for (var i = 0; i < allAgencies.length; i++) {
        var element = allAgencies[i];
        results.push({ value: element.Name, display: element.Name });

      }

      return results;
    }

    function createFilterFor(query) {
      return function filterFn(state) {
        return (state.value.indexOf(query) === 0);
      };

    }

    vm.init();
  }
})();
