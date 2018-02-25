var config = require("../Config/Config");
const Cache = require('node-cache');
var Customer = require("../Dao/applicationDao").customer,
	CustomerLogin = require("../Dao/applicationDao").customerLogin,
	Loan = require("../Dao/applicationDao").loanSchema,
	uuid = require("uuid/v1"),
	utils = require("../utils/util"),
	mailSender = require("../mailSender/mailSender"),
	mailbody = require("../mailSender/mailBody"),
	crypto = require("crypto"),
	async = require("async");
	const tempCache = new Cache();
	var unauth = {
		status: -2
	};
var options = {
	host: config.internalIp,
	port: config.internalPort,
	path: "/login/validate",
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
};
exports.customerLogin = function(request, response) {
	var data = request.body;
	var login = new CustomerLogin();
	var token = "";
	console.log("Customer Login");
	console.log(data);
	try {
		var lkey = utils.getLkey();
		var receivedEmail = utils.encrypt(data.email, lkey);
		Customer.find({
				email: receivedEmail||" "
			})
			.exec(function(err, docs) {
				if (err) {
					console.log("CustomerLogin-- error finding emailId in database");
					console.log(err);
					response.json(utils.failure);
				}
				if (docs.length === 1) {
					var pass = utils.encrypt(data.password || " ", utils.getHash(data.password || " "));
					if (docs[0].password === pass) {
						console.log("valid Credentials");
						login.email = data.email;
						login.customerId = docs[0]._id;
						token = uuid().toString();
						login.token = token;
						login.loginDate = new Date(Date.now());
						var time = Date.now() + 600000;
						login.save(function(err){
							if(!err){
								console.log("No Error in saving the login Details");
								var sk = docs[0]._id + utils.getHash(docs[0]._id.toString());
								response.json({token:token,status:utils.success,firstname:utils.decrypt(docs[0].firstname, sk), lastname:utils.decrypt(docs[0].lastname, sk), region:utils.decrypt(docs[0].region, sk),country:utils.decrypt(docs[0].country, sk)});
							}else{
								console.log("Error in Saving the login Details")
							}
						})
					} else {
						console.log("invalid password");
						response.json(utils.unauth);
					}
				} else {
					console.log('Logging docs');
					console.log("operation not Authorized");
					response.json(utils.unauth);
				}
			});
	} catch (e) {
		response.json(utils.unauth);
		console.log(e);
	}
};

exports.customerLogout = function(request, response) {
	if (!request.body.token) {
		console.log("no token");
		response.json(utils.failure);
		return;
	}
	CustomerLogin.find({
			token: request.body.token||" "
		})
		.exec(function(err, docs) {
			if (err) {
				response.json(err);
				console.log("error");
			} else if (!docs[0]) {
				console.log("token not found");
			} else {
				if (!docs[0].pending) {
					docs[0].token = null;
				}
				docs[0].logoutDate = new Date(Date.now());
				docs[0].save(function(err) {
					if (err) {
						console.log("Customer Logout-- token not set to null");
						response.json(utils.failure);
					} else {
						console.log("Customer Logout-- logged out");
						response.json(utils.success);
					}
				});
			}
		});
};
exports.getCustomers = function(request, response) {
	var lkey = utils.getLkey();
	Customer.find({},function(err, customers) {
		if (err) {
			console.log("getCustomers -- error getting customersersities");
			console.log(err);
			response.json(utils.failure);
		} else {
			for (var i = 0; i < customers.length; i++) {
				var sk = customers[i]._id + utils.getHash(customers[i]._id.toString());
				customers[i].firstname = utils.decrypt(customers[i].firstname, sk);
				customers[i].lastname = utils.decrypt(customers[i].lastname, sk);
				customers[i].region = utils.decrypt(customers[i].region, sk);
				customers[i].country = utils.decrypt(customers[i].country, sk);
				customers[i].email = utils.decrypt(customers[i].email, lkey);
				customers[i].address = utils.decrypt(customers[i].address, sk)
			}
			response.json(customers);
		}
	});
};

