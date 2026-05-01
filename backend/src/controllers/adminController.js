import { EmailCheck } from "../models/EmailCheck.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";

export async function getStats(req, res, next) {
  try {
    const [users, checks, critical, high, disposable] = await Promise.all([
      User.countDocuments(),
      EmailCheck.countDocuments(),
      EmailCheck.countDocuments({ riskLevel: "Critical" }),
      EmailCheck.countDocuments({ riskLevel: "High" }),
      EmailCheck.countDocuments({ disposable: true })
    ]);

    res.json({ stats: { users, checks, critical, high, disposable } });
  } catch (error) {
    next(error);
  }
}

export async function getAllChecks(req, res, next) {
  try {
    const checks = await EmailCheck.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(250);

    res.json({ checks });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      throw new AppError("Role must be user or admin", 400);
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
      "name email role createdAt"
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}
