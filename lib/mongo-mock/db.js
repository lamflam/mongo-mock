var collection = require("./collection"),
    cb = require("./callback");

module.exports = Db;

var databases = {};

function Db(name, server, options) {
  var id = server + "/" + name, database = databases[id] || (databases[id] = db(id));
  for (var key in database) this[key] = database[key];
}

function db(id) {
  var collections = {};
  return {
    open: function(callback) {
      cb(callback, null, this);
    },
    collection: function(name, options, callback) {
      if (!callback) { callback = options; options = null; }
      
      if ( !collections[name] ) collections[name] = collection(id + "/" + name, options);
      cb(callback, null, collections[name]);
      return collections[name]; 
    },
    toString: function() {
      return id;
    }
  };
}
