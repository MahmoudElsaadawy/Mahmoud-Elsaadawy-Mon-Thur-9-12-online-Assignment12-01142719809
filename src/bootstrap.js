import cors from "cors";
import { globalErrorHandler } from ".//utils/responses/error.response.js";
import { connectDB, connectRedis } from "./DB/db.connection.js";
import userRouter from "./modules/user/user.controller.js";

export const redisClient = await connectRedis()

export const bootstrap = async (express, app) => {
  app.use(express.json());
  app.use("/uploads", express.static("./uploads"))
  app.use(cors())
  await connectDB();
  await redisClient.connect()

  app.use(express.json());

  app.use("/users", userRouter);

  app.all("/*all", (req, res) => {
    return res
      .status(404)
      .json({ success: false, message: "this route does not exist" });
  });

  app.use(globalErrorHandler);
};
