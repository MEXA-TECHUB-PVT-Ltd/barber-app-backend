

const notificationModel = require('../models/notificationModel');
 const mongoose = require('mongoose');

async function createNotificationOfUser(user_id , message ,notification_type ,from){
    try{
        const newNotification = new notificationModel({
            _id : mongoose.Types.ObjectId(),
            from:from,
            to:user_id,
            message:message,
            notification_type:notification_type
        });

        const result = await newNotification.save();

        if(result){
            return true
        }
        else{
            return false
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = createNotificationOfUser;