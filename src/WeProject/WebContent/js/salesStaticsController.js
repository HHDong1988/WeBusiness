(function () {
  'use strict';

  angular.module('app-web').controller('salesStaticsController', ['$scope','stockService','salesStatisticsService', 'PAGE_SIZE_OPTIONS', salesStaticsController])

  function salesStaticsController($scope,stockService,salesStatisticsService, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onQuery = function () {
      if (vm.productName == '') {
        vm.showAllStatics = true;
      } else {
        vm.showAllStatics = false;
      }
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
      }, function (error) {

      })
    }

    vm.getSalesStatistics = function () {
      salesStatisticsService.getSalesStatistics(vm.startTime.getTime(), vm.endTime.getTime(), vm.ProductID ).then(function (res) {
        if (vm.ProductID) {
          
        }
      },function (error) {
        
      })
    }

    vm.init = function () {
      vm.language = new LanguageUtility();

      vm.startTime = '';
      vm.endTime = '';
      vm.productList = [];
      vm.ProductID = '';

      vm.showAllStatics = false;

      vm.salesVolumeTitle = '销量统计';
      vm.salesVolumeData = [{
        'value': 100,
        'name': '西班牙等离子鸭蛋'
      }, {
        'value': 200,
        'name': '日本北海道臭鞋垫'
      }, {
        'value': 300,
        'name': '南美肌肉拖鞋'
      }, {
        'value': 200,
        'name': '菲律宾跳楼槟榔'
      }, {
        'value': 1000,
        'name': '大连鲜活海蛎子'
      }];

      vm.salesFiguresTitle = '销售金额统计';
      vm.salesFiguresData = [{
        'value': 5000,
        'name': '西班牙等离子鸭蛋'
      }, {
        'value': 2000,
        'name': '日本北海道臭鞋垫'
      }, {
        'value': 1000,
        'name': '南美肌肉拖鞋'
      }, {
        'value': 3000,
        'name': '菲律宾跳楼槟榔'
      }, {
        'value': 8000,
        'name': '大连鲜活海蛎子'
      }];

      vm.salesTitle = '销量与库存比较';
      vm.salesData = {
        'xData': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'yData': [
          {
            'name': '销量',
            'data': [200, 300, 100, 200, 400, 500, 120, 455, 65, 123]
          },
          {
            'name': '库存',
            'data': [800, 900, 10, 58, 234, 1344, 52344, 112, 33, 11]
          }
        ]
      };

      vm.xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      vm.getAllInitialData();

    };
    vm.init();
  }
})();