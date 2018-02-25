var Web3 = require('web3');
const fs = require("fs");
const solc = require('solc');

var web3,
    Accountaddress,
    fileFlag = false,
    host = "",
    tempFile = "",
    address = "",
    file = "../contract/contracts.sol";
    contractName = "";

var args = process.argv;
var abiDir = "../compiled";
var configFile = "../config.json";

if (!fs.existsSync(abiDir)){
    fs.mkdirSync(abiDir);
}

// get options from console
if(args.length > 2){
  for(var i=2;i<args.length;i++){
    var temp = args[i].split("=");
    if(temp.length != 2){
      console.log("incorrect format");
    }else{
      switch (temp[0]) {
        case 'host':
          console.log("custom host provided ... ");
          web3 = new Web3(temp[1]);
          break;
        case 'file':
          if(temp[1]){
            console.log('read from abi file');
            tempFile = temp[1];
            fileFlag = true;
          }else{
            fileFlag = false;
          }
          break;
        case 'contract':
          console.log('contract Name specified .. ');
          contractName = temp[1];
          break;
        default:
          console.log("usage: node <jsfile> host=? contract=? file=filePath");
          break;
      }
    }
  }
}
if(!web3){
  web3 = new Web3("http://localhost:8545");
  Accountaddress = web3.eth.accounts[0];
  web3.eth.defaultAccount = Accountaddress;
}
if(fileFlag){
  file = "../compiled/"+contractName+".json";
  if(!contractName)
    throw "No Contract Name Defined";
}
// read the file specified
fs.readFile(file,function (err,result) {
  var abi,bytecode;

  if(!fileFlag){
    // compile the file if its not being read into the result variable
    console.log("compiling...");
    var source = result.toString();
    var output = solc.compile(source, 1);
    try {
      var keys = Object.keys(output.contracts);
      for (var i = keys.length - 1; i >= 0; i--) {
        var temp = {interface:output.contracts[keys[i]].interface,bytecode:output.contracts[keys[i]].bytecode};
        fs.writeFile(abiDir+"/"+keys[i]+'.json',JSON.stringify(temp),'utf8',()=>{
          console.log('.');
        });
      }
      abi = JSON.parse(output.contracts[contractName||':Shipment'].interface);
      bytecode = '0x'+output.contracts[contractName||':Shipment'].bytecode;
    } catch(e) {
      console.log(output);
      throw e;
    }
  }else{
    var compiled = JSON.parse(result);
    abi = JSON.parse(compiled.interface);
    bytecode = '0x'+compiled.bytecode;
  }
  var tempContract = new web3.eth.Contract(abi);
  tempContract.options.from = "0x0e7f8512dbf4640bfba065675ec30fd7889fc30d";
  tempContract.options.gas  = 4476786;
  console.log("deploying..");
  tempContract.deploy({
    data:bytecode
  })
  .send({
    from:"0x0e7f8512dbf4640bfba065675ec30fd7889fc30d",
    gas:4476786
  },function(error, transactionHash){
    console.log("transactionHash :"+transactionHash);
  })
  .on('error', function(error){
      console.log(error);
   })
  .on('receipt', function(receipt){
    var tempConf = {};
    console.log(receipt);
    fs.readFile(configFile,function (err,result) {
      if(!err){
        tempConf = JSON.parse(result);
        tempConf[contractName.split(":")[1]||"Shipment"] = receipt.contractAddress;
        fs.writeFile(configFile,JSON.stringify(tempConf),'utf8',()=>{
          console.log("wrote to config");
        });
      }
    });
  });
});
