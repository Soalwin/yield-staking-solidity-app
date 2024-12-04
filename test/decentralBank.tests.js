const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('DecentralBank', ([owner, customer]) => {

    let tether, rwd, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether');
    }

    before(async () => {

        // Load Contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'));

        // Transfer 100 mock Tethers to Customer
        await tether.transfer(customer, tokens('100'), { from: owner });

    });

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name();
            assert.equal(name, 'Mock Tether Token');
        });
    });

    describe('Reward Token', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        });
    });

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        });

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens('1000000'));
        });

        describe('Yield Farming', async () => {
            it('reward tokens for staking', async () => {
                let result;

                result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('100'));

                await tether.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), {from: customer})

                result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('0'));

                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('100'));

                result = await decentralBank.isStaking(customer);
                assert.equal(result.toString(), 'true');

                //issue token test

                await decentralBank.issueTokens({from: owner})


                await decentralBank.issueTokens({from: customer}).should.be.rejected;

                //checking unstake tokens
                await decentralBank.unstakeToken({from: customer})

                //checking usntaking balances

                result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('100'));

                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'));

                result = await decentralBank.isStaking(customer);
                assert.equal(result.toString(), 'false');

            });
        });
    });
});
