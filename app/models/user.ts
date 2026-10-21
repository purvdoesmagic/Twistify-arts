import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // E.164, optional; sparse so many users can have none.
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordResetTokenHash: { type: String, index: true },
    passwordResetExpires: Date,
    role: {
      type: String,
      required: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = models.User ?? model("User", userSchema);
