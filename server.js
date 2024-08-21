require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
// routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/products");
const altProductRoutes = require("./routes/altProducts");
const altProductSubRoutes = require("./routes/altProductsSub");
const productOfferRoutes = require("./routes/productsOffer");
const wastageProductRoutes = require("./routes/wastageProducts");
const salesProductRoutes = require("./routes/salesRoutes");
const pnpInvoiceRoutes = require("./routes/pnpInvoiceRoutes");
const wastageRoute = require("./routes/wastageRoute");
const serviceRoutes = require("./routes/serviceRoutes");

//express app
const app = express();

// middleware
app.use(express.json({ limit: "1000mb" }));
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// ROUTES
app.use("/api/user", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/altProducts", altProductRoutes);

app.use("/api/altProductsSub", altProductSubRoutes);

app.use("/api/productOffer", productOfferRoutes);

app.use("/api/wastageProduct", wastageProductRoutes);

app.use("/api/sales", salesProductRoutes);

app.use("/api/pnpInvoices", pnpInvoiceRoutes);
app.use("/api/pnpWastage", wastageRoute);
app.use("/api/services", serviceRoutes);

// connect to db
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db and listening on port 4000!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
