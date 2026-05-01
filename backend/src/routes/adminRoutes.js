import { Router } from "express";
import { getAllChecks, getStats, getUsers, updateUserRole } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/stats", getStats);
router.get("/checks", getAllChecks);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
