import fs from "fs/promises"
import multer, { diskStorage } from "multer"
import crypto from "crypto"

export const allowedMimeTypes = {
  imageMimeTypes: [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/bmp",
  "image/vnd.microsoft.icon",
  "image/x-icon",
  "image/apng",
  ],
  videoMimeTypes: [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/3gpp",
  "video/3gpp2",
  "video/mp2t",
  "video/x-flv",
  "video/x-ms-wm",
  ]
}

export const uploadFiles = ({
  destination = "general",
  fileSize = 3 * 1024 * 1024,
  fileValidation = allowedMimeTypes.imageMimeTypes,
  fileType = "file",
  fileTypeTmp = fileType
  })=> {
    const storage = diskStorage({
      destination: async(req, fileType, cb)=> {
        const folderName = `./uploads/${destination}`
        try{
          await fs.access(folderName)
        } catch (e) {
          await fs.mkdir(folderName, {
            recursive: true,
          })
        }
        cb(null, folderName)
      },
      filename: async(req, fileType, cb)=> {
      const fileExtention = fileType.mimetype.split("/")[1]
      if (fileTypeTmp == "file"){
        const folderInfo = await fs.readdir(`./uploads/${destination}`)
        const avatarFile = folderInfo.find(file => file.split(".")[0] == req.user._id)
        return cb(null, `${req.user._id}.${fileExtention}`)
      }
      return cb(null, `${crypto.randomInt(1, 100000000)}.${fileExtention}`)
    },
  })
  const fileFilter = (req, fileType, cb)=> {
    if (!fileValidation.includes(fileType.mimetype)){
      cb(new Error ("file type not allowed"), false)
    }
    cb(null, true)
  }

  return multer({
  storage,
  limits:{fileSize},
  fileFilter,
})}