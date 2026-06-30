import { Router } from "express";
import { auth, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/valdation.middleware.js";
import { loginSchema, signUpSchema, resetPasswordSchema } from "../user/user.validation.js";
import { uploadFiles, allowedMimeTypes } from "../../utils/multer/uploadFiles.js";
import { loginService, confirmEmail , resendResetPasswordService, resendOtpService, resetPasswordService, profileService, refreshToken, signUpService, socialLogin, profilePicService, coverPicsService, handelPicsResponse } from "./user.service.js";

const router = Router()

router.post("/signup", validation(signUpSchema),signUpService)
router.patch("/confirm-email", confirmEmail)
router.patch("/resend-confirm-mail-otp", auth, resendOtpService)
router.post("/login", validation(loginSchema), loginService)
router.post("/refresh-token", refreshToken)
router.post("/social-login", socialLogin)
router.patch("/reset-password", validation(resetPasswordSchema), resetPasswordService)
router.patch("/resend-reset-password-otp", resendResetPasswordService)
router.patch("/profile-pic", auth, profilePicService, handelPicsResponse)
router.patch("/cover-pics", auth, coverPicsService, handelPicsResponse)
router.get("/profile", auth, authorization(0), profileService)


export default router