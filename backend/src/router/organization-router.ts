import express from "express";
import { OrganizationController } from "../controller/organization-controller";

const router = express.Router();
const organizationController = new OrganizationController();

router.get("/", organizationController.listForSelection);

export default router;
