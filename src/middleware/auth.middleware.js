import { verifyToken } from "../utils/security/token/token.js";
import User from "../DB/models/user.model.js"
import { unauthorizedException, notFoundException } from "../utils/responses/error.response.js";

export const auth = async(req, res, next)=> {
  const authorization = req.headers.authorization
  if (!authorization.startsWith("Bearer")) {
    badRequestException("Invalid authentication method");
  }
  let token = req.headers.authorization;
  token = token.split(" ")[1];
  const tokenValidation = verifyToken(token, process.env.ACCESS_TOKEN);
  const user = await User.findById(tokenValidation._id);
  if (!user) {
    notFoundException("user not found");
  }
  req.user = user
  next()
}

export const authorization = (roles=0)=>{ 
  return async(req, res, next)=> {
    if (typeof(roles) == "object"){
      if(!roles.includes(req.user.role)){
      unauthorizedException("You are not authorized")
      }
    }
    if(req.user.role < roles){
      unauthorizedException("You are not authorized")
    }
    next()
  }
}