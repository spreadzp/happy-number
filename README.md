# Happy number the lottery game

The game is deployed on the host https://spreadzp.github.io/happy-number/
![image](https://user-images.githubusercontent.com/11519562/88194359-6952cd80-cc47-11ea-8fbc-7cf88bc1cc0c.png)
Smart contract HappyLottery is deployed on the Ropsten testnet at 0xfd6c41cd602681d9788234e4e56ff4bee86e55a9. It uses the BeaconContract smart contract from the Ropsten network (address 0x79474439753C7c70011C3b00e06e559378bAD040) to get a random number at the end of the game
project code : https://github.com/spreadzp/happy-number

Download presentation:
[Lottery.pptx](https://github.com/spreadzp/happy-number/files/4960762/Lottery.pptx)

## Building

1. Install truffle, Angular CLI and an Ethereum client. If you don't have a test environment, we recommend ganache-cli

```bash
npm install -g truffle
npm install -g @angular/cli
npm install -g ganache-cli
npm i


```

3. Run your Ethereum client. For Ganache CLI:

```bash
npm run gan-cli
```

4. Compile and migrate your contracts.

```bash
npm run c-mig
```

## Configuration

1. In order to connect with the Ethereum network, you will need to configure MetaMask
2. Log into the `ganache-cli` test accounts in MetaMask, using the 12-word phrase printed earlier.
   1. A detailed explaination of how to do this can be found [here](https://truffleframework.com/docs/truffle/getting-started/truffle-with-metamask)
      1. Normally, the available test accounts will change whenever you restart `ganache-cli`.
      2. In order to receive the same test accounts every time you start `ganache-cli`, start it with a seed like this: `ganache-cli --seed 0` or `ganache-cli -m "put your mnemonic phrase here needs twelve words to work with MetaMask"`
3. Point MetaMask to `ganache-cli` by connecting to the network `localhost:8545`

## Running

1. Run the app using Angular CLI:

```bash
npm start
```

The app is now served on localhost:4200

2. Making sure you have configured MetaMask, visit http://localhost:4200 in your browser.

3. Send play to the Game!

## Testing

1. Running the Angular component tests:

```bash
ng test
```

2. Running the Truffle tests:

```bash
truffle test
```

## Releasing

Using the Angular CLI you can build a distributable of your app. Will be placed in `dist/`

```bash
ng build
```

## License 2020 CARAVAN MIT License.
