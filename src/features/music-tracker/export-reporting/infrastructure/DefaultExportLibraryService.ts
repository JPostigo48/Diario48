import type {
  ExportLibraryPort,
  ExportLibraryRequest,
  ExportLibraryResult,
} from "@/features/music-tracker/export-reporting/application/ports/ExportLibraryPort";

export class DefaultExportLibraryService implements ExportLibraryPort {
  async exportLibrary(request: ExportLibraryRequest): Promise<ExportLibraryResult> {
    if (request.format === "json") {
      return {
        fileName: "music-tracker-library.json",
        mimeType: "application/json; charset=utf-8",
        content: JSON.stringify(request.snapshot, null, 2),
      };
    }

    if (request.format === "csv") {
      return {
        fileName: "music-tracker-library.csv",
        mimeType: "text/csv; charset=utf-8",
        content: buildSongsCsv(request.snapshot.songs),
      };
    }

    return {
      fileName: "music-tracker-library.xls",
      mimeType: "application/vnd.ms-excel; charset=utf-8",
      content: buildExcelHtml(request.snapshot.songs),
    };
  }
}

function buildSongsCsv(
  songs: import("@/lib/music-tracker/types").Song[],
) {
  const rows = [
    [
      "id",
      "canonicalTitle",
      "canonicalArtist",
      "manualTitle",
      "manualArtist",
      "organizationState",
      "reviewState",
      "metadataConfidence",
      "duplicateStatus",
      "isRealFavorite",
      "rating",
      "automaticTags",
      "personalTags",
    ],
    ...songs.map((song) => [
      song.id ?? "",
      song.canonicalTitle,
      song.canonicalArtist,
      song.manualTitle,
      song.manualArtist,
      song.organizationState,
      song.reviewState,
      song.metadataConfidence,
      song.duplicateStatus,
      String(song.isRealFavorite),
      song.rating ? String(song.rating) : "",
      song.tags.automaticTags.join("|"),
      song.tags.personalTags.join("|"),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
}

function buildExcelHtml(
  songs: import("@/lib/music-tracker/types").Song[],
) {
  const headerCells = [
    "Título",
    "Artista",
    "Estado",
    "Revisión",
    "Metadata",
    "Duplicado",
    "Rating",
  ]
    .map((title) => `<th>${escapeHtml(title)}</th>`)
    .join("");

  const bodyRows = songs
    .map(
      (song) => `<tr>
        <td>${escapeHtml(song.canonicalTitle)}</td>
        <td>${escapeHtml(song.canonicalArtist)}</td>
        <td>${escapeHtml(song.organizationState)}</td>
        <td>${escapeHtml(song.reviewState)}</td>
        <td>${escapeHtml(song.metadataConfidence)}</td>
        <td>${escapeHtml(song.duplicateStatus)}</td>
        <td>${escapeHtml(song.rating ? String(song.rating) : "")}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Music Tracker Export</title>
    </head>
    <body>
      <table border="1">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </body>
  </html>`;
}

function escapeCsvValue(value: string) {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
