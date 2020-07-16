//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract MathOperations {
    
    uint256 private value;
    address public owner;
    
    event returnValue(uint256 val);
    
    constructor(uint256 input) public{
        value = input;
        owner = msg.sender;
    }
    
    function add(uint256 input) public {
        value = value + input;
        emit returnValue(value);
    }
    
    function subtract(uint256 input) public {
        require(value > input, "Answer cannot be negative");
        value = value - input;
        emit returnValue(value);
    }
    
    function getVal() public view returns (uint256) {
        return value;
    }
    
    function setVal(uint256 newVal) public {
        value = newVal;
    }
    
    function changeOwner(address newOwner) public {
        require(msg.sender == owner);
        changeOwnership(newOwner);
    }
    
    function changeOwnership(address newOwner) private{
        owner = newOwner;
    }
}