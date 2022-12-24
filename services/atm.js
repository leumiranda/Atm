const { Atm } = require('../models');
const { apiError500, apiError404 } = require('../utils/customError');

class AtmService {
  async register({ banks }) {
    const bank_id = banks.map((end) => end.id);
    const atm = new Atm({ bank_id });
    await atm.save();
    return atm;
  }

  async list() {
    const atm = await Atm.findAll({
      attributes: ['id', 'balance'],
      include: [{
        model: Atm,
        as: 'banks',
        attributes: ['id', 'nome'],
      }],
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

  async edit(id, balance) {
    const findAtm = await Atm.findOne({ where: { id } });
    if (!findAtm) {
      throw apiError404;
    } else {
      await Atm.update({ balance }, { where: { id } });
    }
  }

  async del(id) {
    await Atm.destroy({
      where: { id },
    });
  }
}

module.exports = AtmService;
