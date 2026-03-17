import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";

const app = express();

app.set("trust proxy", 1);

// CORS HERE (before routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true, // VERY IMPORTANT for cookies
  })
);

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 min per IP
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter); // To set Limit..

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

export default app;