var math = require('mathjs');
var test = "abc";
math.config({
  number: 'BigNumber'
});

function rot(a,b) {
  return 1;
}
math.import({
  rot: rot
});

console.log(test.substr(1));
console.log(math.eval('1rot2'));