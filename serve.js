'use strict';


let app = require('./dist/module');
	
let router = new app.router('sample');

	//router.addVerb('get', '/sample','getSample');

new app.serve(new app.config({
	appName: "Sample draweb-nrm"
})).run([router]);