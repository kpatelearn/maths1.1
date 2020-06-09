window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5b5495ebc3bb41f98d7bf9abda4fca6c"));
    }
})

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

async function getERC20Balance() {
    var address, contractAddress, contractABI, tokenContract, decimals, balance, name, symbol, adjustedBalance
    address = document.getElementById("address").value
    contractAddress = "0xb58e0bf63fbe4e5565ab719d3369058707ab6a02";
    contractABI = human_standard_token_abi

    tokenContract = web3.eth.contract(contractABI).at(contractAddress)

    decimals = promisify(cb => tokenContract.decimals(cb))
    balance = promisify(cb => tokenContract.balanceOf(address, cb))
    name = promisify(cb => tokenContract.name(cb))
    symbol = promisify(cb => tokenContract.symbol(cb))

    try {
        adjustedBalance = await balance / Math.pow(10, await decimals)
        document.getElementById("output2").innerHTML = adjustedBalance;
        document.getElementById("output2").innerHTML += " " + await symbol + " (" + await name + ")";
    } catch (error) {
        document.getElementById("output2").innerHTML = error;
    }
}
