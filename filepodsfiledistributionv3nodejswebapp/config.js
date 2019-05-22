var config = {};

config.dbconnectionstring = "mongodb://mothershipmongo.leoparddata.com:27017/filestorage?ssl=true";

config.databasehostMothership = '';
config.databasehostFileStorage = '';
config.databaseport = 3306;
config.databaseusername = '';
config.databasepassword = '';
config.databaseMothership = 'filepods';
config.databaseFileStorage = 'filestoragenode1';
config.cert = __dirname + '/certs/ca-cert.pem';
config.connectionpoolconnectioncount = 100;

module.exports = config;