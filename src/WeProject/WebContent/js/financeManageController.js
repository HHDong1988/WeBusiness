(function () {
  'use strict';

  angular.module('app-web').controller('financeManageController', ['$scope', 'PAGE_SIZE_OPTIONS', financeManageController]);

  function financeManageController($scope, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.init = function () {
      vm.selectedItem = {};
      vm.tree = [
        {
          "id": "1",
          "pid": "0",
          "name": "家用电器",
          'icon': 'glyphicon glyphicon-phone',
          "children": [
            {
              "id": "4",
              "pid": "1",
              "name": "大家电",
              'icon': 'glyphicon glyphicon-cd',
              "children": [
                {
                  "id": "7",
                  "pid": "4",
                  "name": "空调",
                  'icon': 'glyphicon glyphicon-flash',
                  "children": [
                    {
                      "id": "15",
                      "pid": "7",
                      "name": "海尔空调",
                      'icon': 'glyphicon glyphicon-flash'
                    },
                    {
                      "id": "16",
                      "pid": "7",
                      "name": "美的空调",
                      'icon': 'glyphicon glyphicon-flash'
                    }
                  ]
                },
                {
                  "id": "8",
                  "pid": "4",
                  "name": "冰箱",
                  'icon': 'glyphicon glyphicon-flash'
                },
                {
                  "id": "9",
                  "pid": "4",
                  "name": "洗衣机",
                  'icon': 'glyphicon glyphicon-flash'
                },
                {
                  "id": "10",
                  "pid": "4",
                  "name": "热水器",
                  'icon': 'glyphicon glyphicon-flash'
                }
              ]
            },
            {
              "id": "5",
              "pid": "1",
              "name": "生活电器",
              'icon': 'glyphicon glyphicon-flash',
              "children": [
                {
                  "id": "19",
                  "pid": "5",
                  "name": "加湿器",
                  'icon': 'glyphicon glyphicon-flash'
                },
                {
                  "id": "20",
                  "pid": "5",
                  "name": "电熨斗",
                  'icon': 'glyphicon glyphicon-flash'
                }
              ]
            }
          ]
        },
      ];

    }

    vm.itemClicked = function ($item) {
      vm.selectedItem = $item;
    };

    vm.itemCheckedChanged = function ($item) {

    };

    vm.init();
  }
})();