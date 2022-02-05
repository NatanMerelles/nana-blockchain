const Blockchain = require("./blockchain");
const { join } = require('path');

const database = join(__dirname, 'data', 'blockchain.json');

(async () => {
  const blockchain = await Blockchain.init(database);

  for (let i = 1; i < 5; i++) {
    const block = blockchain.createBlock();
    blockchain.mineBlock(block);
  }

  console.log(JSON.stringify(blockchain.chain, null, 2));
})();
