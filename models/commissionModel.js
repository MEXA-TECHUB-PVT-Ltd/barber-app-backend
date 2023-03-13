const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const commission = sequelize.define("commission", {
      name: {
        type: Sequelize.STRING,
      },
      percentage : {
        type : Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values : ['active' , 'inactive'],
        defaultValue : "inactive"

      },
      trash : {
        type: Sequelize.BOOLEAN,
        
      }
    });
  
    return commission;
  };