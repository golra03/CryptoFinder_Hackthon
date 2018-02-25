pragma solidity ^0.4.17;

library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b > 0);
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}

/**
  * @title Pausable
  * @dev Base contract which allows children to implement an emergency stop mechanism.
  */
contract Pausable is Ownable {

  event SetPaused(bool paused);

  // starts unpaused
  bool public paused = false;

  /* @dev modifier to allow actions only when the contract IS paused */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /* @dev modifier to allow actions only when the contract IS NOT paused */
  modifier whenPaused() {
    require(paused);
    _;
  }

  function pause() public onlyOwner whenNotPaused returns (bool) {
    paused = true;
    SetPaused(paused);
    return true;
  }

  function unpause() public onlyOwner whenPaused returns (bool) {
    paused = false;
    SetPaused(paused);
    return true;
  }
}

/**
 * @title Lendable
  * @dev Base contract which allows children to implement an proxy transfer mechanism
  */
contract Lendable is Ownable {
  address public user;
  function setUser(address _user) public onlyOwner returns(bool) {
    user = _user;
    return true;
  }

  modifier onlyUser() {
    require(msg.sender == user);
    _;
  }
}

/**
 * @title UserCustomerRegistry
 * @dev The UserCustomerRegistry contract is pausable and facilitates basic user & customer onboarding process
 * functions, this simplifies the implementation of "user permissions".
 */
contract UserCustomerRegistry is Pausable{

  struct User {
    bytes32 identifier;
    uint8 role;
    bool paused;
  }

  struct Customer{
    bytes32 identifier;
    bytes32 idProof;
    bytes32 salarySlip;
    bool paused;
  }

  mapping (address => User)     userMapping;
  mapping (address => Customer) customerMapping;

  event UserRegistered(address user, bytes32 user_identifier);
  event CustomerRegistered( address customer,bytes32 customer_identifier);

  function UserCustomerRegistry ()public{
    userMapping[msg.sender].paused = false;
    userMapping[msg.sender].identifier = 0x0234;
    userMapping[msg.sender].role = 5;
  }


  function isUser(address _user) public constant returns(bool res) {
    User memory u = userMapping[_user];
    bytes32 temp;
    if(u.identifier != temp)
        return true;
    return false;
  }

  function isCustomer (address _customer) public constant returns(bool res) {
    Customer memory c = customerMapping[_customer];
    bytes32 temp;
    if(c.identifier != temp)
        return true;
    return false;
  }

  function registerUser(address _user, bytes32 _user_identifier) onlyOwner public returns (bool){
    require(!isUser(_user));
    userMapping[_user].paused = false;
    userMapping[_user].identifier = _user_identifier;
    userMapping[_user].role = 1;
    UserRegistered(_user,_user_identifier);
    return true;
  }

  function registerCustomer(address _customer,bytes32[3] _details)public onlyOwner returns(bool res) {
    require(!isCustomer(_customer));
    customerMapping[_customer].identifier = _details[0];
    customerMapping[_customer].idProof    = _details[1];
    customerMapping[_customer].salarySlip = _details[2];
    customerMapping[_customer].paused     = false;
    return true;
  }

  function getUser(address _user) public constant returns (bytes32){
    User memory u = userMapping[_user];
    return u.identifier;
  }

  function getCustomer (address _customer)public constant returns(bytes32) {
    Customer memory c = customerMapping[_customer];
    return c.identifier;
  }

  function pauseUser(address _address) public onlyOwner returns(bool){
    require(isUser(_address));
    userMapping[_address].paused = true;
    return true;
  }

  function activateUser(address _address) public onlyOwner returns(bool){
    require(isUser(_address));
    userMapping[_address].paused = false;
    return true;
  }

  function pauseCustomer(address _address) public onlyOwner returns(bool){
    require(isCustomer(_address));
    customerMapping[_address].paused = true;
    return true;
  }

  function activateCustomer(address _address) public onlyOwner returns(bool){
    require(isCustomer(_address));
    customerMapping[_address].paused = false;
    return true;
  }
}

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function getTotalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
  using SafeMath for uint256;
  mapping(address => uint256) balances;
  uint256 totalSupply = 100000000000;

  function BasicToken ()public{
    balances[msg.sender] = totalSupply;
  }
  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    // SafeMath.sub will fail if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
}

/**
 * @title Burnable Token
 * @dev Token that can be irreversibly burned (destroyed).
 */
contract BurnableToken is BasicToken {

  event Burn(address indexed burner, uint256 value);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) public {
    require(_value <= balances[msg.sender]);
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure

    address burner = msg.sender;
    balances[burner] = balances[burner].sub(_value);
    totalSupply = totalSupply.sub(_value);
    Burn(burner, _value);
    Transfer(burner, address(0), _value);
  }
}

