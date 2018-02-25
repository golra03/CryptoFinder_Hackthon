var config = require("../Config/Config"),
  mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Customer = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  address:  {
    type: String,
    default: []
  }, // Ethereum address.. 
  country : {
    type: String,
    default: ''
  },
  region : {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },// path of proof
  isKycVerified: {
    type: Boolean, 
    default: false
  },
  createDate : {
    type : Date,
    default : Date.now
  }
});

var CustomerLogin = new Schema({
  email: String,
  token: String,
  customerId: String,
  loginDate: Date,
  tokenExpiry: Date,
  logoutDate: Date
});

var loanSchema = new Schema({
// signup
    customerAddress: String, //loanId auto created
  loanAmount: String,
  customerName: String,
    loanDuration: String,
  loanStatus: {type: Number, default:0},
  approved: {type: Boolean, default: false},
  granted: {type: Boolean, default: false},
  createDate : {
    type : Date,
    default : Date.now
  }
});


exports.customer = mongoose.model("customer", Customer);
exports.customerLogin = mongoose.model("customerLogin", CustomerLogin);
exports.loanSchema = mongoose.model("loanSchema", loanSchema);