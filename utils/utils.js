const bcrypt = require('bcrypt');

module.exports = {
  hash: (senha) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(senha, salt);
  },
};
