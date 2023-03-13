module.exports = (sequelize, Sequelize) => {
    const Length = sequelize.define("Length", {
      name: {
        type: Sequelize.STRING
      },
      length: {
        type:Sequelize.STRING
      }
    });
  
    return Length;
  };