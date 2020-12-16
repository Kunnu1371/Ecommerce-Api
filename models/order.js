const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    uniqueID: {
      type: String
    },

    products: {
      type: Array,
      default: [],
      required: true,
    },  
    
    total: {
      type: Number
    },
    voucher: {
      type: String
    },
    transaction_id: {},
    // amount: { type: Number },

    address: String,
    
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Placed", "Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },

    updated: Date,

    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Order", OrderSchema);