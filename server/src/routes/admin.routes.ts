import { Request, Response, Router } from "express";
import requireAuth from "../middleware/requireAuth";
import requireRole from "../middleware/requireRole";
import { User } from "../models/user.model";

const router = Router();

router.patch(
  "/users/:id/role",
  requireAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body as { role?: string };

      if (!role || !["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        message: `User role updated to ${role}`,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    try {
      const users = await User.find(
        {},
        {
          email: 1,
          role: 1,
          name: 1,
          isEmailVerified: 1,
          createdAt: 1,
        }
      ).sort({ createdAt: -1 });

      const result = users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name,
        isEmailVerified: u.isEmailVerified,
        createdAt: u.createdAt,
      }));

      return res.json({ users: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default router;
