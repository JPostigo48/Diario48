import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import { ensureDefaultUserExists } from "@/lib/auth/users";
import GraphModel from "@/lib/models/Graph";
import LegacyResearchWorkspaceModel from "@/lib/models/ResearchWorkspace";
import ResearchLayerRecordModel from "@/lib/models/ResearchLayerRecord";
import ResearchPaperRecordModel from "@/lib/models/ResearchPaperRecord";
import ResearchRelationRecordModel from "@/lib/models/ResearchRelationRecord";
import ResearchWorkspacePaperLinkRecordModel from "@/lib/models/ResearchWorkspacePaperLinkRecord";
import ResearchWorkspaceRecordModel from "@/lib/models/ResearchWorkspaceRecord";

export async function getBootstrapOwnerId() {
  const defaultUser = await ensureDefaultUserExists();
  return String(defaultUser._id);
}

export async function resolveOwnerId(ownerId?: string | null) {
  if (ownerId?.trim()) {
    return ownerId;
  }

  return getBootstrapOwnerId();
}

export async function ensureLegacyOwnershipMigration() {
  await connectToDatabase();

  const bootstrapOwnerId = await getBootstrapOwnerId();
  const missingOwnerFilter = {
    $or: [{ ownerId: { $exists: false } }, { ownerId: null }, { ownerId: "" }],
  };
  const missingVisibilityFilter = {
    $or: [{ visibility: { $exists: false } }, { visibility: null }, { visibility: "" }],
  };

  await Promise.all([
    GraphModel.updateMany(missingOwnerFilter, { $set: { ownerId: bootstrapOwnerId } }).exec(),
    GraphModel.updateMany(
      {
        $and: [missingVisibilityFilter, { isPublic: true }],
      },
      { $set: { visibility: "link-readonly" } },
    ).exec(),
    GraphModel.updateMany(
      {
        $and: [
          missingVisibilityFilter,
          { $or: [{ isPublic: { $exists: false } }, { isPublic: false }, { isPublic: null }] },
        ],
      },
      { $set: { visibility: "private" } },
    ).exec(),
    ResearchWorkspaceRecordModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    ResearchWorkspaceRecordModel.updateMany(missingVisibilityFilter, {
      $set: { visibility: "private" },
    }).exec(),
    ResearchLayerRecordModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    ResearchPaperRecordModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    ResearchWorkspacePaperLinkRecordModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    ResearchRelationRecordModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    LegacyResearchWorkspaceModel.updateMany(missingOwnerFilter, {
      $set: { ownerId: bootstrapOwnerId },
    }).exec(),
    LegacyResearchWorkspaceModel.updateMany(missingVisibilityFilter, {
      $set: { visibility: "private" },
    }).exec(),
  ]);
}
