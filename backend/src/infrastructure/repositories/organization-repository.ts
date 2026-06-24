import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { IOrganizationRepository } from "../../domain/repositories/organization-repository";
import { IOrganizationModel, OrganizationModal } from "../models/organization-model";

@injectable()
export class OrganizationRepository implements IOrganizationRepository {
    async create(name: string): Promise<IOrganizationModel> {
        return OrganizationModal.create({ name });
    }

    async findById(id: string): Promise<IOrganizationModel | null> {
        return OrganizationModal.findById(id);
    }

    async findByNameCaseInsensitive(name: string): Promise<IOrganizationModel | null> {
        return OrganizationModal.findOne({
            name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        });
    }

    async listForSelection(): Promise<IOrganizationModel[]> {
        return OrganizationModal.find().sort({ createdAt: -1 }).select("_id name createdAt");
    }

    async listForSuperAdmin(): Promise<Array<{ _id: Types.ObjectId; name: string; createdAt: Date; adminCount: number }>> {
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

        return OrganizationModal.aggregate(pipeline);
    }
}
