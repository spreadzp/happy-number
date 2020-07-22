pragma solidity >=0.4.21 < 0.7.0;


contract IFactRegistry {
    /*
      Returns true if the given fact was previously registered in the contract.
    */
    function isValid(bytes32 fact)
        external view
        returns(bool);
}

contract PublicInputOffsets {
    // The following constants are offsets of data expected in the public input.
    uint256 internal constant OFFSET_LOG_TRACE_LENGTH = 0;
    uint256 internal constant OFFSET_VDF_OUTPUT_X = 1;
    uint256 internal constant OFFSET_VDF_OUTPUT_Y = 2;
    uint256 internal constant OFFSET_VDF_INPUT_X = 3;
    uint256 internal constant OFFSET_VDF_INPUT_Y = 4;
}

contract BeaconContract is PublicInputOffsets {
    event LogNewRandomness(uint256 blockNumber, bytes32 randomness);
    // Mapping: blockNumber -> randomness.
    mapping(uint256 => bytes32) private registeredRandomness;

    uint256 latestBlockNumber;
    address public owner;
    uint256 public n_iterations;
    IFactRegistry verifierContract;
    uint256 internal constant PRIME = 0x30000003000000010000000000000001;
    uint256 internal constant MAX_LOG_TRACE_LENGTH = 40;
    uint256 internal constant PUBLIC_INPUT_SIZE = 5;

    modifier onlyOwner {
        require(msg.sender == owner, "Sender is not the owner");
        _;
    }

    constructor(address verifierAddress, uint256 n_iters) public {
        owner = msg.sender;
        verifierContract = IFactRegistry(verifierAddress);
        n_iterations = n_iters;
    }

    /*
      Registers a new randomness if and only if:
        1. Can verify the block hash of the given blockNumber and that it indeed equals blockHash.
        2. The vdfInput calculted from the given blockHash matches the given proofPublicInput.
        3. The proofPublicInput was registered as a fact in the verifier contract.
      Updates latest randomness.
    */
    function registerNewRandomness(
        uint256 blockNumber,
        bytes32 blockHash,
        uint256[PUBLIC_INPUT_SIZE] calldata proofPublicInput
    ) external onlyOwner {
        // EVM can get block hash only for latest 256 blocks.
        require(
            blockNumber < block.number && block.number <= blockNumber + 255,
            "Block is not within the last 256 blocks."
        );
        // In case blockNumber refers to a block which is more than 256 blocks old,
        // blockhash(blockNumber) returns 0.
        require(
            blockhash(blockNumber) == blockHash && blockHash != 0,
            "blockHash does not match blockNumber or too old."
        );
        require(
            proofPublicInput[OFFSET_LOG_TRACE_LENGTH] < MAX_LOG_TRACE_LENGTH,
            "VDF reported length exceeds the integer overflow protection limit."
        );
        require(
            n_iterations == 10 * 2**proofPublicInput[OFFSET_LOG_TRACE_LENGTH] - 1,
            "Public input and n_iterations are not compatible."
        );
        require(
            proofPublicInput[OFFSET_VDF_OUTPUT_X] < PRIME &&
                proofPublicInput[OFFSET_VDF_OUTPUT_Y] < PRIME,
            "Invalid vdf output."
        );
        // To calculate the input of the VDF we first hash the blockHash with the string "veedo",
        // then we split the last 250 bits to two 125 bit field elements.
        uint256 vdfInput = uint256(keccak256(abi.encodePacked(blockHash, "veedo")));
        require(
            vdfInput & ((1 << 125) - 1) == proofPublicInput[OFFSET_VDF_INPUT_X],
            "blockHash does not match the given proofPublicInput."
        );
        require(
            ((vdfInput >> 125) & ((1 << 125) - 1)) == proofPublicInput[OFFSET_VDF_INPUT_Y],
            "blockHash does not match the given proofPublicInput."
        );
        require(
            verifierContract.isValid(keccak256(abi.encodePacked(proofPublicInput))),
            "No valid proof provided."
        );
        // The randomness is the hash of the VDF output and the string "veedo"
        bytes32 randomness = keccak256(
            abi.encodePacked(
                proofPublicInput[OFFSET_VDF_OUTPUT_X],
                proofPublicInput[OFFSET_VDF_OUTPUT_Y],
                "veedo"
            )
        );
        registeredRandomness[blockNumber] = randomness;
        emit LogNewRandomness(blockNumber, randomness);
        // Update latestBlockNumber if blockNumber is greater than latestBlockNumber.
        if (blockNumber > latestBlockNumber) {
            latestBlockNumber = blockNumber;
        }
    }

    /*
      If there is a randomness for blockNumber, returns it.
      Otherwise, returns 0.
    */
    function getRandomness(uint256 blockNumber)
        external
        view
        returns (bytes32)
    {
        return registeredRandomness[blockNumber];
    }

    /*
      Returns the latest registered (blockNumber, randomness).
    */
    function getLatestRandomness() external view returns (uint256, bytes32) {
        return (latestBlockNumber, registeredRandomness[latestBlockNumber]);
    }
}
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner, "The address not equal with the owner");
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0), "Invalid address");
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract tokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) public;
}

