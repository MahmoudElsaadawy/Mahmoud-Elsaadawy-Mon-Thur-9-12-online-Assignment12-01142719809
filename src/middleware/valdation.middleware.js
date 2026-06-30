import { badRequestException } from "../utils/responses/error.response.js";


export const validation = (schema) => {
  return (req, res, next) => {
    const reqData = Object.keys(schema);
    const validationErrors = [];
    reqData.map(ele => {
        const validationRes = schema[ele].validate(req[ele], { abortEarly: false    });
        if (validationRes.error) {
          validationErrors.push(validationRes.error);
        }
      })
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.flatMap(err=> err.details.map(detail=> detail.message))
      badRequestException(errorMessages.join());
    }
    next();
  };
};