exports.addCustomer = function(request, response) {
	console.log("Add customer");
	var lkey = utils.getLkey();
	var customer = new Customer();
	customer.email = utils.encrypt((request.body.email || "customerforims@gmail.com").toString(), lkey);
	customer.save(function(err, data) {
		if (err) {
			console.log(err);
			console.log("Couldn't save");
			response.json(utils.failure);
			rollbackcustomer({_id:data._id});
		} else {
			var sk = customer._id + utils.getHash(customer._id.toString());
			customer.firstname = utils.encrypt(request.body.firstname || "Cristiano", sk).toString();
			customer.lastname = utils.encrypt(request.body.lastname || "Ronaldo", sk).toString();
			customer.region = utils.encrypt(request.body.region || "Madiera", sk).toString();
			customer.password = utils.encrypt(request.body.password || "password", utils.getHash(request.body.password || "password"));
			customer.address = utils.encrypt(request.body.address || "3rd Street", sk).toString();
			customer.country = utils.encrypt(request.body.country || "Portugal", sk).toString();
			customer.isKycVerified = false;
			customer.save(function(err) {
				if (err) {
					response.json(utils.failure);
					console.log(err);
					console.log("addcustomer -- error saving customer");
				} else {
					console.log("customer Added:");
					response.json(utils.success);
				}
			});
		}
	});
}
exports.newLoan = function(request, response) {
	var loan = new Loan();
	
	CustomerLogin.findOne({
			token: request.body.token||" "
		})
		.exec(function(err, doc) {
			// hit to blockchain on event emited save the loandata
			if(err)
				response.json({status:false, message: 'Token Expired'});
			loan.customerAddress = doc.ethAddress;
			loan.loanAmount = request.body.loanAmount;
			loan.loanDuration = request.body.loanDuration;
			loan.customerName = request.body.customerName;
			loan.loanStatus = 0;
			loan.save(function(err,data){
				console.log('Loan saved to DB');
				response.json({status: true, message: 'Loan Applied'});
			});
			
		});	
}

exports.getLoansCustomer = function(request, response) {

/*    if(request.body.token.trim() == ""){
		response.json({status:false, message: 'Please provide a valid token'});
	}*/
	CustomerLogin.findOne({
			token: request.body.token||" "
		})
		.exec(function(err, doc) {
			// hit to blockchain on event emited save the loandata

			if(err)
				response.json({status:false, message: 'Token Expired'});

			var address = doc.ethAddress;
			Loan.find({loanStatus: 2},function(err, loans) {
				if (err) {
					console.log("problem in getting loan details");
					console.log(err);
					response.json(utils.failure);
				}

					response.json(loans);
			});
			
		});

};

exports.getLoansAdmin = function(request, response) {
/*    if(!(request.body.token && request.body.token == config.token)){
		response.json({status:false, messsage: 'Not Authorized'});
	}
*/	Loan.find({granted:false},function(err, loans) {
		if (!err) {
			response.json(loans);
		}else{
			console.log(err)
		}
	});
			
};


exports.repayLoan = function(request, response) {
/*    if(request.body.token.trim() == ""){
		response.json({status:false, message: 'Please provide a valid token'});
	}
*/

/*	CustomerLogin.findOne({
			token: request.body.token||" "
		})
		.exec(function(err, doc) {
			// hit to blockchain on event emited save the loandata
			if(err)
				response.json({status:false, message: 'Token Expired'});
			var address = doc.ethAddress;
			var loanId = request.body.loanId;
*/
			var loanId = request.body._id;
			Loan.findById(loanId,function(err, loan) {
				if (err) {
					console.log("problem in getting loan details");
					console.log(err);
					response.json(utils.failure);
				}
			else{
							loan.loanStatus = 3; // 3 --> repayed entire loan
			loan.save(function(err,data){
				console.log('Loan updated to DB');
				response.json({status: true, message: 'Repayment Done'});
			});
			}

/*					
			});
*/			
		});

};

exports.approveLoan = function(request, response) {
/*    if(!(request.body.token && request.body.token == config.token)){
		response.json({status:false, messsage: 'Not Authorized'});
	}
*//*	if(loanId == ''){
		response.json({status:false, messsage: 'Please provide LoanId'});
	}*/
	console.log("approveLoan");
	console.log(request.body);
	var loanId = request.body._id;
	
	
	Loan.findById(loanId,function(err, loan) {
		if (err) {
			console.log("problem in getting loan details");
			
			console.log(err);
			response.json(utils.failure);
		}else{
			console.log(loan);
		console.log('loan object: '+loan.loanStatus);
		console.log('loan object: '+loan.loanAmount);
		loan.loanStatus = 1; // 1 --> approved loan
		loan.interestRate = request.body.interestRate || 3; // 3% 
		loan.save(function(err,data){
			console.log('Loan updated to DB');
			response.json({status: true, message: 'Loan Approved'});
		});
		}

	});
};

exports.grantLoan = function(request, response) {
/*if(!(request.body.token && request.body.token == config.token)){
		response.json({status:false, messsage: 'Not Authorized'});
	}
	if(loanId == ''){
		response.json({status:false, messsage: 'Please provide LoanId'});
	}*/
	var loanId = request.body._id;
	
	Loan.findById(loanId,function(err, loan) {
		if (err) {
			console.log("problem in getting loan details");
			
			console.log(err);
			response.json(utils.failure);
		}
		else{
		loan.loanStatus = 2; // 1 --> granted loan
		loan.granted = true;
		loan.save(function(err,data){
			console.log('Loan updated to DB');
			response.json({status: true, message: 'Loan Granted'});
		});
	}
	});

};