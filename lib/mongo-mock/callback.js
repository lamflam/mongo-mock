
module.exports = callback;

function callback(fn /* [, args ] */) {

  var args = Array.prototype.slice.call(arguments, 1);
  var $this = this;
  if (fn) setTimeout(function() { fn.apply($this, args); }, 0);
}
