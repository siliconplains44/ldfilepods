
var config = {};

config.databasehost = 'mothershipmaria.leoparddata.com';
config.databaseport = 3306;
config.databaseusername = '';
config.databasepassword = '';
config.database = 'filepods';
config.cert = __dirname + '/certs/ca-cert.pem';
config.connectionpoolconnectioncount = 100;
config.webserviceusername = "";
config.webservicepassword = "";

config.filestorageserviceapiurl = 'https://filestoragev2api.leoparddata.com:50013';
config.filestorageserviceapiusername = '';
config.filestorageserviceapipassword = '';

config.securityserviceapiurl = 'https://securityapi.leoparddata.com:50008'
config.securityserviceapiusername = '';
config.securityserviceapipassword = '';

config.treesserviceapiurl = 'https://treesapi.leoparddata.com:50017'
config.treesserviceapiusername = '';
config.treesserviceapipassword = '';

module.exports = config;