
module.exports = (sequelize, Sequelize) => {
    const HairCutPrice = sequelize.define("HairCutPrice", {
      price: {
        type: Sequelize.STRING,
      },
    });
  
    return HairCutPrice;
  };