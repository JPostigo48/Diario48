import "server-only";
import mongoose, { Model, Schema } from "mongoose";
import type {
  MusicProviderCredentialProvider,
  MusicProviderCredentialStatus,
} from "@/lib/music-tracker/types";

const MusicProviderCredentialSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true, trim: true },
    provider: {
      type: String,
      required: true,
      enum: ["ytmusic"],
      trim: true,
    },
    encryptedSecret: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["configured", "valid", "invalid", "needs-refresh"],
      default: "configured",
      trim: true,
    },
    lastValidatedAt: { type: Date, required: false },
    lastSyncAt: { type: Date, required: false },
    lastError: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    collection: "music_tracker_provider_credentials_v1",
  },
);

MusicProviderCredentialSchema.index({ ownerId: 1, provider: 1 }, { unique: true });

export interface MusicProviderCredentialDocument extends mongoose.Document {
  ownerId: string;
  provider: MusicProviderCredentialProvider;
  encryptedSecret: string;
  status: MusicProviderCredentialStatus;
  lastValidatedAt?: Date;
  lastSyncAt?: Date;
  lastError: string;
  createdAt: Date;
  updatedAt: Date;
}

const MusicProviderCredentialModel =
  (mongoose.models.MusicProviderCredential as Model<MusicProviderCredentialDocument> | undefined) ??
  mongoose.model<MusicProviderCredentialDocument>(
    "MusicProviderCredential",
    MusicProviderCredentialSchema,
  );

export default MusicProviderCredentialModel;
