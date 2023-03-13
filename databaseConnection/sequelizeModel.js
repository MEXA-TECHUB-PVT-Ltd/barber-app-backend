const dbConfig = require("./connection");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Admin = require("../models/adminModel")(sequelize ,Sequelize)
db.Lenght = require("../models/LengthModel")(sequelize ,Sequelize)
let Barber = db.Barber = require("../models/BarberModel")(sequelize ,Sequelize)
db.HairCutPrice = require("../models/hairCutPriceModel")(sequelize ,Sequelize)
db.ReasonCancellation = require("../models/reasonCancellationModel")(sequelize ,Sequelize)
db.commission = require("../models/commissionModel")(sequelize ,Sequelize)
db.otpStored = require("../models/otpStoredModel")(sequelize ,Sequelize)
let time_slot= db.time_slots = require("../models/time_slotsModel")(sequelize ,Sequelize)
let slot_days= db.slot_days = require("../models/slot_daysModel")(sequelize ,Sequelize)




Barber.hasMany(time_slot , {as : 'time_slots' , foreignKey : "barber_id"});
time_slot.belongsTo(Barber , {
  foreignKey : "barber_id",
  as : "Barber_details"
})



time_slot.belongsTo(slot_days , {
  foreignKey : "day_id",
  as : "time_slots"
})
slot_days.hasMany(time_slot , {as : "time_slots"  , foreignKey: "day_id"})



Barber.hasMany(slot_days , {as: 'days' , foreignKey : "barber_id"});
slot_days.belongsTo(Barber , {
  foreignKey : 'barber_id',
  as: 'barber_details'
} )


const HairStyle = db.HairStyle = require("../models/hairStyleModel")(sequelize ,Sequelize)

HairStyle.belongsTo (db.Barber , {foreignKey : 'created_by_id'})
HairStyle.belongsTo (db.Admin , {foreignKey : 'created_by_id'})


db.HairStyle = HairStyle;



module.exports = db;


// // Admin model
// const Admin = sequelize.define('admin', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// // Barber model
// const Barber = sequelize.define('barber', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// // HairStyle model
// const HairStyle = sequelize.define('hair_style', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   created_by: {
//     type: DataTypes.ENUM('admin', 'barber'),
//     allowNull: false,
//   },
//   created_by_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// });

// // Associations
// HairStyle.belongsTo(Admin, { foreignKey: 'created_by_id', constraints: false, as: 'created_by_admin' });
// HairStyle.belongsTo(Barber, { foreignKey: 'created_by_id', constraints: false, as: 'created_by_barber' });
// Admin.hasMany(HairStyle, { foreignKey: 'created_by_id', constraints: false });
// Barber.hasMany(HairStyle, { foreignKey: 'created_by_id', constraints: false });
