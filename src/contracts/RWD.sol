pragma solidity '0.5.16';

contract RWD {
string public name = 'Reward Token';
string public symbol = 'RWD';
uint256 public totalSupply = 100000000000000000000000; // 1 million tokens
uint8 public decimals = 18;

event Transfer(
address indexed_from,
 address indexed_to,
  uint _value
); 
event Approval(
 address indexed_owner,
 address indexed_spender,
  uint _value
);

mapping (address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;

constructor() public {
balanceOf [msg.sender] = totalSupply;
}

function transfer(address _to, uint _value) public returns (bool success)
 {
    require(balanceOf[msg.sender]>= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf [_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
 }

 function approve(address _spender, uint256 _value) public returns(bool success){
    allowance[msg.sender][_spender]=_value;
    emit Approval(msg.sender, _spender, _value);
    return true;
 }

function transferFrom (address _from, address _to, uint256 _value) public returns (bool success)
{

require(_value <= balanceOf[_from]);

require(_value <= allowance[_from] [msg.sender]);

// add the balance for transferFrom

balanceOf [_to] += _value;

// subtract the balance for transferFrom

balanceOf [_from] -= _value;

allowance [msg.sender] [_from] -= _value;

emit Transfer(_from, _to, _value);

return true;

}
}