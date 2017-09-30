'use strict';

let express        = require('express');
	module.exports = function(response) {
		var self = this;
		this.responseModel = function(data, log, state){
			return {
				data:  data || [],
				log:   log || "no set response",
				state: state || 0
			}
		}


		this.send = function(data, log, state){
			response.send(new self.responseModel(data, log, state));
		}

		this.success = function(data, log){
			self.send(data, log || "Done", 201);
		}

		this.error = function(log, code){
			self.send([], log || "error", code || 409);
		}



		return {
			send:    self.send,
			success: self.success,
			error:   self.error
		}
	}