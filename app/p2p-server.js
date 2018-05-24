const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
// [ws:localhost:5001, ws:localhost:5002] npm run dev
const peers= process.env.PEERS ? process.env.PEERS.split(','): [];

class P2pServer{
  constructor(blockchain){
    this.blockchain = blockchain;
    this.sockets =[];
  }

  listen(){
    const server = new Websocket.Server({port: P2P_PORT});
    server.on('connection', socket=>{this.connectSocket(socket);});
    this.connectToPeers();
    console.log(`Listening to peer to peer connections on ${P2P_PORT}`);
  }

  connectToPeers(){
    peers.forEach(peer=>{
      const socket = new Websocket(peer);
      socket.on('open', ()=>this.connectSocket(socket));
    });
  }

 // when socket is connected it will notify all other sockets with its Blockchain
 // and will also listen for all other sockets blockchains.
  connectSocket(socket){
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    sendChain(socket);
  }

  sendChain(socket){
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  // each socket in the sockets array will send its chain, at the end of this process,
  // all sockets will have the same chain.
  syncChains(){
    this.sockets.forEach(socket=>{
      this.sendChain(socket);
    })
  }

  messageHandler(socket){
    socket.on('message', message=>{
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
    });
  }
}

module.exports = P2pServer;
