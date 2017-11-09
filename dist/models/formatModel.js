'use strict';


	module.exports = function() {
		var self = this;

		this.process = (request, response, actionVerb) => {
			return new Promise((resolve, reject) => {
				self.filterRequest(request)
				.then(
					nBody => {
						if(actionVerb){
							actionVerb(nBody)
							.then(
								verbResponse => {
									self.filterResponse(verbResponse)
									.then(
										nResponse => {
											resolve(nResponse);
										},
										responseError => {
											reject(responseError);
										}
									)
								},
								verbError => {
									reject(verbError);
								}
							)
						}else{
							reject("No verb action defined");
						}
					},
					errorBody => {
						reject(errorBody)
					}
				)
			});
		}

		this.filterRequest = (req, resp) => {
			return new Promise((resolve, reject) => {
				resolve(req.body);
			});
		}

		this.filterResponse = data => {
			return new Promise((resolve, reject) => {
				resolve(data);
			});
		}

		this.setfilterRequest = (nr) => {
			self.filterRequest = nr;
		}
		this.setfilterResponse = (nr) => {
			self.filterResponse = nr;
		}
		this.setProcess = (nr) => {
			self.process = nr;
		}


		return {
			newfilterRequest:  self.setfilterRequest,
			newfilterResponse: self.setfilterResponse,
			newProcess:        self.setProcess,
			process:           self.process
		}
	}