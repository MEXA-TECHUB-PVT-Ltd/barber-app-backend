module.exports = (sequelize, Sequelize) => {
    const HairStyle = sequelize.define("HairStyle", {
      title: {
        type: Sequelize.STRING
      },
      image: {
        type:Sequelize.STRING
      },
      created_by : {
        type: Sequelize.ENUM,
        values: ['admin' , 'barber'],
        validate:{
          isIn: [["admin" , 'barber']]
        }
      },
      created_by_id : {
        type: Sequelize.INTEGER
      },
      trash : {
        type: Sequelize.BOOLEAN,
      }
     
    });
  
    return HairStyle;
  };