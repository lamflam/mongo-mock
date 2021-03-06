var mongodb = require("../"),
    ObjectId = mongodb.ObjectId;

var server = new mongodb.Server("host", 27017),
    db = new mongodb.Db("database", server);

console.log("collection:");
db.open(function(error) {
  db.collection("collection", function(error, collection) {
    console.log("  host:27017/database/collection -> " + collection);
  });
});
console.log("");

db.open(function(error) {
  db.collection("empty", function(error, collection) {
    collection.find({}, log("empty + find"));
  });
});

db.open(function(error) {
  db.collection("insert", function(error, collection) {
    collection.insert({hello: "world"}, function(error) {
      collection.find({}, log("insert(object)"));
    });
  });
});

db.open(function(error) {
  db.collection("inserts", function(error, collection) {
    collection.insert([
      {string: "string"},
      {number: 42},
      {boolean: true},
      {null: null},
      {date: new Date(2011, 0, 1)},
      {object: {"boolean": true, "number": 42, "array": [1, 2, "three"]}},
      {array: [1, 2, "three"]}
    ], function(error) {
      collection.find({}, log("insert(objects)"));
    });

    collection.find({string: "string"}, log("find(string = \"string\")"));
    collection.find({number: 42}, log("find(number = 42)"));
    collection.find({number: {$gte: 42}}, log("find(number >= 42)"));
    collection.find({number: {$gt: 41}}, log("find(number > 41)"));
    collection.find({number: {$lte: 42}}, log("find(number <= 42)"));
    collection.find({number: {$lt: 43}}, log("find(number < 43)"));
    collection.find({number: {$gt: 41, $lt: 43}}, log("find(number < 43 and number > 41)"));
    collection.find({number: {$ne: 42}}, log("find(number != 42)"));
    collection.find({number: {$lt: 42}}, log("find(number < 42)"));
    collection.find({number: {$lte: 41}}, log("find(number <= 41)"));
    collection.find({number: {$gt: 42}}, log("find(number > 42)"));
    collection.find({number: {$gte: 43}}, log("find(number >= 43)"));
    collection.find({number: {$lte: 41, $gte: 43}}, log("find(number >= 43 and number <= 41)"));
    collection.find({boolean: true}, log("find(boolean = true)"));
    collection.find({boolean: false}, log("find(boolean = false)"));
    collection.find({boolean: {$ne: true}}, log("find(boolean != true)"));
    collection.find({null: null}, log("find(null = null)"));
    collection.find({string: {$gt: "strinf"}}, log("find(string > strinf)"));
    collection.find({string: {$lt: "strinh"}}, log("find(string < strinh)"));
    collection.find({string: {$regex: "^STR", $options: "i"}}, log("find(/^STR/i.test(string))"));
    collection.find({"object.boolean": true, "object.number": {$gt: -1}}, log("find(object.boolean = true and object.number > 41)"));
    collection.find({date: new Date(2011, 0, 1)}, log("find(date = 2011-01-01)"));
    collection.find({date: {$gte: new Date(2011, 0, 1)}}, log("find(date >= 2011-01-01)"));
    collection.find({date: {$gt: new Date(2010, 11, 31)}}, log("find(date > 2010-12-31)"));
    collection.find({date: {$lte: new Date(2011, 0, 1)}}, log("find(date <= 2011-01-01))"));
    collection.find({date: {$lt: new Date(2011, 0, 2)}}, log("find(date < 2011-01-02)"));
    collection.find({date: {$gt: new Date(2010, 11, 31), $lt: new Date(2011, 0, 2)}}, log("find(date < 2011-01-02 and date > 2010-12-31)"));
    collection.find({date: {$ne: new Date(2011, 0, 1)}}, log("find(date != 2011-01-01)"));
    collection.find({date: {$lt: new Date(2011, 0, 1)}}, log("find(date < 2011-01-01)"));
    collection.find({date: {$lte: new Date(2010, 11, 31)}}, log("find(date <= 2010-12-31)"));
    collection.find({date: {$gt: new Date(2011, 0, 1)}}, log("find(date > 2011-01-01)"));
    collection.find({date: {$gte: new Date(2011, 0, 2)}}, log("find(date >= 2011-01-02)"));
    collection.find({date: {$lte: new Date(2010, 11, 31), $gte: new Date(2011, 0, 2)}}, log("find(date >= 2011-01-02 and date <= 2010-12-31)"));
    collection.find({_id: new ObjectId("4e21d7d80123ab0123000004")}, log("find(_id = ObjectId(4e21d7d80123ab0123000004))"));
    collection.find({array: [1, 2, "three"]}, log("find(array = [1,2,\"three\"])"));

    collection.remove({string: "string"}, function(error) {
      collection.find({}, log("remove(string = string)"));
    });
    collection.remove({"does.not.exist": true}, function(error) {
      collection.find({}, log("remove(does.not.exist = true)"));
    });
    collection.remove({array: [1, 2, "three"]}, function(error) {
      collection.find({}, log("remove(array)"));
    });
    collection.remove({object: {"boolean": true, "number": 42, "array": [1, 2, "three"]}}, function(error) {
      collection.find({}, log("remove(object)"));
    });
    collection.remove({_id: new ObjectId("4e21d7d80123ab0123000004")}, function(error) {
      collection.find({}, log("remove(ObjectId(4e21d7d80123ab0123000004))"));
    });
    collection.remove({}, function(error) {
      collection.find({}, log("remove()"));
    });
  });
});

db.open(function(error) {
  db.collection("save", function(error, collection) {
    var object = {hello: "world"};
    collection.save(object, function(error) {
      collection.find({}, log("save(new)"));
      collection.save(object, function(error) {
        collection.find({}, log("save(existing)"));
        object.hello = 2;
        object.foo = "bar";
        collection.save(object, function(error) {
          collection.find({}, log("save(updated)"));
        });
      });
    });
  });
});

db.open(function(error) {
  db.collection("upsert", function(error, collection) {
    collection.update({hello: "world"}, {hello: "world"}, {upsert: true}, function(error) {
      collection.find({}, log("upsert(new)"));
      collection.update({hello: "world"}, {foo: "bar"}, {upsert: true}, function(error) {
        collection.find({}, log("upsert(existing)"));
      });
      collection.update({foo: "bar"}, {$set: {object: {field: 42}}}, function(error) {
        collection.find({}, log("update($set(object))"));
      });
      collection.update({"object.field": 42}, {$set: {"object.field": 43}}, function(error) {
        collection.find({}, log("update($set(object.field))"));
      });
      collection.update({foo: "bar"}, {$unset: {object: 1}}, function(error) {
        collection.find({}, log("update($unset)"));
      });
    });
  });
});

db.open(function(error) {
  db.collection("sort", function(error, collection) {
    for (var i = 10; --i >= 0;) collection.insert({key: i, group: (~~(i / 3) + 3) % 3});
    collection.find({}, {sort: {key: 1}}, log("sort(key)"));
    collection.find({}, {sort: {key: -1}}, log("sort(-key)"));
    collection.find({}, {sort: {group: 1, key: 1}}, log("sort(group, key)"));
    collection.find({}, {sort: {group: 1, key: -1}}, log("sort(group, -key)"));
    collection.find({}, {sort: {group: -1, key: 1}}, log("sort(-group, key)"));
    collection.find({}, {sort: {group: -1, key: -1}}, log("sort(-group, -key)"));
  });
});

function log(message) {
  return function(error, cursor) {
    console.log(message + ":");
    cursor.each(function(error, object) {
      if (object) console.log("  " + JSON.stringify(object));
      else console.log("");
    });
  };
}
