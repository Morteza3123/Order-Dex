// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <=0.9.0;

//import library
import '../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol';

contract Token is ERC20, ERC20Burnable, Ownable, ERC20FlashMint {

    constructor() ERC20('oxin', 'OXN') {
        _mint(msg.sender, 1000000 * 10 **decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner{
        _mint(to, amount);
    }
}