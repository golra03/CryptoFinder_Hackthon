var Web3      = require('web3');
const fs      = require("fs");
const leftPad = require('left-pad');

var LoanLedger    = JSON.parse(require("../compiled/:LoanLedger")["interface"]),
BAETHToken        = JSON.parse(require("../compiled/:BAETHToken")["interface"]),
WETHToken         = JSON.parse(require("../compiled/:WETHToken")["interface"]),
Registry          = JSON.parse(require("../compiled/:UserCustomerRegistry")["interface"]),
config            = require("../config"),
input             = require("./test");
var configPath    = "../config.json";

var args = process.argv;

var web3,
    host = "",
    address = "",
    flag = 0,
    step = '0';

var baethAddr = config.BAETHToken, //"0x97bf50ad2c52a16f77b8ef5e2b8dc2944edcc390",
registryAddr  = config.UserCustomerRegistry,
loanLedgerAddr= config.LoanLedger;
user1         = config.User1;
user2         = config.User2;

if(args.length > 2){
  for(var i=2;i<args.length;i++){
    var temp = args[i].split("=");
    if(temp.length != 2){
      console.log("incorrect format");
    }else{
      switch (temp[0]) {
        case 'host':
          console.log("custom host provided ... ");
          web3 = new Web3(new Web3.providers.HttpProvider(temp[1]));
          web3.eth.defaultAccount = web3.eth.accounts[0];
          break;
        case 'step':
          step = temp[1];
          break;
        default:
          console.log("usage: node <jsfile> host=?");
          break;
      }
    }
  }
}
if(!web3){
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  web3.eth.defaultAccount = web3.eth.accounts[0];
}

var fromAddress         = web3.eth.accounts[0];
var toAddress           = user1;
var registryContract    = web3.eth.contract(Registry).at(registryAddr);
var BETHContract        = web3.eth.contract(BAETHToken).at(baethAddr);
var loanLedger          = web3.eth.contract(LoanLedger).at(loanLedgerAddr);
var index               = parseInt(config.index);
var userAddress2        = user2;

var printVal = function (){
  console.log('print baethAddr value - ', baethAddr);
  console.log('print registryAddr value - ', registryAddr);
  console.log('print loanLedgerAddr value - ', loanLedgerAddr);
  console.log('print user1 value - ', user1);
  console.log('print user2 value - ', user2);
}

printVal();

setUpRegistryAndToken();

registerCustomerWithRegistryUser1();
registerCustomerWithRegistryUser2();

async function setUpRegistryAndToken() {
  console.log('calling setUpRegistryAndToken');
  const flag1 = await loanLedger.setRegistryAddress(registryAddr);
  console.log("setRegistryAddress :", flag1);
  const flag2 = await loanLedger.setTokenAddress(baethAddr);
  console.log("setTokenAddress :", flag2);
}

async function registerCustomerWithRegistryUser1() {
  console.log('calling registerCustomerWithRegistryUser1');

  //its my account on Chrome browser with PR Visa Grant Number & Medicare Number
  var data = ['0059521320243', '2789595251', 'Jan2018'];
  const flag = await registryContract.registerCustomer(user1,data);
  console.log("registerCustomer1 :", user1, "with transacton hash", flag);
}

async function registerCustomerWithRegistryUser2() {
  console.log('calling registerCustomerWithRegistryUser2');

  //its my account on Chrome browser with PR Visa Grant Number & Medicare Number
  var data = ['1059521320243', '2789595253', 'Feb2018'];
  const flag = await registryContract.registerCustomer(user2,data);
  console.log("registerCustomer2 :", user2, "with transacton hash", flag);
}

testApplyLoan();

