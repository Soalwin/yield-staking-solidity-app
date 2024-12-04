import React, { Component } from 'react';
import './App.css'
import Navbar from './Navbar';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
                account: '0x0'
        }
    }
    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
            
            <div className='text-center'>
                <h1>Hello, World!</h1>
            </div>
            </div>
        );
    }
}

export default App;
