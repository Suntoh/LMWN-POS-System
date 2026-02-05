require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;

const orderRoutes = require("./routes/order");
const menuItemRoutes = require("./routes/menu");
const { connectDB, syncDB } = require("./db");
const { seedMenu } = require("./seed/menuSeed");
const { setupSwagger } = require("./swagger");

require("./models");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (_req, res) => {
  res.send("POS System Server is running");
});

// Logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuItemRoutes);
setupSwagger(app);

//404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectDB();

    await syncDB();

    await seedMenu({ force: false });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