async function testApplyLoan() {
  console.log('calling testApplyLoan');
  var event = await loanLedger.LoanApplicationReceived();//{_from: owner}, {fromBlock: 0, toBlock: 'latest'});
  event.watch(function(err,result){
    if(err){
      console.log("Error: triggering event failed");
      console.log(err);
    }else{
      console.log("-------------------------stack trace--------------------------");
      console.log(result);
      console.log("----------------------Loan Application created---------------------------");
      fs.readFile(configPath,function (err,rf) {
        if(!err){
          tempConf = JSON.parse(rf);
          tempConf["Customer"]   = result.args._customer;
          tempConf["LoanAmount"] = ""+result.args.loanDemanded;
          tempConf["LoanID"]     = ""+result.args.loanId;
          fs.writeFile(configPath,JSON.stringify(tempConf),'utf8',()=>{
            console.log("wrote to config file  ");
          });
        }
      });
    }
    return;
  });

  var gasEstimate = await loanLedger.newLoan.estimateGas(
    [10000,15],
    {
      from:fromAddress,
      gas:4476786,
      value:web3.toWei('0.0002','ether')
    }
  );

  console.log("Transaction gas estimate :-"+gasEstimate);
  var transactionHash = await loanLedger.newLoan(
    [10000,15],
    {
      from:fromAddress,
      gas:4476786,
      value:web3.toWei('0.0002','ether')
    });
    //console.log("new Loan Application submitted");
    console.log("new Loan Application submitted with Transaction Hash:        " + transactionHash);
}

var approve = function (token,stage,count) {
  var contract = {};
  if(stage){
    web3.eth.defaultAccount = web3.eth.accounts[0];
    //console.log("account 1 selected");
  }else{
    web3.eth.defaultAccount = web3.eth.accounts[0];
    //console.log("account 2 selected");
  }
  if(!token) {
    //console.log("baeth selected");
    contract = BETHContract;
  }else{
    //console.log("WETH selected");
    contract = wethContract;
  }
  contract.Approval().watch(function (err,result) {
    console.log("-------------------Approval Confirmed-----------------------");
    console.log(err||"executed .. ");
    console.log(result||"new Error");
  });
  var gas = contract.approve.estimateGas(proposalAddr,100);
  console.log(gas);
  contract.approve(proposalAddr,100,function () {
    console.log("approve called .. ");
    if(count<2){
      console.log("------------------Approvals for tokens called-------------------");
      approve(!token,!stage,count+1);
    }
  });
}

var testApplyLoan = function(){
  console.log("..........................Creating Proposal............................");
  var event = loanLedger.LoanApplicationReceived();
  event.watch(function(err,result){
    if(err){
      console.log("Error: triggering event failed");
      console.log(err);
    }else{
      console.log("-------------------------stack trace--------------------------");
      console.log(result);
      console.log("----------------------proposal created---------------------------");
      fs.readFile(configPath,function (err,rf) {
        if(!err){
          tempConf = JSON.parse(rf);
          tempConf["Proposal"] = result.args.proxyAccountAddress;
          tempConf["index"]    = ""+result.args.proposalAddress;
          fs.writeFile(configPath,JSON.stringify(tempConf),'utf8',()=>{
            console.log("wrote to config file  ");
          });
        }
      });
    }
    return;
  });
  var gasEstimate = loanLedger.createNewProposalRequest.estimateGas(
    [weth,baethAddr],
    "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel",
    [100,50,40,Date.now()+864000000,Date.now()],
    true,
    {
      from:fromAddress,
      gas:4476786,
      value:web3.toWei('0.0002','ether')
    }
  );
  console.log("Transaction gas estimate :-"+gasEstimate);
  loanLedger.createNewProposalRequest(
    [weth,baethAddr],
    "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel",
    [100,50,40,Date.now()+864000000,Date.now()],
    true,
    {
      from:fromAddress,
      gas:4476786,
      value:web3.toWei('0.0002','ether')
    },
    function (err,result) {
      if(err){
        console.log(err);
        console.log("Error: proposal creation failed");
      }else{
        //console.log("new proposal created");
        console.log("Transaction Hash:        " + result);
      }
  });
};

