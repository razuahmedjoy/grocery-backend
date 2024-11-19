require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')

const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));


app.get("/dashboard/summary", async (req, res) => {
    try {
        // Count the total number of orders
        const orderCount = await Order.countDocuments();

        // Count the total number of products
        const productCount = await Product.countDocuments();

        // Send the summary response
        res.json({
            orderCount,
            productCount
        });
    } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// --- Products CRUD ---
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post("/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

app.put("/products/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});

app.delete("/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
});

// --- Orders CRUD ---
app.get("/orders", async (req, res) => {
    const orders = await Order.find().populate("_id");
    res.json(orders);
});

app.post("/orders", async (req, res) => {
    const { cartItems, name, address, phone, total } = req.body


    const orderData = {
        products: cartItems,
        name: name,
        address: address,
        phoneNumber: phone,
        total: total
    }

    const order = new Order(orderData);
    await order.save();
    res.json(order);


});

app.put("/orders/:id", async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
});

app.delete("/orders/:id", async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
});

// --- Change Order Status ---
app.patch("/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
});

// --- User Management ---
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
