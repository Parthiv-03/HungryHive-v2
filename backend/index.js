const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require("./routes/users-routes");
const cartRoutes = require("./routes/cart-routes");
const storeRoutes = require("./routes/store-routes");
const ordersRoutes = require("./routes/orders-routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/store",storeRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",ordersRoutes);

app.use((req,res)=>{
  res.send("API not found");
});


mongoose
  .connect(
    "mongodb+srv://Divyang:Divyang%407725@hungryhive.ghx0p.mongodb.net/Hungryhive?retryWrites=true&w=majority" 
  )
  .then(() => {
    console.log("MongoDB Database connected Successfully.");
    app.listen(5000,()=>{
        console.log("Backend Running at 5000 port");
    });
  })
  .catch((err) => {
    console.log(err);
  });


