const { createHash } = require('crypto');

const Repository = require('./models/base');

class Block {
  constructor(header = {}, payload = {}) {
    this.header = header;
    this.payload = payload;
  }

  updateHeader(header) {
    this.header = header;
  }
}

const hash = (data) => {
  return createHash('sha256').update(data).digest('hex');
}

const genesisBlock = () => {
  const payload = {
    sequence: 0,
    timestamp: +new Date(),
    data: '',
    previousHash: ''
  }

  const header = {
    nonce: 0,
    blockHash: hash(JSON.stringify(payload))
  }

  return new Block(header, payload);
}

class Blockchain {
  #chain;

  constructor(repository, prefix = '0', difficulty = 2) {
    this.#chain = repository;
    this.validator = prefix.repeat(difficulty);
  }

  static async init(file, ...params) {
    const repository = new Repository(file);
    repository.push(genesisBlock());

    return new Blockchain(repository, ...params);
  }

  get lastBlock() {
    return this.#chain.read().at(-1);
  }

  get chain() {
    return this.#chain.read();
  }

  validateHash(hash) {
    return hash.startsWith(validator);
  }

  validateBlock(block) {
    return this.validateHash(block.header.hash) && block.payload.prevHash === this.lastBlock.header.hash;
  }

  createBlock(data = {}) {
    const header = {};
    const payload = {
      data,
      timestamp: +new Date(),
      prevHash: this.lastBlock.header.hash,
      sequence: this.lastBlock.payload.sequence + 1
    }

    return new Block(header, payload);
  }

  mineBlock(block) {
    let nonce = 0;
    const startTime = +new Date();

    while (1) {
      const blockHash = hash(JSON.stringify(block))
      const proofingHash = hash(blockHash + nonce);

      if (proofingHash.startsWith(this.validator)) {
        const endTime = +new Date();
        const time = (endTime - startTime) / 1000;

        console.log(`bloco minerado em ${nonce} tentativas, com ${time}s`);

        block.updateHeader({ hash: proofingHash, nonce });

        this.#chain.push(block);

        return
      }

      nonce++;
    }
  }
}

module.exports = Blockchain