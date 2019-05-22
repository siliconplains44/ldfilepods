
var config = {};

config.filepodsapiurl = 'https://filepodsapi.leoparddata.com:50002';
config.filepodsapiusername = '';
config.filepodsapipassword = '';

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