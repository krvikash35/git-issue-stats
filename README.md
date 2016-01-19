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
this controller has 2 method 'getOpenIssue(gitRepoURL)' and 'countOpenIssueByCreateDate(openIssues, fromInMilli, toInMilli)'

getOpenIssue(gitRepoURL)
This function grab the git repository URL entered by user, and make webservice api request to github for
openIssues. It also show a waiting-spinner until response comes. Depending on error or success response
proper msg is shown. This function internally call 'countOpenIssueByCreateDate(openIssues, fromInMilli, toInMilli)'
to get all required stats.

countOpenIssueByCreateDate(openIssues, fromInMilli, toInMilli)
This function return the count of open issue within given time, from and to date should be in MilliSecond.


#improvement
if time permit,
writing in more modular way that angular provide, instead of writing in one js file.
let the user give control to input time-range, and then fetch all open-issue details or just count.
Minifying all js and css resources in one file..to give better page-load performance
