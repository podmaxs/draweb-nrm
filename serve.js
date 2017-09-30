'use strict';


let app    = require('./dist/module');
	
let router = new app.router('sample');
	//session = require('draweb-nrm-session');

	//router.addVerb('get', '/sample','getSample');
new app.serve(new app.config({
	appName: "Sample draweb-nrm",
	apikey:  "myapikey"
}), [
	//session
]).run([router]);