'use strict';

	let busboy = require('connect-busboy'),
		path   = require('path'),
		fs     = require('fs-extra'),
		thumb  = require('node-thumbnail').thumb;

module.exports = function(){
	let self = this;

	this.makeIfNot = function(path){
		var fs = require('fs'),
			paths = path.split('/'),
			local = "";
		for(let i in paths){
			local += "/";
			if(paths[i] != ""){
				local += paths[i];
				if(!fs.existsSync(local))
				    fs.mkdirSync(local);
			}
		}
	}

	this.registerUpload = function(req, res){
		return new Promise((resolve, reject) => {
			let fstream;
	        req.pipe(req.busboy);
	        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
	            console.log("Uploading: " + filename);
	            let ext = self.getExtencion(filename);
	            //Path where image will be uploaded
	            let date      = new Date(),
	            	rootPath  = process.env.PWD,
	            	localpath = 'public/storage/' + ext.toLowerCase() + '/'+date.getDate()+eval(date.getMonth()+1)+date.getFullYear()+'/',
	            	dir       = rootPath + '/' + localpath,
	            	nname     = 'Arm'+date.getMinutes()+'s'+date.getHours()+'e'+date.getSeconds()+'.'+ext;
	            
	            console.log('save in: '+dir)
	            
	            self.makeIfNot(dir);

	            fstream = fs.createWriteStream(dir + nname);
	            file.pipe(fstream);
	            fstream.on('close', function () {    
	                console.log("Upload Finished of " + nname);  
	                if(mimetype.indexOf('image/') != -1){
	                	self.createminiature(localpath + nname, nname)
	                	.then(
	                		(miniaturename) => {
    			                resolve({
				                	local_url:  localpath + nname,
				                	server_url: self.createHttpHost(req)+localpath + nname,
				                	thumb_url:  self.createHttpHost(req)+miniaturename,
				                	ext:        ext,
				                	format:     mimetype,
				                	filename:   filename,
				                	size:       (file['_readableState']['highWaterMark'] || 0)
    			                });
	                		},
	                		err => {
	                			console.log(err)
    			                resolve({
				                	local_url:      localpath + nname,
				                	server_url:  self.createHttpHost(req)+localpath + nname,
				                	ext:         ext,
				                	format:      mimetype,
				                	filename:    filename,
				                	size:        (file['_readableState']['highWaterMark'] || 0)
    			                });
	                		}
                		)
	                } else{
		                resolve({
		                	local_url:   localpath + nname,
		                	server_url:  self.createHttpHost(req)+localpath + nname,
		                	ext:         ext,
		                	format:      mimetype,
		                	filename:    filename,
		                	size:        (file['_readableState']['highWaterMark'] || 0)
		                });
	                }           
	            });
			})
        });
	}

	this.createminiature = function(src, filename){
		return new Promise((resolve, reject) => {
			let root = src.replace('/'+filename, ''),
				name = filename.replace('.'+self.getExtencion(filename),'');
			thumb({
			  source:      process.env.PWD+'/'+src,
			  destination: process.env.PWD+'/'+root,
			  width:       480
			}).then(function(files) {
			  resolve(root+'/'+name+'_thumb.'+self.getExtencion(filename));
			}).catch(function(e) {
			  reject(e);
			});
		})
	}

	this.getExtencion = function(filename){
		return path.extname(filename).replace('.','');
	};

	this.createHttpHost = function(req){
		let host = req.headers.host;
		return 'http://'+host+'/';
	}

}