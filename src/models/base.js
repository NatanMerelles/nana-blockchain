const { readFileSync, writeFileSync } = require('fs');

class BaseRepository {
  constructor(file) {
    this.file = file
  }

  read() {
    return JSON.parse(readFileSync(this.file)) || [];
  }

  push(block) {
    let data = JSON.parse(readFileSync(this.file)) || [];

    data.push(block);

    writeFileSync(this.file, JSON.stringify(data));
  }
}

module.exports = BaseRepository;