/**
 * @title BAETHToken
 * @dev The BAETHToken is ownable, burnable main crypto token of BAETHe system.
 * and maintains the complete ledger as well
 */
contract BAETHToken is Ownable, BurnableToken{

  using SafeMath for uint256;
  string public name = "BAETH Token";          //token name
  string public symbol = "BTH";                //simple identifier
  uint8 public decimals = 15;                  //How many decimals to show.

  address public ledgerAddress;
  /*   mapping (address => mapping (address => uint256)) allowed;
   */

  function name() public view returns (string) { return name; }
  function symbol() public view returns (string) { return symbol; }
  function decimals() public view returns (uint8) { return decimals; }
  function getTotalSupply() public view returns (uint256) { return totalSupply; }

  function isContract(address _addr) private view returns (bool is_contract) {
    uint length;
    assembly {
      length := extcodesize(_addr)
    }
    return (length>0);
  }

  function setLedger (address _ledger)public onlyOwner returns(bool res) {
    ledgerAddress = _ledger;
    return true;
  }


  function repay(uint256 _value,uint256 loanId)public returns(bool res) {
    require(_value <= balances[msg.sender]);
    LoanLedger l = LoanLedger(ledgerAddress);
    address _to  = l.getLoanAddress(msg.sender ,loanId);
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    l.repayLoan(msg.sender,balances[_to],loanId);
    return true;
  }

  function acceptLoan (address _customer,uint256 _value,uint256 _loanId)public onlyOwner returns(bool res) {
     LoanLedger l = LoanLedger(ledgerAddress);
     address _to  = l.getLoanAddress(_customer,_loanId);
     balances[msg.sender] = balances[msg.sender].sub(_value);
     balances[_to] = balances[_to].add(_value);
     l.grantLoan(_customer,balances[_to],_loanId);
     Transfer(msg.sender, _to, _value);
     return true;
  }
}

/**
 * The LoanAccount contract temporarily keeps balance in an account so as to track easily
 */
contract LoanAccount is Lendable,Pausable {
    address token;
    function LoanAccount(address _token) public{
      token = _token;
    }
    function transferTo(address _to,uint256 _value)public onlyUser returns(bool res) {
        BasicToken b = BasicToken(token);
        return b.transfer(_to,_value);
    }
}


/**
 * @title LoanLedger
 * @dev The LoanLedger is ownable and pausable. It maintains the complete lifecycle of the every loan taken BAETH system
 * and maintains the complete ledger as well
 */
