const bcrypt = require('bcrypt');

module.exports = {
  codebar: () => { // gera um código de barra
    const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
    return random(7890000000000, 7899999999999);
  },
  hash: (senha) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(senha, salt);
  },
};
