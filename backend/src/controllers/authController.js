import validator from "validator";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/token.js";

function sendAuth(res, user, statusCode = 200) {
  const token = signToken(user);

  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required", 400);
    }

    if (!validator.isEmail(email)) {
      throw new AppError("Enter a valid email address", 400);
    }

    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const exists = await User.exists({ email: email.toLowerCase() });
    if (exists) {
      throw new AppError("Email is already registered", 409);
    }

    const user = await User.create({ name, email, password });
    sendAuth(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || "").toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password || ""))) {
      throw new AppError("Invalid email or password", 401);
    }

    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
}