var acceptProposal = function (val) {
  console.log(".......................Accepting Proposal...........................");
  loanLedger.AcceptedProposal().watch(function(err,result){
    //console.log(err||"executed");
    console.log("-------------------------stack trace--------------------------");
    console.log(result||"Error acceptProposal");
    console.log("----------------------proposal accepted---------------------------");
    return;
  });
  var gas = loanLedger.acceptProposal.estimateGas(
    Date.now(),
    Date.now()+864000000,
    index);
  console.log(gas);
  loanLedger.acceptProposal(Date.now(),Date.now()+864000000,index,
    {
      from:toAddress,
      gas:4476786
    },function (err,result) {
      console.log("Transaction Hash:        "+result);
  });
};

var settleContract = function () {
  console.log(".....................Settling proposal........................");
  loanLedger.SettledContract().watch(function(err,result){
    //console.log(err||"executed");
    console.log("-------------------------stack trace--------------------------");
    console.log(result||"Error settleContract");
    console.log("----------------------proposal settled---------------------------");
  });
  var gas = loanLedger.settleContract.estimateGas(
    Date.now(),
    index);
  console.log(gas);
  loanLedger.settleContract(Date.now(),index,
    {
      from:toAddress,
      gas:4476786
    },function (err,result) {
      console.log("Transaction Hash:      "+result);
  });
};

var defaultSettlement = function () {
  console.log("defaultSettlement .. ");
  loanLedger.DefaultSettlement().watch(function(err,result){
    console.log(err||"executed");
    console.log(result||"Error defaultSettlement");
  });
  var gas = loanLedger.defaultSettlement.estimateGas(
    Date.now()+865000000,
    index,
    {
      from:fromAddress,
      value:web3.toWei('0.1','ether')
    });
  console.log(gas);
  loanLedger.defaultSettlement(Date.now(),index,{
      from:fromAddress,
      value:web3.toWei('0.01','ether')
  },function () {
    console.log("settle contract called");
  });
};

var testTransfer = function () {
  var gas = wethContract.transferFrom.estimateGas("0x21217499f28c89530ada8af4510284bf4b424df8",2000);
  console.log("gas estimate -- " + gas);
  var temp = wethContract.transfer("0x21217499f28c89530ada8af4510284bf4b424df8",2000,function (err,result) {
      console.log(err||"executed ..");
      console.log(result||"new Error");
    });
  console.log(temp);
};

var checkBalance = function () {
  console.log("-----------------checking balances of accounts ------------------------");
  console.log("balances of account 0")
  console.log("token 1:    "+BETHContract.balanceOf(web3.eth.accounts[0]));
  console.log("token 2:    "+wethContract.balanceOf(web3.eth.accounts[0]));
  console.log("balance of account 1");
  console.log("token 1:    "+BETHContract.balanceOf(web3.eth.accounts[1]));
  console.log("token 2:    "+wethContract.balanceOf(web3.eth.accounts[1]));
  /*console.log("allowances");
  console.log("token 1, account 1 :"+wethContract.allowance(web3.eth.accounts[0],proposalAddr));
  console.log("token 2, account 2 :"+BETHContract.allowance(web3.eth.accounts[1],proposalAddr));*/
  console.log("-----------proposal balance---------------");
  console.log("token 1:    "+BETHContract.balanceOf(proposalAddr));
  console.log("token 2:    "+wethContract.balanceOf(proposalAddr));
  console.log("-----------proposal details---------------");
  var proposal = loanLedger.getProposal(index);
  console.log("proposer address      :    "+proposal[0]);
  console.log("lend token address    :    "+proposal[1]);
  console.log("receive token address :    "+proposal[2]);
  var acceptor = loanLedger.getAcceptor(index);
  console.log("acceptor address      :    "+acceptor[0]);
  console.log("escrow address        :    "+acceptor[1]);
  console.log("-----------------------------------------------------------------------");
};

var testTransferFrom = function(token){
  var tempAddr = "0x568bb4ccd3293287a3479a631a74a7e4ddef2659";
  var temp = web3.eth.contract(JSON.parse(Temp.interface)).at(tempAddr);
  var gas = temp.transferTest.estimateGas(token,fromAddress,toAddress);
  console.log(gas);
  temp.transferTest(token,fromAddress,toAddress,function () {
    console.log("called transfer from");
  })
};

