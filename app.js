'use strict';

angular.module('x', ['ui.ace'])
  .controller('ctrl', ['$scope', '$http', function ($scope, $http) {

    $scope.view = {
      screen1: true,
      screen2: false,
      screen3: false
    };

    $scope.nextView = function(screenTo) {
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
    var url = 'http://localhost:3000';

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

    $scope.submit = function() {

      if ($scope.data.startDate)
        startDate = $scope.data.startDate;
      if ($scope.data.endDate)
        startDate = $scope.data.endDate;
      if ($scope.data.workHours)
        workHours = $scope.data.workHours;

      async.waterfall([
        function(cb) {
          // Asset

          $scope.aceModel += "CREANDO ASSET...\n";
          $http.post(url+'/api/bps.gub.uy.Request', {
              "$class": "bps.gub.uy.Request",
              "id": requestId,
              "owner": ownerId
            }, {
              headers: {'Content-Type': 'application/json'}
            })
            .then(function (response, status, headers, config) {
              $scope.aceModel += "RESULTADO OK\n";
              $scope.aceModel += JSON.stringify(response.data, null, 4) + "\n\n";
              cb(null, response.data);
            })
        },
        function(response, cb) {
          assetId = response.id;
          $scope.aceModel += "ENVIANDO SOLICITUD...\n";
          $http.post(url+'/api/bps.gub.uy.BuildRequest', {
              "$class": "bps.gub.uy.BuildRequest",
              "requester": requesterId,
              "worker": workerId,
              "asset": assetId,
              "workHours": workHours,
              "startDate": startDate,
              "endDate": endDate
            }, {
              headers: {'Content-Type': 'application/json'}
            })
            .then(function (response, status, headers, config) {
              $scope.aceModel += "RESULTADO OK\n";
              $scope.aceModel += JSON.stringify(response.data, null, 4) + "\n\n";
              cb(null, response.data);
            })
        },
        function(response, cb) {
          // BPS Approval
          $scope.aceModel += "SOLICITANDO APROBACION BPS...\n";
          $http.post(url+'/api/bps.gub.uy.BPSApproval', {
              "$class": "bps.gub.uy.BPSApproval",
              "asset": assetId
            }, {
              headers: {'Content-Type': 'application/json'}
            })
            .then(function (response, status, headers, config) {
              $scope.aceModel += "RESULTADO OK\n";
              $scope.aceModel += JSON.stringify(response.data, null, 4) + "\n\n";
              $scope.data.bps = true;
              cb(null, response.data);
            })
        },
        function(response, cb) {
          // DGI Approval
          $scope.aceModel += "SOLICITANDO APROBACION DGI...\n";
          $http.post(url+'/api/bps.gub.uy.DGIApproval', {
              "$class": "bps.gub.uy.DGIApproval",
              "asset": assetId
            }, {
              headers: {'Content-Type': 'application/json'}
            })
            .then(function (response, status, headers, config) {
              $scope.aceModel += "RESULTADO OK\n" + JSON.stringify(response.data, null, 4) + "\n\n";
              $scope.data.dgi = true;
              cb(null, response.data);
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


