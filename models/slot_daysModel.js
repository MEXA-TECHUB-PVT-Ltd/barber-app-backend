
module.exports = (sequelize, Sequelize) => {
    const slot_days = sequelize.define("slot_days", {
      name : {
        type: Sequelize.STRING,
      },
      barber_id : Sequelize.STRING
    });
  
    return slot_days;
  };