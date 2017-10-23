'use strict';


let app    = require('./dist/module');
	
	//session = require('draweb-nrm-session');

new app.serve(new app.config({
	appName: "Sample draweb-nrm",
	apikey:  "myapikey"
}), [
	//session
]).run(['sample']);