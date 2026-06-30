import bcrypt from "bcrypt"

export const hash = async(data)=> {
  const hashedValue = await bcrypt.hash(data, 8)
  
  return hashedValue
}

