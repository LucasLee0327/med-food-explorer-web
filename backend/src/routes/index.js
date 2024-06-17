import express from "express";
import {glob} from "glob";
import users from "./api/v1/users/index.js";
import csrfToken from "./api/v1/csrf-token/index.js";
import isLoggedIn from "./api/v1/login/index.js";
import sessionStatus from "./api/v1/session/index.js";
import messages from "./api/v1/posts/index.js";
import responseMessage from "./api/v1/GPT/index.js";

const rootRouter = express.Router();

rootRouter.use("/api/v1/users", users)
rootRouter.use("/api/v1/csrf-token", csrfToken)
rootRouter.use("/api/v1/login", isLoggedIn)
rootRouter.use("/api/v1/session", sessionStatus)
rootRouter.use("/api/v1/posts", messages)
rootRouter.use("/api/v1/GPT", responseMessage)
/*
rootRouter.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
});
*/
export default rootRouter;
