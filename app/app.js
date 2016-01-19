(function(){

  angular
  .module('app', [])
  .controller('GitRepoController', GitRepoController);

  GitRepoController.inject = ['$http']

  function GitRepoController($http){
    var gitRepo = this;

    //Initialize gitRepo enitity data with default value;
    gitRepo.errorRes      = null;
    gitRepo.totalOpenIssue = 0;
    gitRepo.totalOpenIssueLast24Hr = 0;
    gitRepo.totalOpenIssueBetween7DAnd24H = 0;
    gitRepo.totalOpenIssueMoreThan7D = 0;
    gitRepo.getOpenIssue = getOpenIssue;



    //Request git api to check open issue of given git repo URL
    function getOpenIssue(gitRepoURL){
      gitRepo.responseStatus="awaiting";
      //github gives paginated response for maximum of 300 event having 30 item per page
      $http.get("https://api.github.com/repos" + gitRepoURL.split("github.com")[1], {params: {"state": "open", "page":1}} )
      .success(function(openIssuesRes){
        gitRepo.responseStatus="success";
        gitRepo.totalOpenIssue = openIssuesRes.length;
        gitRepo.totalOpenIssueLast24Hr = countOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-24*3600000 ),     ( new Date().getTime()) );
        gitRepo.totalOpenIssueBetween7DAnd24H = countOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-7*24*3600000 ), ( new Date().getTime()-24*3600000) );
        gitRepo.totalOpenIssueMoreThan7D = countOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-7*24*3600000 ),      ( new Date().getTime()) );
      })
      .error(function(openIssuesRes){
        gitRepo.responseStatus="error";
        gitRepo.errorRes=openIssuesRes.message;
      })
    }


    //return count of open issues, created within given time, time should be in MilliSecond
    function countOpenIssueByCreateDate(openIssues, fromInMilli, toInMilli){
      var totalFilteredCount = 0;
      for(var i=openIssues.length; i--;){
        openIssueCreateDate = new Date(openIssues[i].created_at).getTime();
        console.log(openIssueCreateDate);
        console.log(fromInMilli);
        console.log(toInMilli);
        if ( openIssueCreateDate > fromInMilli && openIssueCreateDate <= toInMilli ){
          totalFilteredCount = totalFilteredCount + 1;
        }
      }
      return totalFilteredCount;
    }
  }


})();
