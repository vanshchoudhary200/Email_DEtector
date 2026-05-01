import mongoose from "mongoose";

const emailCheckSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    syntaxValid: Boolean,
    disposable: Boolean,
    domainExists: Boolean,
    hasMxRecords: Boolean,
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"]
    },
    reasons: [String],
    dns: {
      mx: [String],
      addresses: [String]
    }
  },
  { timestamps: true }
);

export const EmailCheck = mongoose.model("EmailCheck", emailCheckSchema);
