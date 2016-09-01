'use strict';
var Pagination = require("niddar-pagination-generator");

var config = {
    totalRecords: 500,
    recordsPerPage: 10,
    currentPage: 3,
    url: "http://localhost.com/page.php?page=3&search=5#time",
};

var test = new Pagination(config);
console.log("response", test.template);
