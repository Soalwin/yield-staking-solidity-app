import React, { Component } from 'react';
import './App.css'
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticleSettings from './particleSettings.js'

class App extends Component {

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
// here we use global objects which is represented by window, throug obejcts we can intreact with ethreum wallets and other providers
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
            } catch (error) {
                console.error("User denied account access:", error);
            }
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider); // Use the injected web3 provider
        } else {
            window.alert('No Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
    
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
    
        // Get network ID
        const networkId = await web3.eth.net.getId();
    
        // Load Tether contract
        const tetherData = Tether.networks[networkId];
        if (tetherData) {
            // Use the correct constructor for the contract
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({ tether });
    
            // Fetch balance
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();

            this.setState({ tetherBalance: tetherBalance.toString() });
            console.log(tetherBalance)
        } else {
            window.alert('Error! Tether contract not deployed');
        }

        
        // Load RWD contract
        const rwdData = RWD.networks[networkId];
        if (rwdData) {
            // Use the correct constructor for the contract
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
            this.setState({ rwd });
    
            // Fetch rwd balance
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({ rwdBalance: rwdBalance.toString() });
        } else {
            window.alert('Error! rwd contract not deployed');
        }

         // Load decentralBank contract
         const decentralBankdata = DecentralBank.networks[networkId];
         if (decentralBankdata) {
             // Use the correct constructor for the contract
             const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankdata.address);
             this.setState({ decentralBank });
     
             // Fetch rwd balance
             let decentralBankBalance = await decentralBank.methods.stakingBalances(this.state.account).call();
             this.setState({ stakingBalances: decentralBankBalance.toString() });
         } else {
             window.alert('Error! DecentralBank contract not deployed');
         }
         this.setState({loading: false})
    }


    stakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        })
        })
    }


    unstakeTokens = () => {
        this.setState({loading: true});
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false});
        });
    }
    

    

   
    constructor(props) {
        super(props)
        this.state = {
                account: '0x0',
                tether: {},
                rwd: {},
                decentralBank: {},
                tetherBalance: '0',
                rwdBalances: '0',
                stakingBalances: '0',
                loading: true
        }
    }
    render() {
        let content 
        {
            this.state.loading ? content = 
            <p id='loader' className='text-center' style={{margin: '50px'}}>
                LOADING PLEASE... </p> : content = 
                <Main 
                tetherBalance={this.state.tetherBalance}
                rwdBalances={this.state.rwdBalances}
                stakingBalances={this.state.stakingBalances}
                stakeTokens={this.stakeTokens}
                unstakeTokens={this.unstakeTokens}
                />
        }


        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticleSettings/>
                </div>
             <Navbar  account={this.state.account}/>
            
               <div className='container-fluid mt-5'>
                  <div className='row'>
                    <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm' }}>
                      <div>
                         {content}
                      </div>
                    </main>
                </div>
            </div>
            </div>
        );
    }
}

export default App;
