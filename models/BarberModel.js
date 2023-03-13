const { GEOGRAPHY, GEOMETRY, STRING } = require("sequelize");


module.exports = (sequelize, Sequelize) => {
    const Barber = sequelize.define("Barber", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_name: {
        type: Sequelize.STRING
      },
      password: {
        type:Sequelize.STRING
      },
      email : {
        type:Sequelize.STRING
      },
      device_token :{
        type: Sequelize.STRING
      },
      profile_image : {
        type: Sequelize.STRING
      },
      gender: {
        type : Sequelize.STRING
      },
      age: {
        type: Sequelize.STRING
      },
      experience : {
        type: Sequelize.STRING
      },
      saloon_location: {
        type:Sequelize.GEOMETRY("point")

      },
      block : {
        type: Sequelize.ENUM,
        values: ["active" , 'inactive'],
         allowNull: false,
        defaultValue: "inactive",
        validate:{
          isIn: [["active" , 'inactive']]
        }
      },
      saloon_location_address : {
        type: Sequelize.STRING
      }
     
    });
  
    
    return Barber;
  };