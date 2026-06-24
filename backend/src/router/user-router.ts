import express from "express";
import { AuthController } from "../controller/auth-controller";
import { FeatureFlagController } from "../controller/feature-flag-controller";
import { requireAuth } from "../middleware/auth-middleware";
import container from "../inversify.config";
import { TYPES } from "../TYPES";

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);
const featureFlagController = container.get<FeatureFlagController>(TYPES.FeatureFlagController);

router.post("/signup", authController.signup("end_user"));
router.post("/login", authController.login("end_user"));
router.post("/check-feature", requireAuth("end_user"), featureFlagController.check);

export default router;
