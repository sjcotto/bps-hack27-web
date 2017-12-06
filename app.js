'use strict';

angular.module('x', ['ui.ace'])
  .controller('ctrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

    $scope.view = {
      screen1: true,
      screen2: false,
      screen3: false
    };

    $timeout(function () {
      $scope.hideLoader = true;
    }, 2500);

    $scope.nextView = function (screenTo) {
      if (screenTo === 'screen2') {
        $scope.view.screen1 = false;
        $scope.view.screen2 = true;
      }
      else {
        $scope.view.screen2 = false;
        $scope.view.screen3 = true;
      }
    };

    console.log('ctrl');
    // The modes
    $scope.aceModel = "";

    // var url = 'http://kona-bots.ngrok.io';
    var url = 'http://apis-dev.konabackend.com:9090';

    var requestId = new Date().getTime() + "";
    var ownerId = "1";

    var requesterId = "1";
    var workerId = "1";
    var assetId;
    var workHours = 8;
    var startDate = "2017-11-04T23:32:31.129Z";
    var endDate = "2017-11-04T23:32:31.129Z";

    $scope.data = {
      // startDate : new Date(),
      // endDate : new Date(),
      // workHours : "10"
    };

    var dateFromObjectId = function (objectId) {
      return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    $scope.blockchain = [];

    $scope.submit = function () {

      if ($scope.data.startDate)
        startDate = $scope.data.startDate;
      if ($scope.data.endDate)
        startDate = $scope.data.endDate;
      if ($scope.data.workHours)
        workHours = $scope.data.workHours;

      var obj = {
        "$class": "bps.gub.uy.Request",
        "id": requestId,
        "owner": "bps.gub.uy.Person#" + ownerId
      };
      var blockObj = {
        obj: obj,
        status: 'PENDING',
        title: 'Creando Asset',
        date: new Date(),
        num: '01'
      };
      $scope.blockchain.push(blockObj);

      async.waterfall([
        function (cb) {
          // Asset
          // $scope.aceModel += "CREANDO ASSET...\n";
          $http.post(url + '/api/Request', obj, {
            headers: {'Content-Type': 'application/json'}
          })
            .then(function (response, status, headers, config) {
              var newObj = {
                obj: response.data, status: 'OK',
                ace: JSON.stringify(response.data, null, 4),
                title: 'Asset Creado',
                date: new Date(),
                num: '02'
              };
              $scope.blockchain.push(newObj);
              cb(null, response.data);
            })
        },
        function (response, cb) {
          assetId = response.id;
          // $scope.aceModel += "ENVIANDO SOLICITUD...\n";
          $http.post(url + '/api/BuildRequest', {
            "$class": "bps.gub.uy.BuildRequest",
            "requester": "bps.gub.uy.Person#" + requesterId,
            "worker": "bps.gub.uy.Person#" + workerId,
            "asset": "bps.gub.uy.Request#" + assetId,
            "workHours": workHours,
            "startDate": startDate,
            "endDate": endDate
          }, {
            headers: {'Content-Type': 'application/json'}
          })
            .then(function (response, status, headers, config) {
              var newObj = {
                obj: response.data, status: 'OK',
                ace: JSON.stringify(response.data, null, 4),
                title: 'Solicitud Enviada',
                date: new Date(),
                num: '03'
              };
              $scope.blockchain.push(newObj);
              $scope.data.home = true;
              cb(null, response.data);
            })
        },
        function (response, cb) {
          // BPS Approval
          $scope.aceModel += "SOLICITANDO APROBACION BPS...\n";
          $http.post(url + '/api/BPSApproval', {
            "$class": "bps.gub.uy.BPSApproval",
            "asset": "bps.gub.uy.Request#" + assetId
          }, {
            headers: {'Content-Type': 'application/json'}
          })
            .then(function (response, status, headers, config) {
              var newObj = {
                obj: response.data, status: 'OK',
                ace: JSON.stringify(response.data, null, 4),
                title: 'Aprobación BPS',
                date: new Date(),
                num: '04'
              };
              $scope.blockchain.push(newObj);
              $scope.data.bps = true;
              cb(null, response.data);
            })
        },
        function (response, cb) {
          // DGI Approval
          $scope.aceModel += "SOLICITANDO APROBACION DGI...\n";
          $http.post(url + '/api/DGIApproval', {
            "$class": "bps.gub.uy.DGIApproval",
            "asset": "bps.gub.uy.Request#" + assetId
          }, {
            headers: {'Content-Type': 'application/json'}
          })
            .then(function (response, status, headers, config) {
              var newObj = {
                obj: response.data, status: 'OK',
                ace: JSON.stringify(response.data, null, 4),
                title: 'Aprobación DGI',
                date: new Date(),
                num: '05'
              };
              $scope.blockchain.push(newObj);
              $scope.data.dgi = true;
              cb(null, response.data);
            })
        },
        function (response, cb) {
          // DGI Approval
          $scope.aceModel += "SOLICITANDO APROBACION DGI...\n";
          $http.post(url + '/api/DGIApproval', {
            "$class": "bps.gub.uy.DGIApproval",
            "asset": "bps.gub.uy.Request#" + assetId
          }, {
            headers: {'Content-Type': 'application/json'}
          })
            .then(function (response, status, headers, config) {
              var newObj = {
                obj: response.data, status: 'OK',
                ace: JSON.stringify(response.data, null, 4),
                title: 'Aprobación MTSS',
                date: new Date(),
                num: '06'
              };
              $scope.blockchain.push(newObj);
              $scope.data.mtss = true;
              cb(null, response.data);
              $scope.hideForm = true;
            })
        }],
        function (err, response) {
          if (err) {
            return console.log(err);
          }
          return console.log(response);
        }
      );

    }


  }]);


