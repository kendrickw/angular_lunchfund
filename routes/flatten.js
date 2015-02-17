/*jslint node: true */
"use strict";

/**
 * Return the Big 5 Traits normalized
 * See http://en.wikipedia.org/wiki/Big_Five_personality_traits
 * @return Array      The 5 main traits
 */
var big5 = function (tree) {
    var profile = typeof (tree) === 'string' ? JSON.parse(tree) : tree;
    return profile.tree.children[0].children[0].children.map(function (trait) {
        return { name: trait.name, value: trait.percentage };
    });
};

module.exports.big5 = big5;