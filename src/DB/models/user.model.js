import mongoose, { Schema } from "mongoose";
import {
  GenderEnum,
  RoleEnum,
  providerEnum,
} from "../../utils/enums/user.enum.js";
import { decrypt } from "../../utils/security/encryption/encrypt.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    phone: {
      type: String,
    },
    provider: {
      type: Number,
      enum: Object.values(providerEnum),
      default: providerEnum.System,
    },
    profilePic: {
      type: String,
    },
    coverPics: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
