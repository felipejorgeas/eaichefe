'use strict';

var mongoClient = require('mongodb').MongoClient;

function MongoConnection() {
  var connectionInstance;

  function connect(connectionString, callback) {

    if (connectionInstance) {
      return callback(connectionInstance);
    }

    mongoClient.connect(connectionString, function(err, db) {
      connectionInstance = db;
      if (err) {
        throw err;
      }

      return callback(connectionInstance);
    });
  }

  return {
    connect: connect
  };
}

module.exports = MongoConnection();