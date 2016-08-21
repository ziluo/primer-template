var fs = require('fs');
var path = require('path');

var watch = require('./watch');
var Var = require('./var');

var entry;

var unescape = function (code) {
  return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
};

var format = function (str, filePath) {

  return str
    .replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ')
    .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, '')
    .replace(/<%(.+?)%>/g, function (m, code) {

      code = code.trim();

      if (code.substring(0, 1) === '=') {

        console.log(code.substring(1), '---------',  new Var(code.substring(1)).result);

        return ("';out+=(" + unescape(new Var(code.substring(1)).result) + ");out+='");
      } else {
        var matchArr = code.match(/^include\((.+)?\)$/);
        var tplPath;

        if (matchArr) {

          if (tplPath = matchArr[1]) {

            var targetPath = path.resolve(path.parse(filePath).dir, unescape(tplPath).replace(/['"]/gim, ''));

            if (fs.statSync(targetPath).isFile()) {

              watch(targetPath, entry);

              var openedFile = fs.readFileSync(targetPath, 'utf-8');

              return format(openedFile, targetPath);
            } else {
              console.error('Include的模板路径不是文件');
            }
          } else {
            console.error('Include的模板路径为空');
          }
          return '';
        } else {
          return ("';" + unescape(code) + "\n out+='");
        }
      }
    });
};

module.exports = function (str, filePath) {

  entry = filePath;

  var formatTpl =
    ("var out='" + format(str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, '').replace(/'|\\/g, '\\$&'), filePath) + "';return out;")
      .replace(/\t/g, '\\t')
      .replace(/\r/g, '\\r')
      .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1')
      .replace(/\+''/g, '')
      .replace(/(\s|;|\}|^|\{)out\+=''\+/g, '$1out+=')
      // 解决逻辑换行的bug
      .replace(/out\+='(\s+)';/gi, '');

  return JSON.stringify({
    code: str,
    formatTpl: formatTpl
  })
};
