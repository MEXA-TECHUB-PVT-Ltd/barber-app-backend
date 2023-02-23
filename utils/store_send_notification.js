const sendNotificationToUser = require("../utils/sendNotificationToUser");
const createNotificationOfUser = require('../utils/create_notification_of_user');

const mongoose = require('mongoose');


async function send_store_notification_of_user(user_id , message , notification_type , from){
    try{
        let object= { 
            isSend :"" ,
            isCreateNotification : ""
            };

        let isSend = await sendNotificationToUser(user_id , message);
        if(isSend){
            console.log('Notification sent to user')
            object.isSend = true;
        }
        else{
            object.isSend = false;
        }

        let isCreateNotification = await createNotificationOfUser(user_id , message , notification_type , from);
        if(isCreateNotification){
            console.log('Notification stored');
            object.isCreateNotification=true;   
        }
        else{
            object.isCreateNotification=false;
        }

        return object;
    }
    catch(err){
        console.log(err);
        return null;
        }
}

module.exports = send_store_notification_of_user;