import express from "express";
import {glob} from "glob";
import foods from "./api/v1/foods/index.js";
import csrfToken from "./api/v1/csrf-token/index.js";

const rootRouter = express.Router();

rootRouter.use("/api/v1/foods", foods)
rootRouter.use("/api/v1/csrf-token", csrfToken)

export default rootRouter;
