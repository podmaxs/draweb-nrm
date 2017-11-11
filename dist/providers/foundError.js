'use strict';

let check          = require('syntax-error'),
	fs             = require("fs"),
	herror         = new function() {


		this.check = function(){
			return new Promise((resolve,reject) => {
				let normalizedPath = require("path").join(process.env.PWD, "./modules"),
					errors         = [];
				//console.log(process.env.PWD,normalizedPath)
				console.log("Check code")
				fs.readdirSync(normalizedPath).forEach(function(folder) {
				 	if(fs.lstatSync(normalizedPath+'/'+folder).isDirectory()){
						let tmpPath = normalizedPath+'/'+folder;
				 		fs.readdirSync(tmpPath).forEach(function(file) {
				 			if(file.indexOf('.js') != -1){
				 				let src = tmpPath+'/'+file;
				 				let err = check(fs.readFileSync(src), src);
				 				if(err){
				 					errors.push(err);
				 					console.log(src);
				 					console.error('ERROR DETECTED' + Array(62).join('!'));
			 					    console.error(err);
			 					    console.error(Array(76).join('-'));
				 				}
				 			}
				 		});
				 	}
				});

				resolve(errors);
			});
		}
	};
module.exports = herror;