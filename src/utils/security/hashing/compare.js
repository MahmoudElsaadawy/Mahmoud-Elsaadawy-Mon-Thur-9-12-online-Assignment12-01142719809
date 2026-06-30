import bcrypt from "bcrypt"

export const compare = async(data, hashedData)=> {
  return await bcrypt.compare(data, hashedData)
}