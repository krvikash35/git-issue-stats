(function(){

  angular
  .module('app', [])
  .controller('GitRepoController', GitRepoController);

  GitRepoController.inject = ['$http', '$q', '$scope']

  function GitRepoController($http, $q, $scope){
    var gitRepo = this;

    //Initialize gitRepo enitity data with default value;
    gitRepo.errorRes      = null;
    gitRepo.totalOpenIssue = 0;
    gitRepo.totalOpenIssueLast24Hr = 0;
    gitRepo.totalOpenIssueBetween7DAnd24H = 0;
    gitRepo.totalOpenIssueMoreThan7D = 0;
    gitRepo.getGitRepoOI = getGitRepoOI;



    //Request git api to check open issue of given git repo URL
    function getGitRepoOI(gitRepoURL){
      gitRepo.responseStatus="awaiting"
      gitRepoOIApiURL = getGitRepoOIApiURL(gitRepoURL)
      var gitRepoOILastPageNo = null;
      var gitRepoOIByPage = [];

      // github gives paginated response for maximum of 300 event having 30 item per page
      $http.get( gitRepoOIApiURL , {params: {"state": "open", "page":1}} )
      .then( function processApiRes(response){
        gitRepoOILastPageNo = getGitRepoOILastPageNo(response.headers('Link'))
        return getGitRepoOIByPage(gitRepoOILastPageNo, gitRepoOIApiURL)
      })
      .then( function processData(data){
        gitRepo.responseStatus="success";
        gitRepoOIByPage = data;
        gitRepo.totalOpenIssue = gitRepoOIByPage.length;
        gitRepo.totalOpenIssueLast24Hr = getGitRepoOICount(gitRepoOIByPage, ( new Date().getTime()-24*3600000 ),     ( new Date().getTime()) );
        gitRepo.totalOpenIssueBetween7DAnd24H = getGitRepoOICount(gitRepoOIByPage, ( new Date().getTime()-7*24*3600000 ), ( new Date().getTime()-24*3600000) );
        gitRepo.totalOpenIssueMoreThan7D = getGitRepoOICount(gitRepoOIByPage, ( new Date().getTime()-7*24*3600000 ),      ( new Date().getTime()) );
      })
      .catch(function(err){
        gitRepo.responseStatus="error";
        if( err.status && err.status==-1)
          gitRepo.errorRes = "CONN_TIMED_OUT: pls check url or connection"
        else
          gitRepo.errorRes=err;
      })
    }



    //return count of open issues, created within given time, time should be in MilliSecond
    function getGitRepoOICount(openIssues, fromInMilli, toInMilli){
      var totalFilteredCount = 0;
      for(var i=openIssues.length; i--;){
        openIssueCreateDate = new Date(openIssues[i].created_at).getTime();
        if ( openIssueCreateDate > fromInMilli && openIssueCreateDate <= toInMilli ){
          totalFilteredCount = totalFilteredCount + 1;
        }
      }
      return totalFilteredCount;
    }


    //get last page no(indicate total page also), that git send for all open issues through pagination;extract the header link attribute;
    //res e.g----http://d.com?page=2; rel="next", http://d.com?page=9; rel="last"
    function getGitRepoOILastPageNo(headerLink){
      var lastPageNo = 1;
      if ( !headerLink ){
        return lastPageNo;
      }
      var lastPageURLSeg = headerLink.split(',')[1].split(';')[0];
      lastPageNo = lastPageURLSeg.charAt(lastPageURLSeg.indexOf("page=")+5);
      return lastPageNo;
    }


    //Return openIssue by going through given no of page as git return paginated reponse
    function getGitRepoOIByPage(totalPage, gitRepoURL){
      var defer = $q.defer();
      var OIPerPage = [];
      var OIByPage = [];
      for(var i=1; i<=totalPage; i++)
      OIPerPage[i-1] =  $http.get(gitRepoURL, {params: {"state": "open", "page": i}} )
      $q.all(OIPerPage)
      .then(function(OIPerPage){
        for( var i=0; i<totalPage; i++ ){
          if ( OIPerPage[i].status != 200 )
          defer.reject('Error response from server')
          var currPageData = OIPerPage[i].data;
          for( var j=0; j<currPageData.length; j++ )
          OIByPage.push(currPageData[j])
        }
        defer.resolve(OIByPage);
        return OIByPage;
      })
      return defer.promise;
    }


    //takes git repo URL and format it to appropriate api URL, enter either RepoURL or RepoOpenIssueURL
    function getGitRepoOIApiURL(gitRepoURL){
      var gitRepoOIApiURL = null
      if ( gitRepoURL.indexOf('issues') == -1 ){
        gitRepoURL = gitRepoURL+"/issues"
      }
      gitRepoOIApiURL = "https://api.github.com/repos" + gitRepoURL.split("github.com")[1];
      return gitRepoOIApiURL;
    }

  }


})();
