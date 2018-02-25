//minedBlocks(lastn, addr)
//checkWork()
//printTransaction(txHash)
//printBlock(block)
//printUncle(block, uncleNumber, uncle)
//getMinedBlocks(miner, startBlockNumber, endBlockNumber)
//checkAllBalances()
//checkTransactionCount(startBlockNumber, endBlockNumber)
//transferEntireBalance(from, to)
//totalBalance()
//***************************************

function minedBlocks(lastn, addr) {
  addrs = [];
  if (!addr) {
    addr =  web3.eth.coinbase
  }
  limit =  web3.eth.blockNumber - lastn
  for (i =  web3.eth.blockNumber; i >= limit; i--) {
    if ( web3.eth.getBlock(i).miner == addr) {
      addrs.push(i)
    }
  }
  return addrs
}

var mining_threads = 1
function checkWork() {
    if ( web3.eth.getBlock("pending").transactions.length > 0) {
        if ( web3.eth.mining) return;
        console.log("== Pending transactions! Mining...");
        miner.start(mining_threads);
    } else {
        miner.stop(0);  // This param means nothing
        console.log("== No transactions! Mining stopped.");
    }
}

function printTransaction(txHash) {
  var tx =  web3.eth.getTransaction(txHash);
  if (tx != null) {
    console.log("  tx hash          : " + tx.hash + "\n"
      + "   nonce           : " + tx.nonce + "\n"
      + "   blockHash       : " + tx.blockHash + "\n"
      + "   blockNumber     : " + tx.blockNumber + "\n"
      + "   transactionIndex: " + tx.transactionIndex + "\n"
      + "   from            : " + tx.from + "\n"
      + "   to              : " + tx.to + "\n"
      + "   value           : " + tx.value + "\n"
      + "   gasPrice        : " + tx.gasPrice + "\n"
      + "   gas             : " + tx.gas + "\n"
      + "   input           : " + tx.input);
  }
}

function printBlock(block) {
  console.log("Block number     : " + block.number + "\n"
    + " hash            : " + block.hash + "\n"
    + " parentHash      : " + block.parentHash + "\n"
    + " nonce           : " + block.nonce + "\n"
    + " sha3Uncles      : " + block.sha3Uncles + "\n"
    + " logsBloom       : " + block.logsBloom + "\n"
    + " transactionsRoot: " + block.transactionsRoot + "\n"
    + " stateRoot       : " + block.stateRoot + "\n"
    + " miner           : " + block.miner + "\n"
    + " difficulty      : " + block.difficulty + "\n"
    + " totalDifficulty : " + block.totalDifficulty + "\n"
    + " extraData       : " + block.extraData + "\n"
    + " size            : " + block.size + "\n"
    + " gasLimit        : " + block.gasLimit + "\n"
    + " gasUsed         : " + block.gasUsed + "\n"
    + " timestamp       : " + block.timestamp + "\n"
    + " transactions    : " + block.transactions + "\n"
    + " uncles          : " + block.uncles);
    if (block.transactions != null) {
      console.log("--- transactions ---");
      block.transactions.forEach( function(e) {
        printTransaction(e);
      })
    }
}

function printUncle(block, uncleNumber, uncle) {
  console.log("Block number     : " + block.number + " , uncle position: " + uncleNumber + "\n"
    + " Uncle number    : " + uncle.number + "\n"
    + " hash            : " + uncle.hash + "\n"
    + " parentHash      : " + uncle.parentHash + "\n"
    + " nonce           : " + uncle.nonce + "\n"
    + " sha3Uncles      : " + uncle.sha3Uncles + "\n"
    + " logsBloom       : " + uncle.logsBloom + "\n"
    + " transactionsRoot: " + uncle.transactionsRoot + "\n"
    + " stateRoot       : " + uncle.stateRoot + "\n"
    + " miner           : " + uncle.miner + "\n"
    + " difficulty      : " + uncle.difficulty + "\n"
    + " totalDifficulty : " + uncle.totalDifficulty + "\n"
    + " extraData       : " + uncle.extraData + "\n"
    + " size            : " + uncle.size + "\n"
    + " gasLimit        : " + uncle.gasLimit + "\n"
    + " gasUsed         : " + uncle.gasUsed + "\n"
    + " timestamp       : " + uncle.timestamp + "\n"
    + " transactions    : " + uncle.transactions + "\n");
}

