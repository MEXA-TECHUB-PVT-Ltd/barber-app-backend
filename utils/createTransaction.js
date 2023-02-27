const eWalletModel = require("../models/e-walletModel");

const transactionModel = require('../models/transactionModel');

async function createTransaction(data){
    try{
        const {type , amount , description ,appointment_id , withdrable ,from , to} = data;

        console.log(data);

        const newTransaction = new transactionModel({
            _id: mongoose.Schema.Types.ObjectId(),
            to_user:to_user,
            type:type,
            amount : amount , 
            description: description, 
            appointment_id: appointment_id,
            withdrable : withdrable , 
            from : from,
            to:to
        })


        const result = await newTransaction.save();
        if(result){
            return true
        }
        else{
            return false
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}