import express from "express";
import { OrganizationController } from "../controller/organization-controller";
import { TYPES } from "../TYPES";
import container from "../inversify.config";

const router = express.Router();
const organizationController = container.get<OrganizationController>(TYPES.OrganizationController);

router.get("/", organizationController.listForSelection);

export default router;
