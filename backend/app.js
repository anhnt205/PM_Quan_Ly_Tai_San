const express = require("express");
const cors = require("cors");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/globalErrorHandler");
require("dotenv").config();
const db = require("./db/models");
const initDatabase = require("./config/initDatabase");

const authRouter = require("./routes/auth");
const departmentRouter = require("./routes/department");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);

app.all(
  /(.*)/,
  catchAsync(async (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  })
);

app.use(globalErrorHandler);

(async () => {
  try {
    // 1️⃣ Tạo DB nếu chưa có
    await initDatabase();
    console.log("✅ Database ensured");

    // 2️⃣ Kết nối Sequelize
    await db.sequelize.authenticate();
    console.log("✅ Sequelize connected");

    // 3️⃣ Tạo bảng nếu chưa có
    await db.sequelize.sync({
      alter: false, // QUAN TRỌNG
      force: false,
    });
    console.log("✅ Tables ensured");

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
