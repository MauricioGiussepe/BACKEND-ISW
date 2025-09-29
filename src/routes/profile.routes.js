import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPublicProfile,
  getPrivateProfile,
  updatePrivateProfile,
  deletePrivateProfile,
  getAllUsers,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/public", getPublicProfile);

router.get("/private", authMiddleware, getPrivateProfile);

router.patch("/privateupdt", authMiddleware, updatePrivateProfile);
router.delete("/privatedel", authMiddleware, deletePrivateProfile);

router.get("/all", authMiddleware, getAllUsers);

export default router;
