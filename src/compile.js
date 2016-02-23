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

    var context = homunculus.getContext('js').parse('function anima(){' + data.formatTpl + '}').getChildren()[0],
        vars = context.getVars(),
        vids = context.getVids();

    vars.forEach(function (vardecl) {
        var v = vardecl.first().token().content();
        hash[v] = true;
    });

    vids.forEach(function (vid) {
        var v = vid.token().content();
        if (hash[v]) {
            return;
        }
        hash[v] = true;
        args.push(v);
    });

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
