import express from "express";
import {
  getAllHerbs,
  getHerbById,
  getHerbBySlug,
  createHerb,
  updateHerb,
  deleteHerb
} from "../controllers/herbController.js";

const router = express.Router();

// GET /api/herbs - Get all herbs
router.get("/", getAllHerbs);

// GET /api/herbs/slug/:slug - Get single herb by slug
router.get("/slug/:slug", getHerbBySlug);

// GET /api/herbs/:id - Get single herb by id
router.get("/:id", getHerbById);

// POST /api/herbs - Create new herb
router.post("/", createHerb);

// PUT /api/herbs/:id - Update herb
router.put("/:id", updateHerb);

// DELETE /api/herbs/:id - Delete herb
router.delete("/:id", deleteHerb);

export default router;
