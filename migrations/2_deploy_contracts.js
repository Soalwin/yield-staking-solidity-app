const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function (deployer, network, accounts) {
    // Deploy Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    // Deploy RWD contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    // Deploy DecentralBank contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();

    // Transfer RWD tokens to the DecentralBank
    await rwd.transfer(decentralBank.address, '100000000000000000000000');

    // Debugging: Log accounts
    console.log("Available accounts:", accounts);
    console.log("Recipient address:", accounts[1]);

    // Transfer some Tether tokens to a test account
    if (web3.utils.isAddress(accounts[1])) {
        await tether.transfer(accounts[1], '100000000000000000000000');
    } else {
        console.error("Invalid recipient address:", accounts[1]);
    }
};
