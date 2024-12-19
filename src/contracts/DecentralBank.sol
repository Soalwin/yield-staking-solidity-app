pragma solidity '0.5.16';

import './RWD.sol';
import './Tether.sol';


contract DecentralBank {
    string public name = 'Decentral Bank';
address public owner;
Tether public tether;
RWD public rwd;

address[] public stakers;

mapping(address => uint) public stakingBalances;
mapping(address => bool) public hasStaked;
mapping(address => bool) public isStaking;

constructor (RWD _rwd, Tether _tether)public{
    rwd=_rwd;
    tether= _tether;
    owner = msg.sender;
}

function depositTokens(uint _amount) public {

    require(_amount > 0);

    tether.transferFrom(msg.sender, address(this), _amount);

    stakingBalances[msg.sender] = stakingBalances[msg.sender] + _amount;

    if(!hasStaked[msg.sender]) {
        stakers.push(msg.sender);
    }

    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
}

//unstake tokens
function unstakeTokens()public {
    uint balance = stakingBalances[msg.sender];

    require(balance > 0);
    tether.transfer(msg.sender, balance);
    stakingBalances[msg.sender] = 0;
    isStaking[msg.sender] = false;
}

//issue rewards

function issueTokens() public {
    require(msg.sender == owner, 'caller must be the owner');

    for (uint i=0; i < stakers.length; i++){
       address recipient = stakers[i];
       uint balance = stakingBalances[recipient] / 9;
       if(balance >0){
       rwd.transfer(recipient, balance);
       }
    }
}

}