const { Atm } = require('../models');
const { apiError500, apiError404 } = require('../utils/customError');

class AtmService {
  async register({ id }) {
    const bank_id = id;
    const atm = new Atm({ bank_id });
    await atm.save();
    return atm;
  }

  async list() {
    const atm = await Atm.findAll({
      attributes: ['id', 'balance', 'bank_id'],
    });
    return atm;
  }

  async find(id) {
    const atm = await Atm.findOne({
      where: { id },
      attributes: ['id', 'balance'],
    });
    if (!atm) {
      throw apiError500;
    } else {
      return atm;
    }
  }

  async edit(id, bank_id, balance) {
    const findAtm = await Atm.findOne({ where: { id } });
    if (!findAtm) {
      throw apiError404;
    } else {
      await Atm.update({ bank_id, balance }, { where: { id } });
    }
  }

  async del(id) {
    await Atm.destroy({
      where: { id },
    });
  }
}

module.exports = AtmService;
