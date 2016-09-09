# Niddar: Pagination Generator
Practical Pagination Generator For NodeJS

[![GitHub issues](https://img.shields.io/github/issues/webreinvent/niddar-pagination-generator.svg?style=flat-square)](https://github.com/webreinvent/niddar-pagination-generator/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/webreinvent/niddar-pagination-generator/master/LICENSE)


Tried almost almost every package available on npm to generate pagination but none of them solve the purpose without customizing the code.

This repository contains a npm module with a very practical approach to generate pagination.

## Install
```
npm install --save niddar-pagination-generator
```

## Usage

```javescript
var pagination = require('niddar-pagination-generator');
var config = {
    totalRecords: 10,
    recordsPerPage: 5,
    currentPage: 1
};
var paginator = new NiddarPagination(config);
```

## Output
```
Pagination {
config: 
   { totalRecords: 11,
     recordsPerPage: 5,
     currentPage: 1,
     currentUrl: '',
     template: 'bootstrap',
     pageParameter: 'page',
     first: 1,
     displayPages: 10,
     firstLabel: '«',
     previousLabel: '‹',
     nextLabel: '›',
     lastLabel: '»' 
   },
offset: 5,
totalPages: 3,
range: 
   [ { page: 1, url: '?page=1', isCurrent: true },
     { page: 2, url: '?page=2' },
     { page: 3, url: '?page=2' },
     { page: 2, url: '?page=2', label: '›'  },
     { page: 3, url: '?page=3', label: '»' } 
   ],
render:'<nav aria-label="Page navigation"><ul class="pagination"><li class="active"><a href="?page=1">1</a></li><li class=""><a href="?page=2">2</a></li><li class=""><a href="?page=3">3</a></li><li class=""><a href="?page=2">›</a></li><li class=""><a href="?page=3">»</a></li></ul></nav>'
}
```



## Custom URL

In a real world, you would like to generate pagination url with other parameters as well. 
 
 Example: 
 Current url: example.com/users?filter=name or example.com/users?filterA=valA&filterB=valB
 
 In such scenario you can configure pagination like following:
 ```javescript
 var pagination = require('niddar-pagination-generator');
 
 var config = {
     totalRecords: 10,
     recordsPerPage: 5,
     currentPage: 1,
     currentUrl: url //value of current url 
 };
 var paginator = new NiddarPagination(config);
 ```
 This will generate url with adding another parameter in url as page. Output url will be following:
 ```
 Input url = example.com/users?filter=name
 Output url = example.com/users?filter=name&page=1
 ```
 
## Available Configurations
 ```javascript
  var config = {
        totalRecords    :   10, //total number of records
        recordsPerPage  :   5, //items per item
        currentPage     :   1, //current page
        currentUrl      :   "http://example.com", //value of current url 
        template        :   'bootstrap', //it support "bootstrap" & "foundation"
        pageParameter   :   'page', //page parameter name
        displayPages    :   10, //number of pages to display
        firstLabel      :   '«', 
        previousLabel   :   '‹', 
        nextLabel       :   '›',
        lastLabel       :   '»'  
  };
  ```