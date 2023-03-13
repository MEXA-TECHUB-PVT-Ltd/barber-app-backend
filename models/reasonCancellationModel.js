
module.exports = (sequelize, Sequelize) => {
    const ReasonCancellation = sequelize.define("ReasonCancellation", {
      reason_title: {
        type: Sequelize.STRING
      },
      percentage_deduction: {
        type:Sequelize.STRING
      },
      trash : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  
    return ReasonCancellation;
  };