'use strict';

let mongoose       = require('mongoose');
	module.exports = function(dbname) {
		let self = this;


		this.opendb = function(){
			return new Promise((resolve, reject) => {
				mongoose.Promise = global.Promise;
				mongoose.connect('mongodb://localhost/'+dbname, { useMongoClient: true })
				.then(
					() => {
						console.log('Connected to mongodb, ready !!!');
						//mongoose.set('debug', true);
						resolve(mongoose);
					}
				)
				.catch(err => {console.log(`Database connection error: ${err.message}`); reject(err);});

				var conn = mongoose.connection;
				conn.once('open',() => {
				    console.log('Conection to mongodb open');
				});
			})
		}




	}