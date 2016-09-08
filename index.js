'use strict';
function Pagination(config) {
    this.validate(config);
    this.config = config;
    //optional
    this.config.template = config.template || 'bootstrap';
    this.config.pageParameter = config.pageParameter || 'page';
    this.config.first = isUndefined(config.first) ? 1 : config.first;
    this.config.displayPages = config.displayPages || 10;
    this.config.firstLabel = config.firstLabel || '«';
    this.config.previousLabel = config.previousLabel || '‹';
    this.config.middleLabel = config.middleLabel || '...';
    this.config.nextLabel = config.nextLabel || '›';
    this.config.lastLabel = config.lastLabel || '»';
    this.offset = this.getOffset();
    this.totalPages = this.getTotalPages();
    this.range = this.getRange();
    this.render = this.renderTemplate();
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
Pagination.prototype.getMiddle = function () {
    return Math.floor(this.getTotalPages() / 2);
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
Pagination.prototype.getRange = function () {
    var data = [];
    var start = 1;
    var end = 1 + this.config.displayPages;
    if (this.getTotalPages() < this.config.displayPages) {
        end = this.getTotalPages();
    }
    //if page is greater then offset and less then total pages minum offset
    if (this.config.currentPage > this.getOffset() && this.config.currentPage < (this.getTotalPages() - this.getOffset())) {
        start = this.config.currentPage - this.getOffset();
        end = start + this.config.displayPages;
    }
    //if page is greater then offset and less then total pages minum offset
    if (this.config.currentPage > (this.getTotalPages() - this.getOffset())) {
        start = this.getTotalPages() - this.config.displayPages;
        end = this.getTotalPages() + 1;
    }
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
    for (var y = start; y < end; y++) {
        if (this.config.currentPage == y) {
            data[i] = {
                page: y,
                url: this.buildUrl(y),
                isCurrent: true
            };
        } else {
            data[i] = {
                page: y,
                url: this.buildUrl(y)
            };
        }
        i++;
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
Pagination.prototype.renderTemplate = function () {
    var template = this.config.template;
    if (template == "bootstrap") {
        var html = this.getTemplateBoostrap();
    } else if (template == "foundation") {
        var html = this.getTemplateFoundation();
    }
    return html;
}
//----------------------------------
Pagination.prototype.getTemplateBoostrap = function () {
    var range = this.getRange();
    var html = '<nav aria-label="Page navigation"><ul class="pagination">';
    var len = range.length;
    for (var y = 0; y < len; y++) {
        var page = range[y];
        var activeClass = "";
        if ("isCurrent" in page) {
            activeClass = "active";
        }
        if ("label" in page) {
            html += '<li class="' + activeClass + '"><a href="' + page.url + '">' + page.label + '</a></li>';
        } else {
            html += '<li class="' + activeClass + '"><a href="' + page.url + '">' + page.page + '</a></li>';
        }
    }
    html += '</ul></nav>';
    return html;
}
//----------------------------------
Pagination.prototype.getTemplateFoundation = function () {
    var range = this.getRange();
    var html = '<ul class="pagination">';
    var len = range.length;
    for (var y = 0; y < len; y++) {
        var page = range[y];
        var activeClass = "";
        if ("isCurrent" in page) {
            activeClass = "current";
        }
        if ("label" in page) {
            html += '<li class="arrow ' + activeClass + '"><a href="' + page.url + '">' + page.label + '</a></li>';
        } else {
            html += '<li class="' + activeClass + '"><a href="' + page.url + '">' + page.page + '</a></li>';
        }
    }
    html += '</ul>';
    return html;
}
//----------------------------------
module.exports = Pagination;