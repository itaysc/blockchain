const ChainUtil = require('../chain-util');

const { DIFFICULTY, MINE_RATE } = require('../config');

class Block{
  constructor(timestamp, lastHash, hash, data, nonce, difficulty){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY; // the genesis block will get DIFFICULTY
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce:    : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'i12t13a14y15-s16c17h18m19i10d11t13', [], 0, DIFFICULTY);
  }

  // this will hold the proof of work algorithm.
  // the miner will keep generating hashes using the block's data
  // until he succeeds generating a hash which starts with the right amount of
  // leading zeros(the right amount of zeroes is the DIFFICULTY).
  // what makes the hash to change in each loop is the 'nonce' value which
  // increaments each loop.
  static mineBlock(lastBlock, data){
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    // the difficulty of the block will be influenced by the last block.
    let { difficulty } = lastBlock;
    let nonce = 0;
    do{
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce);
    }while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  // we want to control the time it takes to mine a new block(aka MINE_RATE) using the difficulty.
  static adjustDifficulty(lastBlock, currentTime){
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  static hash(timestamp, lastHash, data, nonce, difficulty){
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }
  static blockHash(block){
    const {timestamp, lastHash, data, nonce, difficulty} = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }
}

module.exports = Block;
