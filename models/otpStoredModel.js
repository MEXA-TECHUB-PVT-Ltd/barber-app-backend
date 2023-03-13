module.exports = (sequelize, Sequelize) => {
    const otpStored = sequelize.define("otpStored", {
      email: {
        type: Sequelize.STRING
      },
      otp: {
        type:Sequelize.STRING
      }
    });
  
    return otpStored;
  };