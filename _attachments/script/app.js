    angular.module('CouchApp', ['CornerCouch', 'mediaPlayer']);

    function ctrlCuke($scope, $filter, cornercouch) {

      $scope.server = cornercouch();
      $scope.server.session();
      $scope.cukedb = $scope.server.getDB('cuke');
      $scope.newentry = $scope.cukedb.newDoc();
      $scope.cukedb.query("cuke", "recent-items", {
        include_docs: true,
        descending: true,
        limit: 8
      });

      function setError(data, status) {
        $scope.errordata = {
          "status": status,
          "data": data
        };
      }

      $scope.rowClick = function (idx) {
        $scope.detail = $scope.cukedb.getQueryDoc(idx);
        $scope.formDetail.$setPristine();
      };

      $scope.nextClick = function () {
        $scope.cukedb.queryNext();
        delete $scope.detail;
      };
      $scope.prevClick = function () {
        $scope.cukedb.queryPrev();
        delete $scope.detail;
      };
      $scope.moreClick = function () {
        $scope.cukedb.queryMore();
      };

      $scope.removeClick = function () {
        $scope.detail.remove()
          .success(function () {
            delete $scope.detail;
            $scope.cukedb.queryRefresh();
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
          $scope.newentry = $scope.cukedb.newDoc();
          $scope.cukedb.query("cuke", "recent-items", {
            include_docs: true,
            descending: true,
            limit: 8
          });
        });
      };
    }