/**
 * Created by ziluo on 16/2/23.
 */

var fs = require('fs');
var touch = require('touch');

module.exports = function(watchFile, entryFile){
    fs.watch(watchFile, function(){
        touch(entryFile);
    });
};
