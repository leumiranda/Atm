const bcrypt = require('bcrypt');

module.exports = {
  generateNumberAccount() { // gera um código de barra
    const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
    return random(100000, 999999);
  },

  hash: (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  },
};
