import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ ADD THIS

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";

const app = express();

app.set("trust proxy", 1);

// ✅ ADD CORS HERE (before routes)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // VERY IMPORTANT for cookies
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

export default app;