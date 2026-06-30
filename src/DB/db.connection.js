import { createClient } from "redis"
import mongoose from "mongoose"

export const connectRedis = async()=> {
  const client = await createClient({
    url: process.env.REDIS_URI || "redis://127.0.0.1:6379",
  })

  client.on("connect", () => console.log("redis connected successfully"));
  client.on("error", (e) => console.log("can not connect to redis", e));

  return client
}

export const connectDB = async()=> {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: "Assignment12"
    })
    console.log("connected to DB successfully", mongoose.connection.host)
  } catch (e){
    console.log("can not connect to db: " + e)
  }
}

