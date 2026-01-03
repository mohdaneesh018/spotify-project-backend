import express from "express";
import { getArtistBySlug } from "../controllers/artist.controller.js";

const router = express.Router();

router.get("/:slug", getArtistBySlug);

export default router;