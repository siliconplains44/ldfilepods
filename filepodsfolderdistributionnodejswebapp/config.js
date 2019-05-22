
var config = {};

config.dbconnectionstring = "mongodb://mothershipmongo.leoparddata.com:27017/filestorage?ssl=true";

config.databasehost = '';
config.databaseport = 3306;
config.databaseusername = '';
config.databasepassword = '';
config.database = 'filepods';
config.cert = __dirname + '/certs/ca-cert.pem';
config.connectionpoolconnectioncount = 100;


module.exports = config;