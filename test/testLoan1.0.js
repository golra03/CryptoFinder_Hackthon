const Web3    		= require('web3');
const fs      		= require('fs');
const config  		= require('../config');
const loanAbi		= JSON.parse(require("../compiled/:LoanLedger")["interface"]);
const registryAbi   = JSON.parse(require("../compiled/:UserCustomerRegistry")["interface"]);
const tokenAbi    	= JSON.parse(require("../compiled/:BAETHToken")["interface"]);
const loanAccount   = JSON.parse(require("../compiled/:LoanAccount")["interface"]);
let web3 			= new Web3("ws://localhost:8546");

let args          = process.argv;
let LoanLedger    = new web3.eth.Contract(loanAbi,config.LoanLedger);
let Registry      = new web3.eth.Contract(registryAbi,config.UserCustomerRegistry);
let Token 		  = new web3.eth.Contract(tokenAbi,config.BAETHToken);
const fromAccount = "0x0e7f8512dbf4640bfba065675ec30fd7889fc30d";
const user        = "0xc3e0fe903d818a87172c2aa2d7b5a6a280404e1d";
const customers   = ["0x2bb31a3486cf3645d6322c9190cdb83dcd5af73b", "0xaec2b52c2bc5a165d100d890944b8d2b263d06ed"]
let automate      = true;

let registerUser = function () {
	Registry.events.UserRegistered(function (error,result) {
		console.log("New User Registered");
		//console.log(error||result);
		if(automate){
			console.log("===============================================================================\n\n");
			registerCustomer(0);
			registerCustomer(1);
		}
	});
	let ru = Registry.methods.registerUser(user,
		web3.utils.utf8ToHex("5a683f861e860129d75e95a9"));
	ru.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		//console.log(gasAmount);
		ru.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function(result){
			console.log("Set User funtion called");
			//console.log(result);
			console.log("===============================================================================\n\n");
		});
	});
}

let registerCustomer = function (index) {
	Registry.events.CustomerRegistered(function (error,result) {
		//console.log(result);
		console.log("event for "+index+" received");
		console.log("===============================================================================\n\n");
	});
	var par1 = web3.utils.utf8ToHex("5a683f861e860129d75e95a9");
	var par2 = web3.utils.utf8ToHex("5a683f861e860129d75a9");
	let cr = Registry.methods.registerCustomer(customers[index],[par1,par2,par2]);
	cr.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		//console.log(gasAmount);
		cr.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function(result){
			console.log("Set Customer called for customer " + index);
			//console.log(result)
			console.log("===============================================================================\n\n");
			if(index == 1 && automate){
				updateAddresses();
			}
		})
	});
}

let updateAddresses = function () {
	let ur = LoanLedger.methods.setRegistryAddress(config.UserCustomerRegistry);
	let ut = LoanLedger.methods.setTokenAddress(config.BAETHToken);
	let ul = Token.methods.setLedger(config.LoanLedger);
	ul.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		ul.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function (result) {
			//console.log(result)
			console.log("set Ledger called");
			console.log("===============================================================================\n\n");
		});
	});
	ur.estimateGas(function(error,gasAmount){
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		ur.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function (result) {
			//console.log(result)
			console.log("update registry called");
			console.log("===============================================================================\n\n");
		});
	});
	ut.estimateGas(function(error,gasAmount){
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		ut.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function (result) {
			console.log("update token called");
			console.log("===============================================================================\n\n");
			if(automate){
				newLoanRequest();
			}
		});
	});
}

let newLoanRequest = function () {
	LoanLedger.events.LoanApplicationReceived(function (error,result) {
		console.log("loan request event called");
		console.log("===============================================================================\n\n");
	});
	let nl = LoanLedger.methods.newLoan([10000,30]);
	nl.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		nl.send({
			from:customers[0],
			gas:gasAmount
		}).then(function (result) {
			console.log("loan request created");
			console.log("===============================================================================\n\n");
			if(automate)
				loanApproval();
		});
	});
}

let loanApproval = function () {
	LoanLedger.events.LoanApproved(function (error,result) {
		//console.log(result);
		console.log("loan approval event called");
		console.log("===============================================================================\n\n");
	});
	let la = LoanLedger.methods.loanApproval(customers[0],0,[10000,Date.now(),Date.now()+30*86400*1000,10,10000]);
	la.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		la.send({
			from:user,
			gas:gasAmount
		}).then(function (result) {
			console.log("loan approval called");
			//console.log(result);
			console.log("===============================================================================\n\n");
			if(automate)
				grantLoan();
		});
	});
}

let grantLoan = function () {
	LoanLedger.events.LoanGranted(function (error,result) {
		console.log("loan granted event fired");
		console.log("===============================================================================\n\n");
	});
	let al = Token.methods.acceptLoan(customers[0],10000,0);
	al.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		al.send({
			from:fromAccount,
			gas:gasAmount
		}).then(function (result) {
			console.log("loan grant called");
			console.log("===============================================================================\n\n");
			if(automate)
				claimLoan();
		});
	});
}

let claimLoan = function(){
	LoanLedger.methods.getLoanAddress(customers[0],0).call().then(function (result) {
		let loan = new web3.eth.Contract(loanAccount,result);
		let tt = loan.methods.transferTo(customers[0],10000);
		tt.estimateGas({from:customers[0]},function (error,gasAmount) {
			if(error){
				console.log(error)
				throw "Out of gas";
			}
			tt.send({
				from:customers[0],
				gas:gasAmount
			}).then(function (result) {
				console.log("Loan Claimed by user");
				console.log("===============================================================================\n\n");
				if(automate)
					repayLoan();
			});
		});
	});
}

let repayLoan = function () {
	LoanLedger.events.LoanRepaid(function (error,result) {
		console.log(result);
	});
	let r = Token.methods.repay(10000,0);
	r.estimateGas({from:customers[0]},function (error,gasAmount) {
		if(error){
			console.log(error)
			throw "Out of gas";
		}
		r.send({
			from:customers[0],
			gas:gasAmount
		}).then(function (result) {
			console.log(result);
			console.log("===============================================================================\n\n");
		})
	});
}

try {
	let i = parseInt(args[2]);
	switch (i) {
		case 1:
			registerUser();
			break;
		case 2:
			registerCustomer(0);
			registerCustomer(1);
			break;
		case 3:
			updateAddresses();
			break;
		case 4:
			newLoanRequest();
			break;
		case 5:
			loanApproval();
			break;
		case 6:
			grantLoan();
			break;
		case 7:
			claimLoan();
			break;
		case 8:
			repayLoan()
			break;
		case 10:
			automate = true;
			registerUser();
			break;
		default:
			console.log("no step number provided");
			break;
	}
} catch(e) {
	console.log(e);
}
