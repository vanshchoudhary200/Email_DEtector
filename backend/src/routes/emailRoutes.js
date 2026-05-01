import { Router } from "express";
import { checkEmail, deleteMyCheck, getMyHistory } from "../controllers/emailController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.post("/check", checkEmail);
router.get("/history", getMyHistory);
router.delete("/history/:id", deleteMyCheck);

export default router;
