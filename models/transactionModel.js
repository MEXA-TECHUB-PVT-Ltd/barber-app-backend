const mongoose = require('mongoose');

const transaction = new mongoose.Schema({
    to_user : {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'appointment',
    },
    withdrable: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    from : {
        type: String,
        enum:['barber' , 'customer' , 'admin']
    },
    to : {
        type: String,
        enum:['barber' , 'customer' , 'admin']
    }
  });

  module.exports = mongoose.model('transaction' , transaction);
  