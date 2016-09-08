'use strict';
var Url = require("url");
var colors = require('colors');
function Pagination(config) {
    this.validate(config);
    this.config = config;
    //optional
    this.config.template = config.template || 'bootstrap';
    this.config.pageParameter = config.pageParameter || 'page';
    this.config.first = isUndefined(config.first) ? 1 : config.first;
    this.config.displayPages = config.displayPages || 7;
    this.config.firstLabel = config.firstLabel || '«';
    this.config.previousLabel = config.previousLabel || '‹';
    this.config.middleLabel = config.middleLabel || '...';
    this.config.nextLabel = config.nextLabel || '›';
    this.config.lastLabel = config.lastLabel || '»';
    this.offset = this.getOffset();
    this.totalPages = this.getTotalPages();
    this.range = this.getRange();
    this.generator = this.getGenerator();
    this.template = this.getTemplate();
}
//----------------------------------
function isUndefined(value) {
    return value === void 0;
}
//----------------------------------
//----------------------------------
Pagination.prototype.validate = function (config) {
    if (!config) {
        throw new Error('No `config` were passed, aborting.');
    }
    if (!config.totalRecords
        || !config.recordsPerPage
        || !config.currentPage
        || isNaN(config.totalRecords)
        || isNaN(config.recordsPerPage)
        || isNaN(config.currentPage)
    ) {
        throw new Error('You must define your `config` correctly, aborting.');
    }
}
//----------------------------------
Pagination.prototype.getConfig = function () {
    return this.config;
}
//----------------------------------
Pagination.prototype.getOffset = function () {
    return Math.floor(this.config.displayPages / 2);
}
//----------------------------------
Pagination.prototype.getTotalPages = function () {
    return Math.ceil(this.config.totalRecords / this.config.recordsPerPage);
}
//----------------------------------
Pagination.prototype.getPrevious = function () {
    var data;
    if (this.config.currentPage != 1) {
        data = this.config.currentPage - 1;
    }
    return data;
}
//----------------------------------
Pagination.prototype.getNext = function () {
    var data;
    if (this.config.currentPage < this.getTotalPages()) {
        data = this.config.currentPage + 1;
    }
    return data;
}
//----------------------------------
Pagination.prototype.getFirstHalf = function () {
    var data = [];
    var i = null;
    var offset = this.getOffset();
    if (this.config.currentPage <= this.getOffset()) {
        var start = this.config.first;
        var end = this.getOffset();
    } else {
        var start = this.config.currentPage - offset;
        var end = start + this.getOffset();
    }
    var y = 0;
    for (i = start; i < end; i++) {
        data[y] = i;
        y++;
    }
    return data;
}
//----------------------------------
Pagination.prototype.getSecondtHalf = function () {
    var data = [];
    var i = null;
    var offset = this.getOffset();
    var lastOffset = this.getTotalPages() - offset;
    if (this.config.currentPage >= lastOffset) {
        var start = this.config.currentPage;
        var end = this.getTotalPages();
    } else {
        var start = this.config.currentPage + 1;
        var end = start + this.getOffset();
    }
    var y = 0;
    for (i = start; i < end; i++) {
        data[y] = i;
        y++;
    }
    return data;
}
//----------------------------------
//----------------------------------
Pagination.prototype.getRange = function () {
    var range = this.getFirstHalf();
    range.push(this.config.currentPage);
    var second = this.getSecondtHalf();
    var range = range.concat(second);
    return range;
}
//----------------------------------
Pagination.prototype.getGenerator = function () {
    var data = [];
    var i = 0;
    if (this.config.currentPage != 1) {
        data[i++] = {
            page: this.config.first,
            label: this.config.firstLabel,
            url: this.buildUrl(this.config.first)
        }
        data[i++] = {
            page: this.getPrevious(),
            label: this.config.previousLabel,
            url: this.buildUrl(this.getPrevious())
        }
    }
    var range = this.getRange();
    var len = range.length;
    for (var y = 0; y < len; y++) {
        data[i++] = {
            page: range[y],
            label: range[y],
            url: this.buildUrl(range[y])
        }
    }
    if (this.config.currentPage < this.getTotalPages()) {
        data[i++] = {
            page: this.getNext(),
            label: this.config.nextLabel,
            url: this.buildUrl(this.getNext())
        }
        data[i++] = {
            page: this.getTotalPages(),
            label: this.config.lastLabel,
            url: this.buildUrl(this.getTotalPages())
        }
    }
    return data;
}
//----------------------------------
Pagination.prototype.getTemplate = function () {
    var template = this.config.template;
    if (template == "bootstrap") {
        var html = this.getTemplateBoostrap();
    }
    return html;
}
//----------------------------------
Pagination.prototype.getTemplateBoostrap = function () {
    var generator = this.getGenerator();
    var html = '<nav aria-label="Page navigation"><ul class="pagination">';
    var range = this.getGenerator();
    var len = range.length;
    for (var y = 0; y < len; y++) {
        var page = range[y];
        console.log("page", page);
        html += '<li><a href="' + page.url + '">' + page.label + '</a></li>';
    }
    html += '</ul></nav>';
    return html;
}
//----------------------------------
Pagination.prototype.buildUrl = function (page) {
    var currentUrl = this.config.url;
    var currentUrlPageString = this.config.pageParameter + "=" + this.config.currentPage;
    var newPageString = this.config.pageParameter + "=" + page;
    if (currentUrl.indexOf(currentUrlPageString) > -1) {
        var newUrl = currentUrl.replace(currentUrlPageString, newPageString);
    } else {
        var newUrl = currentUrl + "?" + newPageString;
    }
    return newUrl;
}
//----------------------------------
//----------------------------------
//----------------------------------
//----------------------------------
module.exports = Pagination;