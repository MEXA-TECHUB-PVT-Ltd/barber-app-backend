module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("Admin", {
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type:Sequelize.STRING
      },
      password: {
        type:Sequelize.STRING
      },
      img :{
        type: Sequelize.STRING,
      },
      privacy_policy : Sequelize.STRING,
      terms_and_conditions : Sequelize.STRING

    });

  
    return Admin;
  };