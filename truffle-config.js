require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        developments: {
            host:'127.0.0.1',
            port:'7545',
            network_id:'*'  //match any network
        },
    },

contracts_directory: './src/contracts',
contracts_build_directory: './src/truffle_abis',
compilers: {
    solc: {
        versions: '0.5.16',
        optimizer: {
            enabled: true,
            runs: 200
        },
    },
},
};