/*jshint esversion: 6 */
var dao = require("../Dao/applicationDao"),
crypto = require('crypto');
var gkey = "dqw86ibsy8778gBY&8vxa",
http = require('https'),
aws = require('aws-sdk');

const Cache = require("node-cache");
const keyCache = new Cache();
var Key = dao.key;

exports.success = {
  status: 1
};
exports.failure = {
  status: -1
};
exports.unauth = {
  status: -2
};

exports.generateOTP = function() {
  return Math.floor(Math.random() * (99999 - 12321) + 12321);
};
exports.encrypt = function(text, password) {
  if(text&&password){
    var cipher = crypto.createCipher("aes-256-ctr", password.toString());
    var crypted = cipher.update(text.toString(), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
  else{
    return "";
  }
};

exports.decrypt = function(text, password) {
  if(text&&password){
    var decipher = crypto.createDecipher("aes-256-ctr", password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
  else{
    return "";
  }
};

exports.getLkey = function() {
  var s3 = crypto.createHash('sha1');
  return s3.update(gkey).digest("hex").toString();
};

exports.getHash = function(text) {
  var s3 = crypto.createHash('sha1');
  if(text){
    return s3.update(text.toString()).digest("hex").toString();
  }
  else{
    return "";
  }
};

exports.getCertHash = function(test){
  var s3 = crypto.createHash('md5');
  if(text){
    return s3.update(text.toString()).digest("hex").toString();
  }
  else{
    return "";
  }  
}
exports.httpRequest = function (data,options,callback) {
  if(!options.host||!options.port||!options.path||!options.method){
    callback(null);
    return;
  }
  options.rejectUnauthorized = false;
  options.requestCert = true;
  options.agent = false;
  var req = http.request(options);
  req.write(JSON.stringify(data));
  req.on('error',function (err) {
    console.log(err);
    console.log("error sending  http request");
    callback(null);
    return;
  });
  req.end();
  var receivedData = "";
  req.on("response", function(resp) {
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
      receivedData+=chunk;
    });
    resp.on('end', function (chunk) {
      try {
        if(receivedData){
          var rdata = JSON.parse(receivedData);
          callback(rdata);
        }
        else{
          callback(null);
          return;
        }
      } catch(e) {
        callback(null);
        console.log(e);
        return;
      }
    });
    resp.on('error',function (chunk) {
      callback(null);
      console.log(chunk);
      console.log("http response error");
      return;
    });
  });
};

//===============================================KMS Operations=======================================================//

/* desc : used to get the encrypted key for a collection
 * params : collection name
 * returns : encrypted key for the collection 
 * */
exports.getKmsDataKey = function(collectionName,callback){
  if(!collectionName){
    callback(null);
    return;
  }
  else{
    var key = keyCache.get(collectionName);
    if(key===undefined||key===null){
      console.log("getKmsDataKey----Key not found in cache");
      Key.findOne({collectionName:collectionName})
      .exec(function(err,doc){
        if(err){
          console.log("getKmsDataKey ------ Error in finding key in DataBase");
          callback(null);
        }
        else if(!doc){
          console.log("getKmsDataKey ------ Key Not Found in DataBase");
          callback(null);
        }
        else{
          keyCache.set(collectionName,doc);
          console.log(doc.key);
          callback(doc.key);
        }
      });
    }
    else{
      console.log("getKmsDataKey----Key found in Cache");
      console.log(key.key);
      callback(key.key);
    }
  } 
};

exports.decryptKmsDataKey = function(collectionName,callback){
  this.getKmsDataKey(collectionName,function(key){
    if(key===null){
      callback(null);
    }
    else{
      console.log("decrypting");
      aws.config.update({region:'ap-south-1'});
      console.log(aws.config);
      var kms = new aws.KMS();
      kms.decrypt({CiphertextBlob:new Buffer(key, 'base64')}).promise().then(function(data) {
        console.log('Your super secret is: ' + data.Plaintext.toString('base64'));
        callback(data.Plaintext.toString('base64'));
      });
    }
  });
};
//========================================================================================