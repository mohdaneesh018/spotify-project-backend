import { Router } from "express";
import authRouter from "./auth.routes.js";
import sellerRoutes from "./seller.routes.js";
import songRouter from "./song.routes.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/seller", sellerRoutes);
mainRouter.use("/songs", songRouter);

export default mainRouter;