const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    products: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product model
          name: { type: String, required: true }, // Name of the product
          quantity: { type: Number, required: true, min: 1 }, // Quantity of the product
          price: { type: Number, required: true, min: 0 }, // Price of the product
          name:{type:String}
        },
      ],
      total:{type:Number},
      status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
      name: { type: String, required: false },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      created_at    : { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
