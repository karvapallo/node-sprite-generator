'use strict';

var _ = require('underscore'),
    defaultOptions = require('./utils/defaultOptions'),
    scaleImages = require('./utils/scaleImages');

function sumUp(sum, value) {
    return sum + value;
}

function alphabetize(a, b) {
    if(a.filename < b.filename) {
        return -1;
    }
    if(a.filename > b.filename) {
        return 1;
    }
    return 0;
}

module.exports = function generateLayout(images, options, callback) {
    options = _.extend({}, defaultOptions, options);

    console.log(_(images))

    images = scaleImages(images, options);

    var amount = images.length;

    var size = Math.pow(Math.floor(Math.sqrt(amount) % 1 == 0 ? Math.sqrt(amount) : Math.sqrt(amount) + 1), 2);
    var side = Math.sqrt(size);
    var rowheight = _(images).chain().pluck('height').max().value();
    var columnwidth = _(images).chain().pluck('height').max().value();

    images.forEach(function(element) {
        element.filename = element.path.replace(/^.*[\\\/]/, '');
    });

    images.sort(alphabetize);

    var arrangedimages = new Array();
    var xi = 0;
    var yi = 0;
    images.forEach(function(element) {
        console.log(element);
        element.x = xi * columnwidth;
        element.y = yi * rowheight;
        xi += 1;
        if(xi >= side) {
            xi = 0;
            yi += 1;
        }
        arrangedimages.push(element);
    });


    callback(null, {
        width: columnwidth * side,
        height: rowheight * side,
        images: arrangedimages
    });
};
