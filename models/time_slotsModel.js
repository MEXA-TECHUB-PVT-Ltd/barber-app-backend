
module.exports = (sequelize, Sequelize) => {
    const time_slots = sequelize.define("time_slots", {
      start_time: {
        type: Sequelize.STRING
      },
      end_time: {
        type:Sequelize.STRING
      },
      barber_id : Sequelize.INTEGER,
      day_id : Sequelize.INTEGER
    });
  
    return time_slots;
  };