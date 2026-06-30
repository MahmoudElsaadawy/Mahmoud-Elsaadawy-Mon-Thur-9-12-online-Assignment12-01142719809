import CryptoJS from "crypto-js"

export const encrypt = (data)=> {
  const encryptedData = CryptoJS.AES.encrypt(data, process.env.ENC_KEY)

  return encryptedData.toString()
}

export const decrypt = (encryptedData)=> {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.ENC_KEY)

  return decryptedData.toString(CryptoJS.enc.Utf8)
}