contract Token {

    using SafeMath for uint256;

    /* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol
        ) public {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] > _value, "the sender hasn't enough of tokens");           // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to], "It's overflows"); // Check for overflows
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);                     // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                            // Add the same to the recipient
        emit Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value) public  returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /* Approve and then communicate the approved contract in a single tx */
    function approveAndCall(address _spender, uint256 _value, bytes memory _extraData) public  returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, address(this), _extraData);
            return true;
        }
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] > _value, "the sender hasn't enough of tokens");                 // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to], "It's overflows");  // Check for overflows
        require(_value < allowance[_from][msg.sender], "It is not allowance");   // Check allowance
        balanceOf[_from] = balanceOf[_from].sub(_value);                          // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                            // Add the same to the recipient
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }
}

contract LotteryToken is Ownable, Token {
    using SafeMath for uint256;
    uint256 public priceForSell = 100000000000000;
    uint256 public priceForBuy = 100000000000000;

    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol
    ) public Token (initialSupply, tokenName, decimalUnits, tokenSymbol) {}

    /* Send coins */
    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] > _value, "the sender hasn't enough of tokens");           // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to], "It's overflows"); // Check for overflows
        require(!frozenAccount[msg.sender], "The account is frozen now");                // Check if frozen
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);                     // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                            // Add the same to the recipient
        emit Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }


    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(!frozenAccount[_from], "the tokens frozen");                     // Check if frozen
        require(balanceOf[_from] > _value, "");                // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to], ""); // Check for overflows
        require(_value < allowance[_from][msg.sender], "");    // Check allowance
        balanceOf[_from] = balanceOf[_from].sub(_value);   // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);        // Add the same to the recipient
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function mintToken(address target, uint256 mintedAmount) public onlyOwner {
        balanceOf[target] = balanceOf[target].add(mintedAmount);
        totalSupply = totalSupply.add(mintedAmount);
        emit Transfer(address(0), address(this), mintedAmount);
        emit Transfer(address(this), target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) public onlyOwner {
        frozenAccount[target] = freeze;
        emit FrozenFunds(target, freeze);
    }

    function setPrices(uint256 newPriceForSell, uint256 newPriceForBuy) public onlyOwner {
        priceForSell = newPriceForSell;
        priceForBuy = newPriceForBuy;
    }

    function buy() public  payable {
        uint amount = msg.value.div(priceForBuy);                // calculates the amount
        //require(balanceOf[this] >= amount);               // checks if it has enough to sell
        balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);                   // adds the amount to buyer's balance
        balanceOf[address(this)] = balanceOf[address(this)].add(amount);                         // subtracts amount from seller's balance
        emit Transfer(address(this), msg.sender, amount);                // execute an event reflecting the change
    }

    function sell(uint256 amount) public {
        require(balanceOf[msg.sender] > amount, "balance of the seller not enough");        // checks if the sender has enough to sell
        balanceOf[address(this)] = balanceOf[address(this)].add(amount);                         // adds the amount to owner's balance
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(amount);                   // subtracts the amount from seller's balance
        msg.sender.transfer(amount.mul(priceForSell));
        emit Transfer(msg.sender, address(this), amount);
    }
}

