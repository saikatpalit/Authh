import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPasswordHandler,
  googleAuthCallbackHandler,
  googleAuthStartHandler,
  // googleLoginHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  twoFASetuphandler,
  twoFAVerifyHandler,
  verifyEmailHandler,
} from "../controllers/auth/auth.controller";
import requireAuth from "../middleware/requireAuth";



// Login — 3 attempts per 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many login attempts, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register — 10 attempts per hour
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many accounts created, try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password — 3 attempts per hour
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many password reset attempts, try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2FA verify — 5 attempts per 15 min
const twoFALimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many 2FA attempts, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
const router = Router();

// router.post("/register", registerHandler);
// router.post("/login", loginHandler);
// router.get("/verify-email", verifyEmailHandler);
// router.post("/refresh", refreshHandler);
// router.post("/logout", logoutHandler);
// router.post("/forgot-password", forgotPasswordHandler);
// router.post("/reset-password", resetPasswordHandler);
// router.get("/google", googleAuthStartHandler);
// router.get("/google/callback", googleAuthCallbackHandler);
// // router.post("/google", googleLoginHandler);
// router.post("/2fa/setup", requireAuth, twoFASetuphandler);
// router.post("/2fa/verify", requireAuth, twoFAVerifyHandler);



//limiters to sensitive routes
router.post("/register", registerLimiter, registerHandler);
router.post("/login", loginLimiter, loginHandler);
router.get("/verify-email", verifyEmailHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/google", googleAuthStartHandler);
router.get("/google/callback", googleAuthCallbackHandler);
router.post("/2fa/setup", requireAuth, twoFASetuphandler);
router.post("/2fa/verify", requireAuth, twoFALimiter, twoFAVerifyHandler);

export default router;
