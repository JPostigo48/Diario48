import "server-only";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ensureLegacyOwnershipMigration, resolveOwnerId } from "@/lib/auth/ownership";
import ResearchLayerRecordModel from "@/lib/models/ResearchLayerRecord";
import ResearchPaperRecordModel from "@/lib/models/ResearchPaperRecord";
import ResearchPaperCatalogRecordModel from "@/lib/models/ResearchPaperCatalogRecord";
import ResearchRelationRecordModel from "@/lib/models/ResearchRelationRecord";
import LegacyResearchWorkspaceModel from "@/lib/models/ResearchWorkspace";
import ResearchWorkspaceRecordModel from "@/lib/models/ResearchWorkspaceRecord";
import ResearchWorkspacePaperLinkRecordModel from "@/lib/models/ResearchWorkspacePaperLinkRecord";
import type { ResearchWorkspace, ResearchWorkspaceListItem } from "@/lib/research/types";
import { ensureWorkspaceShape, sortLayers } from "@/lib/research/utils";

type ResearchRepositoryContext = {
  ownerId?: string | null;
};

type WorkspacePaperSnapshot = {
  paperId: string;
  title: string;
  authors: string[];
  year?: number;
  venue: string;
  doi: string;
  paperUrl: string;
  pdfUrl: string;
  abstract: string;
  personalSummary: string;
  keywords: string[];
  generalCategory: string;
  subcategory: string;
  layerIds: string[];
  objective: string;
  methods: string[];
  datasets: string[];
  performanceMetrics: ResearchWorkspace["papers"][number]["performanceMetrics"];
  limitations: string[];
  futureChallenges: string[];
  researchUsefulness: string;
  personalNotes: string;
  structure: ResearchWorkspace["papers"][number]["structure"];
  workflowStatus: ResearchWorkspace["papers"][number]["workflowStatus"];
  selectionEvaluation: ResearchWorkspace["papers"][number]["selectionEvaluation"];
  synthesisPromotion: ResearchWorkspace["papers"][number]["synthesisPromotion"];
  analyticalClassification: ResearchWorkspace["papers"][number]["analyticalClassification"];
  readingStatus: ResearchWorkspace["papers"][number]["readingStatus"];
  priority: ResearchWorkspace["papers"][number]["priority"];
  createdAtText?: string;
  updatedAtText?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

function isWorkspacePaperSnapshot(
  value: WorkspacePaperSnapshot | null,
): value is WorkspacePaperSnapshot {
  return value !== null;
}

function normalizeDoi(doi?: string) {
  const normalized = doi?.trim().toLowerCase() ?? "";
  return normalized || undefined;
}

function toWorkspaceSummary(workspace: ResearchWorkspace): ResearchWorkspaceListItem {
  return {
    id: workspace.id ?? "",
    name: workspace.project.name,
    description: workspace.project.description,
    visibility: workspace.visibility,
    paperCount: workspace.papers.length,
    layerCount: workspace.layers.length,
    updatedAt: workspace.updatedAt,
  };
}

async function resolveResearchOwnerId(context?: ResearchRepositoryContext) {
  await ensureLegacyOwnershipMigration();
  return resolveOwnerId(context?.ownerId);
}

export async function getResearchWorkspaceById(
  workspaceId: string,
  context?: ResearchRepositoryContext,
) {
  await connectToDatabase();
  const ownerId = await resolveResearchOwnerId(context);

  const workspaceRecord = await ResearchWorkspaceRecordModel.findOne({
    _id: workspaceId,
    ownerId,
  }).lean();

  if (workspaceRecord) {
    const [layers, links, relations, legacyWorkspacePapers] = await Promise.all([
      ResearchLayerRecordModel.find({ workspaceId, ownerId }).sort({ order: 1, name: 1 }).lean(),
      ResearchWorkspacePaperLinkRecordModel.find({ workspaceId, ownerId })
        .sort({ updatedAt: -1 })
        .lean(),
      ResearchRelationRecordModel.find({ workspaceId, ownerId }).lean(),
      ResearchPaperRecordModel.find({ workspaceId, ownerId }).sort({ updatedAt: -1 }).lean(),
    ]);

    let papers: WorkspacePaperSnapshot[] = legacyWorkspacePapers.map((paper) => ({
      paperId: paper.paperId,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      venue: paper.venue,
      doi: paper.doi,
      paperUrl: paper.paperUrl,
      pdfUrl: paper.pdfUrl,
      abstract: paper.abstract,
      personalSummary: paper.personalSummary,
      keywords: paper.keywords,
      generalCategory: paper.generalCategory,
      subcategory: paper.subcategory,
      layerIds: paper.layerIds,
      objective: paper.objective,
      methods: paper.methods,
      datasets: paper.datasets,
      performanceMetrics: paper.performanceMetrics,
      limitations: paper.limitations,
      futureChallenges: paper.futureChallenges,
      researchUsefulness: paper.researchUsefulness,
      personalNotes: paper.personalNotes,
      structure: paper.structure,
      workflowStatus: paper.workflowStatus,
      selectionEvaluation: paper.selectionEvaluation,
      synthesisPromotion: paper.synthesisPromotion,
      analyticalClassification: paper.analyticalClassification,
      readingStatus: paper.readingStatus,
      priority: paper.priority,
      createdAtText: paper.createdAtText,
      updatedAtText: paper.updatedAtText,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    }));

    if (links.length > 0) {
      const catalogIds = Array.from(new Set(links.map((link) => link.paperRefId)));
      const catalogs = await ResearchPaperCatalogRecordModel.find({
        _id: { $in: catalogIds },
      }).lean();
      const catalogMap = new Map(catalogs.map((catalog) => [String(catalog._id), catalog]));

      papers = links
        .map<WorkspacePaperSnapshot | null>((link) => {
          const catalog = catalogMap.get(link.paperRefId);
          if (!catalog) {
            return null;
          }

          return {
            paperId: link.paperId,
            title: catalog.title,
            authors: catalog.authors,
            year: catalog.year,
            venue: catalog.venue,
            doi: catalog.doi,
            paperUrl: catalog.paperUrl,
            pdfUrl: catalog.pdfUrl,
            abstract: catalog.abstract,
            personalSummary: link.personalSummary,
            keywords: catalog.keywords,
            generalCategory: catalog.generalCategory,
            subcategory: catalog.subcategory,
            layerIds: link.layerIds,
            objective: catalog.objective,
            methods: catalog.methods,
            datasets: catalog.datasets,
            performanceMetrics: catalog.performanceMetrics,
            limitations: catalog.limitations,
            futureChallenges: catalog.futureChallenges,
            researchUsefulness: link.researchUsefulness,
            personalNotes: link.personalNotes,
            structure: catalog.structure,
            workflowStatus: link.workflowStatus,
            selectionEvaluation: link.selectionEvaluation,
            synthesisPromotion: link.synthesisPromotion,
            analyticalClassification: link.analyticalClassification,
            readingStatus: link.readingStatus,
            priority: link.priority,
            createdAtText: link.createdAtText || catalog.createdAtText,
            updatedAtText: link.updatedAtText || catalog.updatedAtText,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt,
          };
        })
        .filter(isWorkspacePaperSnapshot);
    }

    return ensureWorkspaceShape({
      id: String(workspaceRecord._id),
      visibility: workspaceRecord.visibility,
      project: {
        name: workspaceRecord.name,
        description: workspaceRecord.description,
        createdAt: workspaceRecord.createdAtText || workspaceRecord.createdAt?.toISOString(),
        updatedAt: workspaceRecord.updatedAtText || workspaceRecord.updatedAt?.toISOString(),
      },
      layers: sortLayers(
        layers.map((layer) => ({
          id: layer.layerId,
          name: layer.name,
          order: layer.order,
          description: layer.description,
          createdAt: layer.createdAtText || layer.createdAt?.toISOString(),
          updatedAt: layer.updatedAtText || layer.updatedAt?.toISOString(),
        })),
      ),
      papers: papers.map((paper) => ({
        id: paper.paperId,
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        venue: paper.venue,
        doi: paper.doi,
        paperUrl: paper.paperUrl,
        pdfUrl: paper.pdfUrl,
        abstract: paper.abstract,
        personalSummary: paper.personalSummary,
        keywords: paper.keywords,
        generalCategory: paper.generalCategory,
        subcategory: paper.subcategory,
        layerIds: paper.layerIds,
        objective: paper.objective,
        methods: paper.methods,
        datasets: paper.datasets,
        performanceMetrics: paper.performanceMetrics,
        limitations: paper.limitations,
        futureChallenges: paper.futureChallenges,
        researchUsefulness: paper.researchUsefulness,
        personalNotes: paper.personalNotes,
        structure: paper.structure,
        workflowStatus: paper.workflowStatus,
        selectionEvaluation: paper.selectionEvaluation,
        synthesisPromotion: paper.synthesisPromotion,
        analyticalClassification: paper.analyticalClassification,
        readingStatus: paper.readingStatus,
        priority: paper.priority,
        createdAt: paper.createdAtText || paper.createdAt?.toISOString(),
        updatedAt: paper.updatedAtText || paper.updatedAt?.toISOString(),
      })),
      relations: relations.map((relation) => ({
        id: relation.relationId,
        fromPaperId: relation.fromPaperId,
        toPaperId: relation.toPaperId,
        type: relation.type,
        note: relation.note,
      })),
      createdAt: workspaceRecord.createdAtText || workspaceRecord.createdAt?.toISOString(),
      updatedAt: workspaceRecord.updatedAtText || workspaceRecord.updatedAt?.toISOString(),
    });
  }

  const legacy = await LegacyResearchWorkspaceModel.findOne({ _id: workspaceId, ownerId }).lean();
  if (!legacy) {
    return null;
  }

  return ensureWorkspaceShape(
    ({ ...legacy, id: String(legacy._id) } as unknown) as Partial<ResearchWorkspace>,
  );
}

export async function getAccessibleResearchWorkspaceById(
  workspaceId: string,
  viewerOwnerId?: string | null,
) {
  await connectToDatabase();
  await ensureLegacyOwnershipMigration();

  const workspaceRecord = await ResearchWorkspaceRecordModel.findById(workspaceId).lean();

  if (workspaceRecord) {
    const ownerId = workspaceRecord.ownerId;
    const isOwner = Boolean(viewerOwnerId) && viewerOwnerId === ownerId;

    if (!isOwner && workspaceRecord.visibility !== "link-readonly") {
      return null;
    }

    const workspace = await getResearchWorkspaceById(workspaceId, { ownerId });

    if (!workspace) {
      return null;
    }

    return {
      workspace,
      accessMode: (isOwner ? "owner" : "readonly") as "owner" | "readonly",
      ownerId,
    };
  }

  const legacy = await LegacyResearchWorkspaceModel.findById(workspaceId).lean();

  if (!legacy) {
    return null;
  }

  const ownerId = legacy.ownerId;
  const visibility = legacy.visibility === "link-readonly" ? "link-readonly" : "private";
  const isOwner = Boolean(viewerOwnerId) && viewerOwnerId === ownerId;

  if (!isOwner && visibility !== "link-readonly") {
    return null;
  }

  const workspace = ensureWorkspaceShape(
    ({
      ...legacy,
      id: String(legacy._id),
      visibility,
    } as unknown) as Partial<ResearchWorkspace>,
  );

  return {
    workspace,
    accessMode: (isOwner ? "owner" : "readonly") as "owner" | "readonly",
    ownerId,
  };
}

export async function listResearchWorkspaces(context?: ResearchRepositoryContext) {
  await connectToDatabase();
  const ownerId = await resolveResearchOwnerId(context);

  const [workspaceRecords, legacyRecords] = await Promise.all([
    ResearchWorkspaceRecordModel.find({ ownerId }).sort({ updatedAt: -1 }).lean(),
    LegacyResearchWorkspaceModel.find({ ownerId }).sort({ updatedAt: -1 }).lean(),
  ]);

  const workspaceIds = workspaceRecords.map((item) => String(item._id));
  const normalizedSummaries = await Promise.all(
    workspaceIds.map(async (workspaceId) => {
      const workspace = await getResearchWorkspaceById(workspaceId, { ownerId });
      return workspace ? toWorkspaceSummary(workspace) : null;
    }),
  );

  const migratedIds = new Set(workspaceIds);
  const legacySummaries = legacyRecords
    .filter((item) => !migratedIds.has(String(item._id)))
    .map((item) =>
      toWorkspaceSummary(
        ensureWorkspaceShape(
          ({ ...item, id: String(item._id) } as unknown) as Partial<ResearchWorkspace>,
        ),
      ),
    );

  return [...normalizedSummaries.filter(Boolean), ...legacySummaries].sort((a, b) =>
    (b?.updatedAt || "").localeCompare(a?.updatedAt || ""),
  ) as ResearchWorkspaceListItem[];
}

export async function createResearchWorkspace(
  workspace: ResearchWorkspace,
  context?: ResearchRepositoryContext,
) {
  await connectToDatabase();
  const ownerId = await resolveResearchOwnerId(context);
  const normalized = ensureWorkspaceShape(workspace);
  const created = await ResearchWorkspaceRecordModel.create({
    ownerId,
    visibility: normalized.visibility,
    name: normalized.project.name,
    description: normalized.project.description,
    createdAtText: normalized.createdAt || normalized.project.createdAt,
    updatedAtText: normalized.updatedAt || normalized.project.updatedAt,
  });

  return replaceResearchWorkspace(String(created._id), normalized, { ownerId });
}

export async function replaceResearchWorkspace(
  workspaceId: string,
  workspace: ResearchWorkspace,
  context?: ResearchRepositoryContext,
) {
  await connectToDatabase();
  const ownerId = await resolveResearchOwnerId(context);
  const normalized = ensureWorkspaceShape(workspace);
  const now = new Date().toISOString();
  const existingLinks = await ResearchWorkspacePaperLinkRecordModel.find({
    workspaceId,
    ownerId,
  }).lean();
  const existingLinkMap = new Map(existingLinks.map((link) => [link.paperId, link]));

  const existingForeignWorkspace = await ResearchWorkspaceRecordModel.exists({ _id: workspaceId });
  const existingOwnedWorkspace = await ResearchWorkspaceRecordModel.exists({ _id: workspaceId, ownerId });

  if (existingForeignWorkspace && !existingOwnedWorkspace) {
    return null;
  }

  await ResearchWorkspaceRecordModel.findOneAndUpdate(
    { _id: workspaceId, ownerId },
    {
      ownerId,
      visibility: normalized.visibility,
      name: normalized.project.name,
      description: normalized.project.description,
      createdAtText: normalized.createdAt || normalized.project.createdAt || now,
      updatedAtText: now,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  await Promise.all([
    ResearchLayerRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchPaperRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchWorkspacePaperLinkRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchRelationRecordModel.deleteMany({ workspaceId, ownerId }),
  ]);

  if (normalized.layers.length > 0) {
    await ResearchLayerRecordModel.insertMany(
      normalized.layers.map((layer) => ({
        ownerId,
        workspaceId,
        layerId: layer.id,
        name: layer.name,
        order: layer.order,
        description: layer.description ?? "",
        createdAtText: layer.createdAt || now,
        updatedAtText: layer.updatedAt || now,
      })),
    );
  }

  if (normalized.papers.length > 0) {
    const paperLinksToInsert: Array<Record<string, unknown>> = [];

    for (const paper of normalized.papers) {
      const normalizedDoi = normalizeDoi(paper.doi);
      let catalogId: string | null = null;

      if (normalizedDoi) {
        const catalog = await ResearchPaperCatalogRecordModel.findOneAndUpdate(
          { normalizedDoi },
          {
            normalizedDoi,
            title: paper.title,
            authors: paper.authors,
            year: paper.year,
            venue: paper.venue,
            doi: paper.doi,
            paperUrl: paper.paperUrl,
            pdfUrl: paper.pdfUrl,
            abstract: paper.abstract,
            keywords: paper.keywords,
            generalCategory: paper.generalCategory,
            subcategory: paper.subcategory,
            objective: paper.objective,
            methods: paper.methods,
            datasets: paper.datasets,
            performanceMetrics: paper.performanceMetrics,
            limitations: paper.limitations,
            futureChallenges: paper.futureChallenges,
            structure: paper.structure,
            createdAtText: paper.createdAt || now,
            updatedAtText: paper.updatedAt || now,
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        ).lean();

        catalogId = catalog ? String(catalog._id) : null;
      } else {
        const existingLink = existingLinkMap.get(paper.id);
        if (existingLink?.paperRefId) {
          const updated = await ResearchPaperCatalogRecordModel.findByIdAndUpdate(
            existingLink.paperRefId,
            {
              title: paper.title,
              authors: paper.authors,
              year: paper.year,
              venue: paper.venue,
              doi: paper.doi,
              paperUrl: paper.paperUrl,
              pdfUrl: paper.pdfUrl,
              abstract: paper.abstract,
              keywords: paper.keywords,
              generalCategory: paper.generalCategory,
              subcategory: paper.subcategory,
              objective: paper.objective,
              methods: paper.methods,
              datasets: paper.datasets,
              performanceMetrics: paper.performanceMetrics,
              limitations: paper.limitations,
              futureChallenges: paper.futureChallenges,
              structure: paper.structure,
              updatedAtText: paper.updatedAt || now,
            },
            { new: true, runValidators: true },
          ).lean();
          catalogId = updated ? String(updated._id) : null;
        } else {
          const created = await ResearchPaperCatalogRecordModel.create({
            title: paper.title,
            authors: paper.authors,
            year: paper.year,
            venue: paper.venue,
            doi: paper.doi,
            paperUrl: paper.paperUrl,
            pdfUrl: paper.pdfUrl,
            abstract: paper.abstract,
            keywords: paper.keywords,
            generalCategory: paper.generalCategory,
            subcategory: paper.subcategory,
            objective: paper.objective,
            methods: paper.methods,
            datasets: paper.datasets,
            performanceMetrics: paper.performanceMetrics,
            limitations: paper.limitations,
            futureChallenges: paper.futureChallenges,
            structure: paper.structure,
            createdAtText: paper.createdAt || now,
            updatedAtText: paper.updatedAt || now,
          });
          catalogId = String(created._id);
        }
      }

      if (!catalogId) {
        throw new Error(`No se pudo persistir el catálogo para el paper "${paper.title}".`);
      }

      paperLinksToInsert.push({
        ownerId,
        workspaceId,
        paperId: paper.id,
        paperRefId: catalogId,
        layerIds: paper.layerIds,
        personalSummary: paper.personalSummary,
        researchUsefulness: paper.researchUsefulness,
        personalNotes: paper.personalNotes,
        workflowStatus: paper.workflowStatus,
        selectionEvaluation: paper.selectionEvaluation,
        synthesisPromotion: paper.synthesisPromotion,
        analyticalClassification: paper.analyticalClassification,
        readingStatus: paper.readingStatus,
        priority: paper.priority,
        createdAtText: paper.createdAt || now,
        updatedAtText: paper.updatedAt || now,
      });
    }

    await ResearchWorkspacePaperLinkRecordModel.insertMany(paperLinksToInsert);
  }

  if (normalized.relations.length > 0) {
    await ResearchRelationRecordModel.insertMany(
      normalized.relations.map((relation) => ({
        ownerId,
        workspaceId,
        relationId: relation.id,
        fromPaperId: relation.fromPaperId,
        toPaperId: relation.toPaperId,
        type: relation.type,
        note: relation.note ?? "",
      })),
    );
  }

  return getResearchWorkspaceById(workspaceId, { ownerId });
}

export async function deleteResearchWorkspace(
  workspaceId: string,
  context?: ResearchRepositoryContext,
) {
  await connectToDatabase();
  const ownerId = await resolveResearchOwnerId(context);
  await Promise.all([
    ResearchWorkspaceRecordModel.findOneAndDelete({ _id: workspaceId, ownerId }),
    ResearchLayerRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchPaperRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchWorkspacePaperLinkRecordModel.deleteMany({ workspaceId, ownerId }),
    ResearchRelationRecordModel.deleteMany({ workspaceId, ownerId }),
    LegacyResearchWorkspaceModel.findOneAndDelete({ _id: workspaceId, ownerId }),
  ]);
}
