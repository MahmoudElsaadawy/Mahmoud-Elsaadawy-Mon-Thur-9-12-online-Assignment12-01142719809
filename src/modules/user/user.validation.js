import joi from "joi"
import { GenderEnum, RoleEnum } from "../../utils/enums/user.enum.js"

export const signUpSchema = {
  body: joi.object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.number().valid(...Object.values(GenderEnum)).required(),
    role: joi.number().valid(...Object.values(RoleEnum)).required(),
    phone: joi.string().min(10).max(11),
  }),
}

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
}

export const resetPasswordSchema = {
  body: joi.object({
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  }),
}