function keccak256(...args) {
  args = args.map(arg => {
    if (typeof arg === 'string') {
      if (arg.substring(0, 2) === '0x') {
          return arg.slice(2)
      } else {
          return web3.toHex(arg).slice(2)
      }
    }
    if (typeof arg === 'number') {
      return leftPad((arg).toString(16), 64, 0);
    } else {
      return ''
    }
  });
  args = args.join('');
  return web3.sha3(args, { encoding: 'hex' })
}

function getSignature(sign){
  let r = sign.slice(0, 66);
  let s = '0x' + sign.slice(66, 130)
  let v = web3.toDecimal("0x"+sign.slice(130, 132));
  return { r:r,s:s,v:v};
}

var offchainProposal = function(token){
  console.log("offlineProposal .. ");
  loanLedger.OffchainEvent().watch(function(err,result){
      console.log(err||"executed");
      console.log(result||"Error offchainProposal");
      fs.readFile(configPath,function (err,rf) {
        if(!err){
          tempConf = JSON.parse(rf);
          tempConf["Proposal"] = result.args.proxy;
          fs.writeFile(configPath,JSON.stringify(tempConf),'utf8',()=>{
            console.log("wrote to config");
          });
        }
      });
  });
  wethContract.approve(loanLedger,100,{ from:fromAddress},function () {
    console.log("approve erxc .. ");
    BETHContract.approve(loanLedger,100,{ from:toAddress},function () {
      console.log("approve weth .. ");
      var hash = keccak256(
        fromAddress,
        baethAddr,
        weth,
        input.url,
        input.sellTokenAmount,
        input.buyTokenAmount,
        input.returnAmount
      );
      console.log(hash);
      var signature = web3.eth.sign(fromAddress,hash);
      signature = getSignature(signature);
      console.log(signature);
      var gas = loanLedger.offchainProposal.estimateGas(
        [fromAddress,baethAddr,weth],
        input.url,
        [input.sellTokenAmount,input.buyTokenAmount,input.returnAmount,Date.now(),Date.now()+86400*input.duration*1000],
        signature.v,
        [signature.r,signature.s]
      );
      console.log(gas);
      loanLedger.offchainProposal(
        [fromAddress,baethAddr,weth],
        input.url,
        [input.sellTokenAmount,input.buyTokenAmount,input.returnAmount,Date.now(),Date.now()+86400*input.duration*1000],
        signature.v,
        [signature.r,signature.s],
        {
          from:toAddress,
          gas:4476786
        },
        function () {
        console.log("offline create called");
      });
    });
  });
};

var register = function(val){
  var registryAddress = loanLedger.getRegistry();
  var TokenRegistry = web3.eth.contract(Registry).at(registryAddress);
  if(val){
    TokenRegistry.registerToken(baethAddr,"baeth");
    TokenRegistry.registerToken(weth,"weth");
  }else{
    console.log(TokenRegistry.checkRegistry(baethAddr));
    console.log(TokenRegistry.checkRegistry(weth));
  }
}

switch (step) {
  case '00':
    register(true);
    break;
  case '01':
    register(false);
    break;
  case '1':
    testApplyLoan();
    break;
  case '2':
    approve(true,true,1);
    break;
  case '3':
    web3.eth.defaultAccount = web3.eth.accounts[1];
    acceptProposal(0);
    break;
  case '4':
    approve(true,false,1);
    break;
  case '5':
    web3.eth.defaultAccount = web3.eth.accounts[1];
    settleContract();
    break;
  case '6':
    defaultSettlement();
    break;
  case '7':
    offchainProposal();
    break;
  case 'a':
    testTransfer();
    break;
  case 'b':
    checkBalance();
    break;
  case 'c':
    testTransferFrom(weth);
    break;
  case 'd':
    flag = 2;
    approve("0x568bb4ccd3293287a3479a631a74a7e4ddef2659");
    break;
  default:
    console.log("invalid option");
    break;
}
