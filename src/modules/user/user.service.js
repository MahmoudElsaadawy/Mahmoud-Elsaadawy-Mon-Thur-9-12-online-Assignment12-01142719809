import { OAuth2Client } from "google-auth-library";
import User from "../../DB/models/user.model.js";
import { providerEnum } from "../../utils/enums/user.enum.js";
import {
  badRequestException,
  conflictException,
  notFoundException,
  unauthorizedException,
} from "../../utils/responses/error.response.js";
import { successResponse } from "../../utils/responses/success.response.js";
import { encrypt } from "../../utils/security/encryption/encrypt.js";
import { compare } from "../../utils/security/hashing/compare.js";
import { hash } from "../../utils/security/hashing/hash.js";
import {
  generateToken,
  verifyToken,
} from "../../utils/security/token/token.js";
import {
  uploadFiles,
  allowedMimeTypes,
} from "../../utils/multer/uploadFiles.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { generateOtpHtml } from "../../utils/email/html.otp.template.js";
import { createOtp } from "../../utils/email/otp.js";
import { redisClient } from "../../bootstrap.js"
import { generateForgetPasswordHtml } from "../../utils/email/html.forgetPassword.template.js"

export const signUpService = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    role,
    phone,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    conflictException("User Already Exists");
  }
  const otp = createOtp();
  const userCreated = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: await hash(password),
    gender,
    role,
    phone: await encrypt(phone),
  });

  await redisClient.set(`Users:${userCreated._id}:otp:emailConfirmation`, otp, {
    expiration: {
      type: "ex",
      value: 5 * 60,
    }
  })
  
  sendEmail({
    to: userCreated.email,
    subject: "Confirm your email",
    html: generateOtpHtml(userCreated.firstName, otp),
  });

  successResponse({
    res,
    message: "User Created Successfully",
    data: userCreated,
  });
};

export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if(!user){
    badRequestException("User doesnt exist please sign up")
  }
  
  if (user.emailConfirmed) {
    badRequestException("Email already confirmed");
  }

  
  const userOtp = await redisClient.get(`Users:${user._id}:otp:emailConfirmation`)

  if(!userOtp || userOtp != otp){
    badRequestException("Invalid or expired otp")
  }

  user.emailConfirmed = true
  await user.save()
  await redisClient.del(`Users:${user._id}:otp:emailConfirmation`)

  successResponse({
    res,
    message: "Email confirmed Successfully",
  });
};

export const resendOtpService = async (req, res) => {
  const user = req.user

  if (user.emailConfirmed) {
    badRequestException("Email already confirmed");
  }

  const isOtpExist = await redisClient.get(`Users:${user._id}:otp:emailConfirmation`)
  
  if(isOtpExist){
    const ttl = await redisClient.TTL(`Users:${user._id}:otp:emailConfirmation`)
    badRequestException(`wait ${ttl} seconds to resend the otp`)
  }

  const otp = createOtp();

  await redisClient.set(`Users:${user._id}:otp:emailConfirmation`, otp, {
    expiration: {
      type: "ex",
      value: 5 * 60,
    }
  })

  sendEmail({
    to: user.email,
    subject: "Confirm your email",
    html: generateOtpHtml(user.firstName, otp),
  });

  successResponse({
    res,
    message: "Confirm email sent successfully",
  });
};

export const loginService = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    unauthorizedException("Invalid email or password");
  }

  if (user.provider > providerEnum.System) {
    badRequestException("use social login");
  }

  const matchedPassword = await compare(password, user.password);

  if (!matchedPassword) {
    unauthorizedException("Invalid email or password");
  }

  const accessToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "10m",
    },
  );

  const refreshToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );

  successResponse({
    res,
    message: "User logged in Successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
};

export const profileService = async (req, res) => {
  successResponse({
    res,
    message: "Done",
    data: req.user,
  });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.headers.authorization;
  let token = req.headers.authorization;
  if (!token.startsWith("Bearer")) {
    badRequestException("Invalid authentication method");
  }
  token = token.split(" ")[1];
  const tokenValidation = verifyToken(token, process.env.REFRESH_TOKEN);
  const user = await User.findById(tokenValidation._id);
  if (!user) {
    notFoundException("user not found");
  }

  const accessToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "10m",
    },
  );

  successResponse({
    res,
    data: accessToken,
  });
};

export const socialLogin = async (req, res) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, given_name: firstName, family_name: lastName } = payload;
  let user = await User.findOne({ email });
  if (user) {
    if (user.provider == providerEnum.System) {
      badRequestException("use system login");
    }
  } else {
    user = await User.create({
      firstName,
      lastName,
      email,
      username: `${firstName} ${lastName}`,
      emailConfirmed: true,
      provider: providerEnum.Google,
    });
  }

  const accessToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "10m",
    },
  );

  const refreshToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );

  successResponse({
    res,
    message: "User logged in Successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
};

export const handelPicsResponse = async (req, res) => {
  let type = "file";
  if (req.file != undefined) {
    req.user.profilePic = req.file.path;
  } else {
    type = "files";
    req.user.coverPics = req.files.map((ele) => ele.path);
  }
  await req.user.save();
  res.json(req[type]);
};

export const profilePicService = await uploadFiles({
  destination: "users/profilePics",
  fileValidation: allowedMimeTypes.imageMimeTypes,
  fileType: "file",
}).single("profileImage");

export const coverPicsService = uploadFiles({
  destination: "users/coverPics",
  fileValidation: allowedMimeTypes.imageMimeTypes,
  fileType: "files",
}).array("coverImages", 3);

export const forgetPasswordService = async(req, res)=> {
  const { email } = req.body
  const user = await User.findOne({email})
  if(!user){
    badRequestException("User doesnt exist please sign up")
  }

  const userResetToken = await redisClient.get(`Users:${user._id}:otp:passwordReset`)
  
  if(userResetToken){
    const ttl = await redisClient.TTL(`Users:${user._id}:otp:passwordReset`)
    badRequestException(`wait ${ttl} seconds before requesting the email again`)
  }

  const resetToken = await generateToken(
    {
      _id: user.id,
      email: user.email,
    },
    process.env.FORGET_PASSWORD_TOKEN,
    {
      expiresIn: "10m",
    },
  );
  await redisClient.set(`Users:${user._id}:otp:passwordReset`, resetToken, {
    expiration: {
      type: "ex",
      value: 10 * 60,
    }
  })
  
  const link = `${process.env.BASE_URL}${process.env.PORT}/users/reset-password/${resetToken}`

  sendEmail({
    to: user.email,
    subject: "Password reset",
    html: generateForgetPasswordHtml(user.firstName, link),
  });

  successResponse({
    res,
    message: "Password reset email sent successfully",
    data:{
      message: "Dont forget to check the html page that i made too",
      forgetPasswordToken: resetToken,
    }
  })
}

export const resetPasswordService = async(req, res)=> {
  const { token } = req.params
  const { password } = req.body
  const tokenValidation = verifyToken(token, process.env.FORGET_PASSWORD_TOKEN);
  const user = await User.findById(tokenValidation._id);
  if (!user) {
    notFoundException("user not found");
  }

  const userResetToken = await redisClient.get(`Users:${user._id}:otp:passwordReset`)
  if (userResetToken != token){
    badRequestException("invalid or expired link please request another one")
  }

  await redisClient.del(`Users:${user._id}:otp:passwordReset`)
  user.password = await hash(password)
  await user.save()

  successResponse({
    res,
    message: "Password changed successfully",
  })
}
