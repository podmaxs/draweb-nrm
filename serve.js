'use strict';


let app = require('./dist/module');
	


new app.serve(new app.config({
	appName: "Sample draweb-nrm"
})).run();