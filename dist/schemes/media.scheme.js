let mongoose = require('mongoose'),
	schema   = mongoose.Schema;

	var media = new schema({
		localPath:    {  type: String },
		ext:          {  type: String },
		date:{ 
			type: Date, default: Date.now 
		}
	});

	media.pre('save',function(next){
		let user = this;
			console.log(user,'on save user');
		next();
	});


	module.exports = mongoose.model('media', media);
