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
    gitRepo.checkOpenIssue = checkOpenIssue;



    //Request git api to check open issue of given git repo URL
    function checkOpenIssue(gitRepoURL){
      console.log("checking for open issue at gitURL: "+gitRepo.repoURL);
      gitRepo.responseStatus="started";
      $http.get("https://api.github.com/repos" + gitRepoURL.split("github.com")[1], {params: {"state": "open"}} )
      .success(function(openIssuesRes){
        gitRepo.totalOpenIssue = openIssuesRes.length;
        gitRepo.totalOpenIssueLast24Hr = filterOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-1000*24*3600000 ),     ( new Date().getTime()) );
        gitRepo.totalOpenIssueBetween7DAnd24H = filterOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-7*24*3600000 ), ( new Date().getTime()) );
        gitRepo.totalOpenIssueMoreThan7D = filterOpenIssueByCreateDate(openIssuesRes, ( new Date().getTime()-7*24*3600000 ),      ( new Date().getTime()-24*3600000) );
      })
      .error(function(openIssuesRes){
        gitRepo.errorRes=openIssuesRes;
      })
      .finally(function(){
        gitRepo.responseStatus="finished";
      })
    }


    //return count of open issues, created within given time, time should be in MilliSecond
    function filterOpenIssueByCreateDate(openIssues, fromInMilli, toInMilli){
      var totalFilteredCount = 0;
      for(var i=openIssues.length; i--;){
        openIssueCreateDate = new Date(openIssues[i].created_at).getTime();
        if ( openIssueCreateDate > fromInMilli && openIssueCreateDate < toInMilli ){
          totalFilteredCount = totalFilteredCount + 1;
        }
      }
      return totalFilteredCount;
    }
  }


})();
