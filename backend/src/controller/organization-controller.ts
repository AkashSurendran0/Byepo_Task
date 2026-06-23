import { Request, Response } from "express";
import { PipelineStage, Types } from "mongoose";
import { OrganizationModal } from "../infrastructure/models/organization-model";

export class OrganizationController {
    listForSelection = async (_req: Request, res: Response) => {
        try {
            const organizations = await OrganizationModal.find()
                .sort({ createdAt: -1 })
                .select("_id name createdAt");

            res.status(200).json({ organizations });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    listForSuperAdmin = async (_req: Request, res: Response) => {
        try {
            const pipeline: PipelineStage[] = [
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "users",
                        let: { organizationId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$organization", "$$organizationId"] },
                                            { $eq: ["$role", "organization_admin"] },
                                        ],
                                    },
                                },
                            },
                            { $count: "count" },
                        ],
                        as: "adminCounts",
                    },
                },
                {
                    $project: {
                        name: 1,
                        createdAt: 1,
                        adminCount: {
                            $ifNull: [{ $arrayElemAt: ["$adminCounts.count", 0] }, 0],
                        },
                    },
                },
            ];

            const organizations = await OrganizationModal.aggregate(pipeline);
            res.status(200).json({ organizations });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const name = String(req.body.name || "").trim();
            if (!name) {
                return res.status(400).json({ message: "Organization name is required" });
            }

            const existing = await OrganizationModal.findOne({
                name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
            });
            if (existing) {
                return res.status(409).json({ message: "Organization already exists" });
            }

            const organization = await OrganizationModal.create({ name });
            res.status(201).json({ message: "Organization created", organization });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    findById = async (id: string) => {
        if (!Types.ObjectId.isValid(id)) return null;
        return OrganizationModal.findById(id);
    };
}
