import jwt from "jsonwebtoken"

export const generateToken = async(payload, sign, options={})=> {
  const token = await jwt.sign(payload, sign, options)
  return token
}

export const verifyToken = (token,sign)=> {
  const verify = jwt.verify(token, sign)
  return verify
}