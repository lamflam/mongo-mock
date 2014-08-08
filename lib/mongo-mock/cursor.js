var cb = require("./callback");

module.exports = cursor;

function cursor(objects) {
  var i = -1;
  return {
    each: function(callback) {
      objects.forEach(function(object) { callback(null, object); });
      cb(callback, null, null);
    },
    toArray: function(callback) {
      cb(callback, null, objects);
    },
    nextObject: function(callback) {
      cb(callback, null, ++i < objects.length? objects[i] : null);
    }
  };
}
