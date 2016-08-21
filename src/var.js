var acorn = require('acorn');

function Var(str) {
  this.asts = [];
  this.defaultValue = '""';

  this.result = '';

  this.judge(str);
}

Var.prototype.judge = function (str) {

  var ast = acorn.parse(str);

  if (ast.body.length > 1) {
    this.result = str;
  }

  var expr = ast.body[0].expression;

  if (expr.type === 'SequenceExpression') {

    var realTree = expr.expressions[0];
    var defaultTree = expr.expressions[1];

    if (defaultTree.type === 'Literal') {
      this.defaultValue = str.substring(defaultTree.start, defaultTree.end);
    }

    this.judge(str.substring(realTree.start, realTree.end));

  } else {
    this.getTree(ast.body[0].expression, str);

    this.result = this.getRst(this.asts);
  }
};

Var.prototype.getRst = function getRst(asts) {
  asts = asts.reverse();

  var firstArgument = asts.shift();

  if (!asts.length) {
    asts.push(firstArgument);
  }

  return '(typeof ' + firstArgument + ' !== undefined && ' + asts.join(' && ') + ') || ' + this.defaultValue;
};

Var.prototype.getTree = function (tree, str) {

  if (tree.type === 'CallExpression') {
    this.asts.push(str.substring(0, tree.end));

    tree.callee && this.getTree(tree.callee, str);
  }

  if (tree.type === 'MemberExpression') {
    this.asts.push(str.substring(0, tree.end));

    tree.object && this.getTree(tree.object, str);
  }

  if (tree.type === 'Identifier') {
    this.asts.push(str.substring(0, tree.end));
  }
};

module.exports = Var;