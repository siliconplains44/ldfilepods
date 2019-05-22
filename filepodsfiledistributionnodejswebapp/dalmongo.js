var config = require('./config');
var fs = require('fs');
var mongodb = require('mongodb');

function dataAccessLayerMongo() {

};

dataAccessLayerMongo.prototype.openConnection = function(cb) {
    var self = this;

    GLOBAL.db = null;
    GLOBAL.mongoClient = mongodb.MongoClient;

    var options = {
        auto_reconnect: true,
        poolSize : 50,
        db: {
            w: 1
        },
        server: {
            socketOptions: {
                keepAlive: 1
            },
            sslKey : fs.readFileSync(__dirname + "/certs2016/mongodb.pem"),
            sslCert : fs.readFileSync(__dirname + "/certs2016/mongodb.pem"),
            sslValidate : false
        }
    };

    GLOBAL.mongoClient.connect(config.dbconnectionstring, options, function(err, database) {
        if (!err) {
            GLOBAL.db = database;
            cb(null);
        }
        else {
            cb(err);
        }
    });
};

dataAccessLayerMongo.prototype.closeConnection = function() {
    var self = this;
    GLOBAL.mongoClient.clone();
};

dataAccessLayerMongo.prototype.executeQuery = function(collection, queryStatement, cb) {
    var self = this;
    GLOBAL.db.collection(collection).find(queryStatement, function(err, docs) {
        cb(err, docs);
    });
};

module.exports.dataAccessLayerMongo = dataAccessLayerMongo;
