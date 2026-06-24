import express from "express";
import { AuthController } from "../controller/auth-controller";
import { FeatureFlagController } from "../controller/feature-flag-controller";
import { requireAuth } from "../middleware/auth-middleware";
import container from "../inversify.config";
import { TYPES } from "../TYPES";

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);
const featureFlagController = container.get<FeatureFlagController>(TYPES.FeatureFlagController);

router.post("/signup", authController.signup("organization_admin"));
router.post("/login", authController.login("organization_admin"));

router.get("/feature-flags", requireAuth("organization_admin"), featureFlagController.list);
router.post("/feature-flags", requireAuth("organization_admin"), featureFlagController.create);
router.put("/feature-flags/:id", requireAuth("organization_admin"), featureFlagController.update);
router.delete("/feature-flags/:id", requireAuth("organization_admin"), featureFlagController.delete);

export default router;
