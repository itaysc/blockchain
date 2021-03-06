const EC = require('elliptic').ec; // for cyptography.
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1'); // the same that bitcoin uses.will be generated by 256 bits prime number.
const uuidV1 = require('uuid/v1');

class ChainUtil{
  static genKyPair(){
    return ec.genKeyPair();
  }

  // returns a universal unique identifier based on a timestamp.
  static id(){
    return uuidV1();
  }

  static hash(data){
    return SHA256(JSON.stringify(data)).toString();
  }
}

module.exports = ChainUtil;
