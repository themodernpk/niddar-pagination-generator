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
    this.config.displayPages = config.displayPages || 5;
    this.config.firstLabel = config.firstLabel || '«';
    this.config.previousLabel = config.previousLabel || '‹';
    this.config.middleLabel = config.middleLabel || '...';
    this.config.nextLabel = config.nextLabel || '›';
    this.config.lastLabel = config.lastLabel || '»';
    this.config = this.getConfig();
    this.offset = this.getOffset();
    this.totalPages = this.getTotalPages();
    this.next = this.getNext();
    this.firstHalf = this.getFirstHalf();
    this.mid = this.getMiddle();
    this.secondHalf = this.getSecondHalf();
    this.previous = this.getPrevious();
    this.last = this.getLast();
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
Pagination.prototype.getNext = function () {
    var next = this.config.currentPage + 1;
    if (next < this.getTotalPages()) {
        return next;
    } else {
        return false;
    }
}
//----------------------------------
Pagination.prototype.getMiddle = function () {
    return Math.ceil(this.getTotalPages() / 2);
}
//----------------------------------
Pagination.prototype.getFirstHalf = function () {
    var result = {
        start: this.config.first,
        end: this.getMiddle() - 1
    }
    result.pages = [];
    for (var i = 0; i < result.end; i++) {
        if (i > this.getOffset()) {
            break;
        }
        result.pages[i] = {
            page: i + 1,
            url: this.buildUrl(i + 1)
        };
    }
    return result.pages;
}
//----------------------------------
Pagination.prototype.getSecondHalf = function () {
    var result = {
        start: this.getMiddle() + 1,
        end: this.getTotalPages()
    }
    var range = result.end - result.start;
    result.pages = [];
    for (var i = 0; i <= this.getOffset(); i++) {
        var page = result.end - (this.getOffset() - i);
        result.pages[i] = {
            page: page,
            url: this.buildUrl(page)
        };
    }
    return result.pages;
}
//----------------------------------
Pagination.prototype.getPrevious = function () {
    var previous = this.config.currentPage - 1;
    if (previous > 0) {
        return previous;
    } else {
        return false;
    }
}
//----------------------------------
Pagination.prototype.getLast = function () {
    return this.getTotalPages();
}
//----------------------------------
Pagination.prototype.getGenerator = function () {
    var result = {};
    result.first = {
        page: this.config.first,
        label: this.config.firstLabel,
        url: this.buildUrl(this.config.first)
    }
    if (this.getPrevious()) {
        result.previous = {
            page: this.getPrevious(),
            label: this.config.previousLabel,
            url: this.buildUrl(this.getPrevious())
        }
    }
    result.firstHalf = this.getFirstHalf();
    result.middle = {
        page: this.getMiddle(),
        label: this.config.middleLabel,
        url: this.buildUrl(this.getMiddle())
    };
    result.secondHalf = this.getSecondHalf();
    if (this.getNext()) {
        result.next = {
            page: this.getNext(),
            label: this.config.nextLabel,
            url: this.buildUrl(this.getNext())
        }
    }
    result.last = {
        page: this.getLast(),
        label: this.config.lastLabel,
        url: this.buildUrl(this.getLast())
    }
    return result;
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
    if (generator.first) {
        html += '<li><a href="' + generator.first.url + '">' + generator.first.label + '</a></li>';
    }
    if (generator.previous) {
        html += '<li><a href="' + generator.previous.url + '">' + generator.previous.label + '</a></li>';
    }
    if (generator.firstHalf) {
        generator.firstHalf.forEach(function (item) {
            html += '<li><a href="' + item.url + '">' + item.page + '</a></li>';
        })
    }
    if (generator.middle) {
        html += '<li><a href="' + generator.middle.url + '">' + generator.middle.label + '</a></li>';
    }
    if (generator.secondHalf) {
        generator.secondHalf.forEach(function (item) {
            html += '<li><a href="' + item.url + '">' + item.page + '</a></li>';
        })
    }
    if (generator.next) {
        html += '<li><a href="' + generator.next.url + '">' + generator.next.label + '</a></li>';
    }
    if (generator.last) {
        html += '<li><a href="' + generator.last.url + '">' + generator.last.label + '</a></li>';
    }
    html += '</ul></nav>';
    console.log("html", html);
    return html;
}
//----------------------------------
module.exports = Pagination;