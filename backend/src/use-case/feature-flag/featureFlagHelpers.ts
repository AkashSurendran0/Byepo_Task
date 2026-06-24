import { Types } from "mongoose";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";

export const normalizeFeatureKey = (value: unknown) => String(value || "").trim().toLowerCase();

export const validateOrganizationAccess = (organizationId?: string): UseCaseResponse<Record<string, unknown>> | null => {
    if (!organizationId || !Types.ObjectId.isValid(organizationId)) {
        return { status: 403, body: { message: "Organization access is required" } };
    }

    return null;
}

export const isDuplicateKeyError = (error: unknown) =>
    typeof error === "object" && error !== null && "code" in error && error.code === 11000;