contract LoanLedger is Ownable, Pausable{

  using SafeMath for uint256;
  using SafeMath for uint64;

  /* Different states of Loan Lifecycle */
  enum LoanState {
    LoanDemanded,       //Initial state
    WaitingForApproval, //Waiting for Approval by BAETH
    LoanRejected,       //When loan app is rejected
    LoanAccepted,       //When loan has accepted the application
    LoanGranted,        //When loan is granted and BAETH tokens are to be transferred to user
    WaitingForPayback,  //When loan is granted by the BAETH and User received it
    LoanRollback,       //When loan is rolledback by the BAETH due to operations or financial risks aspects
    Default,            //When loan defaulted by User
    PenaltyIncurred,    //When Penalty is incurred due to non-payment
    LoanRepaid,         //When loan paid in full by User
    Finished,            //When loan paid in full by User and internal state is cleaned
    Cancelled
  }
  address registryAddress;
  address tokenAddress;

  struct Loan{
    uint64 loanAmount;
    uint64 duration;
    uint64 timeStampGranted;
    uint64 timeStampDefaultTime;
    uint8  interestRate;
    address account;
    LoanState currentState;
  }
  struct LoansPerAddress{
    uint256 totalCount;
    mapping (uint256 => Loan) loans;
    mapping (uint256 => bool) status;
  }

  mapping (address => LoansPerAddress) allLoans;

  function LoanLedger () public{
    /* registryAddress = new UserCustomerRegistry();
    tokenAddress    = new BAETHToken(); */
  }


  modifier ifValid(){
    require(registryAddress != 0x0);
    UserCustomerRegistry r = UserCustomerRegistry(registryAddress);
    require(r.isCustomer(msg.sender));
    _;
  }

  modifier ifUser() {
    require(registryAddress != 0x0);
    UserCustomerRegistry r = UserCustomerRegistry(registryAddress);
    require(r.isUser(msg.sender));
    _;
  }

  event LoanApplicationReceived (address indexed _customer,uint64 loanDemanded,uint256 loanId);
  event LoanApproved (address indexed  _customer, address account,uint64 loanEligible,uint64 loanApproved,uint64 requested,uint256 loanId);
  event LoanRejected (address indexed  _customer,uint256 loanId, uint256 LoanAmount);
  event LoanGranted (address indexed  _customer,uint256 LoanAmount,uint256 totalDue,uint256 loanId);
  event LoanDefaulted (address indexed  _customer,uint256 amountOutstanding);
  event LoanPenaltyIncurred (address indexed  _customer,uint256 penalty);
  event LoanWaiverOffered (address indexed  _customer,uint256 waiver);
  event LoanPartPaymentDone (address indexed  _customer,uint256 amountOutstanding,uint256 loanId);
  event LoanRepaid (address indexed  _customer,uint256 amountPaid,uint256 loanId);
  event LoanClosed (address indexed  _customer,uint256 loanId);

  function setRegistryAddress (address _registryAddress)public onlyOwner returns(bool res) {
    registryAddress = _registryAddress;
    return true;
  }

  function getRegistryAddress ()public view returns(address) {
    return registryAddress;
  }

  function setTokenAddress (address _tokenAddress)public onlyOwner returns(bool res) {
    tokenAddress = _tokenAddress;
    return true;
  }

  function getTokenAddress ()public view returns(address) {
    return tokenAddress;
  }

  function getLoanAddress (address _customer,uint256 loanId)public view returns(address res) {
    return allLoans[_customer].loans[loanId].account;
  }


  function newLoan (uint64[2] _specifications)public returns(bool res) {
    uint256 totalLoans = allLoans[msg.sender].totalCount;
    allLoans[msg.sender].loans[totalLoans].loanAmount      = _specifications[0];
    allLoans[msg.sender].loans[totalLoans].duration        = _specifications[1];
    allLoans[msg.sender].loans[totalLoans].currentState    = LoanState.WaitingForApproval;
    allLoans[msg.sender].totalCount                        = totalLoans.add(1);
    LoanApplicationReceived(msg.sender,_specifications[0],totalLoans);
    return true;
  }

  function loanApproval (address _customer,uint256 loanId,uint64[5] _details)public ifUser returns(bool res) {
    Loan memory l = allLoans[_customer].loans[loanId];
    require(!allLoans[_customer].status[loanId]);
    require(l.currentState == LoanState.WaitingForApproval);
    uint64 loanDemanded = l.loanAmount;
    allLoans[_customer].status[loanId]                       = true;
    allLoans[_customer].loans[loanId].loanAmount             = _details[0];
    allLoans[_customer].loans[loanId].timeStampGranted       = _details[1];
    allLoans[_customer].loans[loanId].timeStampDefaultTime   = _details[2];
    allLoans[_customer].loans[loanId].interestRate           = 10;
    allLoans[_customer].loans[loanId].currentState           = LoanState.LoanAccepted;
    LoanAccount a                                            = new LoanAccount(tokenAddress);
    a.setUser(_customer);
    allLoans[_customer].loans[loanId].account                = address(a);
    LoanApproved(_customer,address(a),_details[4],_details[0],loanDemanded,loanId);
    return true;
  }

  function grantLoan (address _address,uint256 balance,uint256 loanId)public returns(bool res) {
    require(msg.sender == tokenAddress);
    Loan memory l = allLoans[_address].loans[loanId];
    require(l.currentState == LoanState.LoanAccepted);
    uint256 interest = l.loanAmount.div(l.interestRate);
    allLoans[_address].loans[loanId].loanAmount   = (uint64)(l.loanAmount + interest);
    allLoans[_address].loans[loanId].currentState = LoanState.LoanGranted;
    uint256 total = interest + balance;
    LoanGranted(_address,balance,total,loanId);
    return true;
  }


  function repayLoan (address _address,uint256 balance,uint256 loanId)public returns(bool res) {
    require(msg.sender == tokenAddress);
    require(allLoans[_address].status[loanId]);
    Loan memory l = allLoans[_address].loans[loanId];
    require(l.currentState == LoanState.LoanGranted);
    if(balance > l.loanAmount)
      balance = l.loanAmount;
    uint256 newAmount  = l.loanAmount.sub(balance);
    if(newAmount == 0){
      allLoans[_address].loans[loanId].loanAmount   = 0;
      allLoans[_address].loans[loanId].currentState = LoanState.LoanRepaid;
      LoanRepaid (_address,l.loanAmount,loanId);
    }
    else{
      allLoans[_address].loans[loanId].loanAmount = uint64(newAmount);
      LoanPartPaymentDone(_address,newAmount,loanId);
    }
    return true;
  }

  function LoanOutStanding (uint256 loanId)public view returns(uint64 res) {
    Loan memory l = allLoans[msg.sender].loans[loanId];
    return l.loanAmount;
  }

  function rejectLoan (address _address,uint256 loanId)public ifUser returns(bool res) {
    allLoans[_address].loans[loanId].currentState = LoanState.LoanRejected;
    LoanRejected (_address,loanId,allLoans[_address].loans[loanId].loanAmount);
    return true;
  }
}
