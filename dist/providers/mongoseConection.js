'use strict';

let mongoose       = require('mongoose');
	module.exports = function(dbname) {
		let self = this;
		mongoose.Promise = require('bluebird')
		mongoose.connect('mongodb://localhost/'+dbname, { useMongoClient: true })
		.then(
			() => {
				console.log('Connected to mongodb, ready !!!');
			}
		)
		.catch(err => console.log(`Database connection error: ${err.message}`));

		var conn = mongoose.connection;
		conn.once('open',() => {
		    console.log('Conection to mongodb open');
		});

	}