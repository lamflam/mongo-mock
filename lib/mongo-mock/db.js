var collection = require("./collection");

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
      callback(null,this);
    },
    collection: function(name, options, callback) {
      if (!callback) { callback = options; options = null; }
      
      if ( !collections[name] ) collections[name] = collection(id + "/" + name, options);
      if ( callback ) callback(null, collections[name]);
      return collections[name]; 
    },
    toString: function() {
      return id;
    }
  };
}