function printGasLimit(miner,startBlockNumber,endBlockNumber) {
  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 == 0) {
        console.log("Searching block " + i);
      }
      var block =  web3.eth.getBlock(i);
      if (block != null) {
        if (block.miner == miner || miner == "*") {
          console.log("Found block " + block.number + "\n"
      			  + " gasLimit 	   : " + block.gasLimit + "\n"
      		      + " transactions : " + block.transactions + "\n");
      			if (block.transactions != null) {
  				      console.log("--- transactions ---");
  			      block.transactions.forEach( function(e) { printTransaction(e); })
            }//if (block.transactions != null) {
        }//if (block.miner == miner || miner == "*") {
      }//if (block != null) {
  }//for (var i = startBlockNumber; i <= endBlockNumber; i++)
}//End of the function

function getMinedBlocks(miner, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber =  web3.eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 10000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for miner \"" + miner + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber + "\"");

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block =  web3.eth.getBlock(i);
    if (block != null) {
      if (block.miner == miner || miner == "*") {
        console.log("Found block " + block.number);
        printBlock(block);
      }
      if (block.uncles != null) {
        for (var j = 0; j < 2; j++) {
          var uncle =  web3.eth.getUncle(i, j);
          if (uncle != null) {
            if (uncle.miner == miner || miner == "*") {
              console.log("Found uncle " + block.number + " uncle " + j);
              printUncle(block, j, uncle);
            }
          }
        }
      }
    }
  }
}

function checkAllBalances() {
 var i =0;
  web3.eth.accounts.forEach( function(e){
    console.log("   web3.eth.accounts["+i+"]: " +  e + " \tbalance: " +    web3.fromWei( web3.eth.getBalance(e), "ether") + " ether");
  i++;
 })
};

function checkTransactionCount(startBlockNumber, endBlockNumber) {
  console.log("Searching for non-zero transaction counts between blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    var block =  web3.eth.getBlock(i);
    if (block != null) {
      if (block.transactions != null && block.transactions.length != 0) {
        console.log("Block #" + i + " has " + block.transactions.length + " transactions")
      }
    }
  }
}

function transferEntireBalance(from, to) {
    var gas = new BigNumber(21000);
    var price = web3. web3.eth.gasPrice;  // current average price; or set your own
    var balance =  web3.eth.getBalance(from);
    var value = balance.minus(gas.times(price));
    if (value.greaterThan(0)) {
        var txn =  web3.eth.sendTransaction({from: from, to: to, gasPrice: price, gas: gas, value: value});
        console.log("  Transfer", from, "to", to, ":", txn);
        return txn;
    }
    console.log("  Transfer "+ from +" to "+ to +": (No funds available)");
    return null;
}

function totalBalance() {
  var x = 0
   web3.eth.accounts.forEach( function(e) {
    x = x + parseInt(web3.fromWei( web3.eth.getBalance(e)), 10);
  });
  console.log("  total balance: " + x + " ether");
};

function checkTransactionCountByAddress(miner, startBlockNumber, endBlockNumber) {
  console.log("Searching for non-zero transaction counts between blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i < endBlockNumber; i++) {
    var block =  web3.eth.getBlock(i);
    /*if (block != null) {
      if (block.transactions != null && block.transactions.length != 0) {
        console.log("Block #" + i + " has " + block.transactions.length + " transactions")
      }
    }*/
	if (block.miner == miner){
	  if (block.transactions != null && block.transactions.length != 0) {
        console.log("Block #" + i + " has " + block.transactions.length + " transactions")
      }
	}
  }
}
