    angular.module('CouchApp', ['CornerCouch']);

    function ctrlImReq($scope, $filter, cornercouch) {

      $scope.server = cornercouch();
      $scope.server.session();
      $scope.imreqdb = $scope.server.getDB('imreq');
      $scope.newentry = $scope.imreqdb.newDoc();
      $scope.imreqdb.query("imreq-couch", "recent-items", {
        include_docs: true,
        descending: true,
        limit: 8
      });

      $scope.submitLogin = function () {
        $scope.server.login($scope.loginUser, $scope.loginPass)
          .success(function () {
            $scope.loginPass = $scope.loginUser = '';
            $scope.showInfo = true;
            $scope.server.getInfo();
            $scope.server.getDatabases();
            $scope.server.getUUIDs(3);
            $scope.server.getUserDoc();
            $scope.imreqdb.getInfo();
          });
      };

      function setError(data, status) {
        $scope.errordata = {
          "status": status,
          "data": data
        };
      }

      $scope.rowClick = function (idx) {
        $scope.detail = $scope.imreqdb.getQueryDoc(idx);
        $scope.formDetail.$setPristine();
      };

      $scope.nextClick = function () {
        $scope.imreqdb.queryNext();
        delete $scope.detail;
      };
      $scope.prevClick = function () {
        $scope.imreqdb.queryPrev();
        delete $scope.detail;
      };
      $scope.moreClick = function () {
        $scope.imreqdb.queryMore();
      };

      $scope.removeClick = function () {
        $scope.detail.remove()
          .success(function () {
            delete $scope.detail;
            $scope.imreqdb.queryRefresh();
          });
      };

      $scope.updateClick = function () {
        $scope.detail.save()
          .error(setError)
          .success(function () {
            $scope.formDetail.$setPristine();
          });
      };

      $scope.attachClick = function () {
        var fileInput = document.getElementById("upload");
        $scope.detail.attachMulti(fileInput.files, function () {
          fileInput.value = "";
        });
      };

      $scope.detachClick = function (name) {
        $scope.detail.detach(name);
      };

      $scope.submitEntry = function () {

        var now = new Date();
        var now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
          now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

        $scope.newentry.utc = $filter('date')(now, 'yyyy-MM-dd HH:mm:ss');

        $scope.newentry.save().success(function () {
          delete $scope.errordata;
          $scope.detail = $scope.newentry;
          $scope.newentry = $scope.imreqdb.newDoc();
          $scope.imreqdb.query("imreq-couch", "recent-items", {
            include_docs: true,
            descending: true,
            limit: 8
          });
        });
      };
    }