import { EmailCheck } from "../models/EmailCheck.js";
import { analyzeEmail } from "../services/emailAnalyzer.js";
import { AppError } from "../utils/appError.js";

export async function checkEmail(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const analysis = await analyzeEmail(email);
    const saved = await EmailCheck.create({
      ...analysis,
      user: req.user._id
    });

    res.status(201).json({ result: saved });
  } catch (error) {
    next(error);
  }
}

export async function getMyHistory(req, res, next) {
  try {
    const checks = await EmailCheck.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json({ checks });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyCheck(req, res, next) {
  try {
    const deleted = await EmailCheck.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      throw new AppError("History item not found", 404);
    }

    res.json({ message: "History item deleted" });
  } catch (error) {
    next(error);
  }
}