contract GameStatistics {
struct GamerResult {
  uint256 numberGame;
  uint256 gamerPrize;
  }
  mapping (address => GamerResult[]) public  gamerResults;
  uint256[] numberGames;
  uint256[] prizeInGames;
  // uint256 [][] public gamerResults;
  function getResults (address gamerAddress) public returns (uint256[] memory , uint256[] memory ) {
    GamerResult[] memory results = gamerResults[gamerAddress];
    uint256 lengthResult = results.length;

    for (uint8 i = 0; i < lengthResult; i++) {
      numberGames.push(results[i].numberGame);
      prizeInGames.push(results[i].gamerPrize);
    }
    return (numberGames, prizeInGames);
  }
  function setWinnerResults (address gamerAddress, uint256 numberWinGame, uint256 gamerWinPrize ) public {
    GamerResult memory newResult = GamerResult(numberWinGame, gamerWinPrize);
    gamerResults[gamerAddress].push(newResult);
  }
}
contract HappyLottery is LotteryToken, GameStatistics {
    using SafeMath for uint256;

    address[100] public tickets;
    uint256 public countTickets = 100;
    uint256 public jackPot = 0;
    uint256 public ticketPrice = 1;
    uint256 public toJackPotFromEveryTicket = 4;
    uint256 public xPrize = 2;
    uint256 public lastWinNumber;
    uint256 public numberGame = 0;

    event WinnersLotteriesNumbers(uint256 jackPotNumber, uint256 winnerMinNumber, uint256 winnerMaxNumber);
    event LotteryBought(uint256 LotteryNumber);

    constructor() public LotteryToken(countTickets * ticketPrice, "Super Lottery Token", 0, "SLT") {
        clearTickets();
    }

    function buyTicket(uint256 ticketNum) public returns (bool success) {
        require((ticketNum > 0) || (ticketNum <= countTickets), "wrong number");
        require(balanceOf[msg.sender] > ticketPrice, "the balance of the player less than ticketPrice");
        require(tickets[ticketNum] == address(0), "count of tickets have to more than 0");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(ticketPrice);
        jackPot = jackPot.add(toJackPotFromEveryTicket);
        tickets[ticketNum] = msg.sender;
        emit LotteryBought(ticketNum);
        return true;
    }

    function play() public onlyOwner {

      //BeaconContract beacon = BeaconContract(0x79474439753C7c70011C3b00e06e559378bAD040);
      //lastWinNumber = uint256(blockhash(block.number - 1)) % countTickets + 1;
      //(uint256 t , bytes32 rndNumber) = beacon.getLatestRandomness();
    //   BeaconContract beacon = BeaconContract(0x79474439753C7c70011C3b00e06e559378bAD040);
    //   (, bytes32 rndHash) = beacon.getLatestRandomness();
    //   lastWinNumber = uint256(rndHash) % countTickets + 1;
      lastWinNumber = uint8(uint256(keccak256(abi.encode(block.timestamp, block.difficulty))) % countTickets + 1);
      if(tickets[lastWinNumber] != address(0)) {
          balanceOf[tickets[lastWinNumber]] = balanceOf[tickets[lastWinNumber]].add(jackPot);
          setWinnerResults (tickets[lastWinNumber],numberGame, jackPot);
          jackPot = 0;
      }

        //Winner number more then 0
        uint256 minNumberOfWin = lastWinNumber.sub(lastWinNumber % 10).add(1);
        uint256 maxNumWin = minNumberOfWin.add(9);

        for (uint256 i = minNumberOfWin; i < maxNumWin; i++) {
            if(tickets[i] != address(0)) {
                balanceOf[tickets[i]] = balanceOf[tickets[i]].add(ticketPrice * xPrize);
                setWinnerResults (tickets[i],numberGame, ticketPrice * xPrize );
            }
        }
        emit WinnersLotteriesNumbers(lastWinNumber, minNumberOfWin, maxNumWin);
        clearTickets();
    }

    function setLotteryParameters (uint256 newTicketPrice, uint256 newToJackPotFromEveryTicket, uint256 newXPrize) public onlyOwner {
        ticketPrice = newTicketPrice;
        toJackPotFromEveryTicket = newToJackPotFromEveryTicket;
        xPrize = newXPrize;
    }

    function getTickets() public  view returns (address[100] memory){
      return tickets;
    }

    function clearTickets() private {
        numberGame++;
        for (uint256 j = 0; j < countTickets; j++) {
            tickets[j] = address(0);
        }
    }
}

contract RndContract {
    event TestEv(bytes32 randNumber, uint256 currBlock, uint256 latestBlockNumber);
    uint256 countTickets = 100;
    constructor() public {}

    function getRandNumber() public returns(bytes32) {
       BeaconContract beacon = BeaconContract(0x79474439753C7c70011C3b00e06e559378bAD040);
       (uint256 t, bytes32 rndHash) = beacon.getLatestRandomness();
        uint256 lastWinNumber = uint256(rndHash) % countTickets + 1;
        emit TestEv(rndHash, lastWinNumber, t);
        return rndHash;
    }
}
