# git-repo-issue-stats
webapp to show the statistic of any git repo's issues

#Demo at
https://git-repo-issue-stats.herokuapp.com/

#N.B
incomplete, need to implement pagination request to git api to get complete info about openIssue

#Front end framework
angular;
bootstrap;
font-awesome;

#Back-end framework
node;
express;

#Explanation
There is one module('app') which has one controller('GitRepoController').
this controller has 1 main method 'getGitRepoOI(gitRepoURL)' and few others as helper.

getGitRepoOI(gitRepoURL)
This is the main function..that calls helper function in order..
getGitRepoOIApiURL()--> getGitRepoOILastPageNo-->getGitRepoOIByPage()-->getGitRepoOICount()

getGitRepoOIApiURL(gitRepoURL)
This method takes the gitRepo url(either just repoUrl or repoIssueURL),
parse and format as appropriate and return repo open issue api url.

getGitRepoOILastPageNo(headerLink)
This method extract the header to check, if data is spread over more than one page, and return the last pageNo

getGitRepoOIByPage(totalPage, gitRepoURL)
Git send reponse as pagination. So this method, collect and return all the open-issue off all page for given url.

getGitRepoOICount(openIssues, fromInMilli, toInMilli)
This method returns the count statistic of openIssue(Number of issues created) in given timeframe.
It accept to and from date in MilliSecond.


#improvement
if time permit,
writing in more modular way that angular provide, instead of writing in one js file.
let the user give control to input time-range, and then fetch all open-issue details or just count.
Minifying all js and css resources in one file..to give better page-load performance
