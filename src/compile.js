// 模块依赖
var preParse = require('./preParse'),
    jsBeautify = require('js-beautify').js_beautify,
    homunculus = require('homunculus');

function compile(str, path){

    var finalFunc,
        data = JSON.parse(preParse(str, path)),
        hash = {out: true},
        args = [],
        realArgs = '',
        formalArgs = '';

    function getContextVars(context) {
        var vars = context.getVars().map(function(vd) {
            return vd.first().token().content();
        });
        var vids = context.getVids().map(function(vd) {
            return vd.token().content();
        });
        var params = context.getParams();

        vars.forEach(function (v) {
            if (params.indexOf(v) > -1) {
                hash[v] = true;
            }
        });
        vids.forEach(function (v) {
            if (params.indexOf(v) > -1 || hash[v]) {
                return;
            }
            hash[v] = true;
            args.push(v);
        });

        var children = context.getChildren();
        children.forEach(function(c) {
            getContextVars(c);
        });
    }

    var context = homunculus.getContext('js')
        .parse('function anima(){' + data.formatTpl + '}')
        .getChildren()[0];

    getContextVars(context);

    try {
        new Function(args, data.formatTpl);
    } catch (e) {
        if (typeof console !== 'undefined') console.log("Could not create a template function: " + data.code);
        throw e;
    }

    if (args.length) {
        realArgs = ('anima.' + args.join(',anima.'));
        formalArgs = args.join(',');
    }

    finalFunc = jsBeautify('module.exports = function(anima){return (function(' + formalArgs + '){' + data.formatTpl + '})(' + realArgs + ')};', {indent_size: 2});

    return finalFunc;
}

module.exports = compile;
