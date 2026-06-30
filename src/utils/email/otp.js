import crypto from "crypto"

export const createOtp = ()=> {
  return crypto.randomInt(100000, 1000000)
}