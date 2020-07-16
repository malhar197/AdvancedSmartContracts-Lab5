require("dotenv").config("./env");

const Web3 = require("web3");

const BigNumber = require("bignumber.js");

const abi = require("./abi.json");

const { bytecode } = require("./bytecode");

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.URI));

const accountObj = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);

const _number = new BigNumber(10);
const simpleCounterContract = new web3.eth.Contract(abi);

const contractData = simpleCounterContract
  .deploy({
    data: `0x${bytecode}`,
    arguments: [_number],
  })
  .encodeABI();
web3.eth
  .estimateGas({ from: accountObj.address, data: contractData })
  .then((gas) => {
    const rawTx = {
      from: accountObj.address,
      gas,
      data: contractData,
    };
    web3.eth.accounts
      .signTransaction(rawTx, accountObj.privateKey)
      .then(({ rawTransaction, transactionHash }) => {
        web3.eth
          .sendSignedTransaction(rawTransaction)
          .on("receipt", console.log);

        waitForReceipt(transactionHash, (result) => {
          console.log("The contract is deployed at ", result.contractAddress);
        });
      });
  });

function waitForReceipt(hash, cb) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      console.error(err);
    }
    if (receipt) {
      
      if (cb) {
        cb(receipt);
      }
    } else {
      
      console.log("Waiting to get mined...");
      setTimeout(function () {
        waitForReceipt(hash, cb);
      }, 1000);
    }
  });
}