import { Response } from "express";
import { Types } from "mongoose";
import { getAuthOrganizationId, AuthRequest } from "../middleware/auth-middleware";
import { FeatureFlagModal } from "../infrastructure/models/feature-flag-model";

const normalizeFeatureKey = (value: unknown) => String(value || "").trim().toLowerCase();

export class FeatureFlagController {
    list = async (req: AuthRequest, res: Response) => {
        try {
            const organization = getAuthOrganizationId(req, res);
            if (!organization) return;

            const flags = await FeatureFlagModal.find({ organization }).sort({ createdAt: -1 });
            res.status(200).json({ flags });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: AuthRequest, res: Response) => {
        try {
            const organization = getAuthOrganizationId(req, res);
            if (!organization) return;

            const featureKey = normalizeFeatureKey(req.body.featureKey);
            const enabled = Boolean(req.body.enabled);
            if (!featureKey) {
                return res.status(400).json({ message: "Feature key is required" });
            }

            const flag = await FeatureFlagModal.create({ featureKey, enabled, organization });
            res.status(201).json({ message: "Feature flag created", flag });
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
                return res.status(409).json({ message: "Feature key already exists" });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    };

    update = async (req: AuthRequest, res: Response) => {
        try {
            const organization = getAuthOrganizationId(req, res);
            if (!organization) return;
            const flagId = req.params.id;
            if (typeof flagId !== "string" || !Types.ObjectId.isValid(flagId)) {
                return res.status(400).json({ message: "Invalid feature flag" });
            }

            const featureKey = normalizeFeatureKey(req.body.featureKey);
            const update: { featureKey?: string; enabled?: boolean } = {};
            if (featureKey) update.featureKey = featureKey;
            if (typeof req.body.enabled === "boolean") update.enabled = req.body.enabled;

            if (!Object.keys(update).length) {
                return res.status(400).json({ message: "No changes provided" });
            }

            const flag = await FeatureFlagModal.findOneAndUpdate(
                { _id: new Types.ObjectId(flagId), organization },
                update,
                { returnDocument: "after", runValidators: true }
            );

            if (!flag) {
                return res.status(404).json({ message: "Feature flag not found" });
            }

            res.status(200).json({ message: "Feature flag updated", flag });
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
                return res.status(409).json({ message: "Feature key already exists" });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    };

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const organization = getAuthOrganizationId(req, res);
            if (!organization) return;
            const flagId = req.params.id;
            if (typeof flagId !== "string" || !Types.ObjectId.isValid(flagId)) {
                return res.status(400).json({ message: "Invalid feature flag" });
            }

            const flag = await FeatureFlagModal.findOneAndDelete({
                _id: new Types.ObjectId(flagId),
                organization,
            });

            if (!flag) {
                return res.status(404).json({ message: "Feature flag not found" });
            }

            res.status(200).json({ message: "Feature flag deleted" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    check = async (req: AuthRequest, res: Response) => {
        try {
            const organization = getAuthOrganizationId(req, res);
            if (!organization) return;

            const featureKey = normalizeFeatureKey(req.body.featureKey);
            if (!featureKey) {
                return res.status(400).json({ message: "Feature key is required" });
            }

            const flag = await FeatureFlagModal.findOne({ organization, featureKey });
            res.status(200).json({
                featureKey,
                enabled: Boolean(flag?.enabled),
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
