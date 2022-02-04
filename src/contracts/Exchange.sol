// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.9.0;

import './Token.sol';
import '../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol';

//Todo: 
// [X] Set the fee account
// [] Deposit Ether
// [] Withdraw Ether
// [] Deposit tokens
// [] Withdraw tokens
// [] Check balance
// [] Make order
// [] Cancel order
// [] Fill order
// [] Charge fees

contract Exchange {

    using SafeMath for uint;

    address public feeAccount; //the account that receives exchange fees
    uint256 public feePercent; // the fee percentage
    address constant ETHER = address(0); // store Ether in tokens mapping with blank address
    mapping(address => mapping(address => uint256)) public tokens;//tokens[tokenaddress][useraddress]
    

    //Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    

    constructor (address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    fallback() external {
        revert();
    }

    function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }


    function withdrawEther(uint _amount) public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    }


    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }



    
}


