"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AuthStatusControls from "@/components/auth/AuthStatusControls";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import ToolTopbar from "@/components/ui/ToolTopbar";
import { useThemeMode } from "@/components/ui/useThemeMode";
import type {
  MusicProviderCredentialSummary,
  Song,
  SongReviewTask,
} from "@/lib/music-tracker/types";

type DashboardResponse = {
  totalImportedSongs: number;
  totalUniqueSongs: number;
  pendingReviewSongs: number;
  possibleDuplicateSongs: number;
  metadataDoubtfulSongs: number;
  importedPlaylists: number;
  topArtists: Array<{ artist: string; count: number }>;
  topGenres: Array<{ genre: string; count: number }>;
  ratedSongsCount: number;
  averageRating: number;
  realFavoritesCount: number;
  songsWithPersonalNoteCount: number;
  healthSummary: {
    totalSongs: number;
    byOrganizationState: Record<string, number>;
    byMetadataConfidence: Record<string, number>;
    byDuplicateStatus: Record<string, number>;
    byReviewState: Record<string, number>;
  };
  pendingReviewTasks: number;
};

type SongDetailResponse = {
  song: Song;
  importedTracks: Array<{
    id?: string;
    originalTitle: string;
    normalizedTitle: string;
    originalVisibleArtist: string;
    normalizedArtist: string;
    originalUrl: string;
  }>;
  occurrences: Array<{
    id?: string;
    positions: number[];
    duplicateWithinPlaylist: boolean;
    playlist?: {
      id?: string;
      originalName: string;
    } | null;
  }>;
  reviewTasks: SongReviewTask[];
  duplicateCases: Array<{
    id?: string;
    status: string;
    suspicionScore: number;
    reasons: string[];
    decisionNotes: string;
  }>;
};

type YtMusicSourceSummary = {
  provider: "ytmusic";
  sourceRef: string;
  sourceKind: "liked-songs" | "playlist";
  externalPlaylistId: string;
  title: string;
  description: string;
  itemCount?: number;
  sourceUrl: string;
  thumbnails: Array<{ url: string; width?: number; height?: number }>;
};

type YtMusicSyncResponse = {
  mode: "all" | "likes" | "playlists";
  syncedSources: Array<{
    sourceRef: string;
    title: string;
    importedTracks: number;
    songs: number;
  }>;
  failedSources: Array<{
    sourceRef: string;
    title: string;
    error: string;
  }>;
  totalImportedTracks: number;
  totalSongs: number;
  syncedAt: string;
};

type YtMusicSearchTrackSummary = {
  provider: "ytmusic";
  externalTrackId: string;
  title: string;
  artists: string[];
  artistDisplayName: string;
  albumName: string;
  durationText: string;
  sourceUrl: string;
  thumbnails: Array<{ url: string; width?: number; height?: number }>;
};

type ViewMode = "dashboard" | "library" | "review" | "reports";
type ToastTone = "success" | "error";

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

export default function MusicTrackerPage() {
  const { theme, toggleTheme } = useThemeMode();
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [reviewTasks, setReviewTasks] = useState<SongReviewTask[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSongDetail, setSelectedSongDetail] = useState<SongDetailResponse | null>(null);
  const [searchText, setSearchText] = useState("");
  const [duplicateFilter, setDuplicateFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [metadataFilter, setMetadataFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((tone: ToastTone, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((currentToasts) => [...currentToasts, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const notifySuccess = useCallback((message: string) => addToast("success", message), [addToast]);
  const notifyError = useCallback((message: string) => addToast("error", message), [addToast]);

  const applySongUpdate = (updatedSong: Song) => {
    setSongs((currentSongs) => {
      const nextSongs = currentSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song));
      setDashboard((currentDashboard) =>
        currentDashboard
          ? {
              ...currentDashboard,
              ratedSongsCount: nextSongs.filter((song) => typeof song.rating === "number").length,
              averageRating: calculateAverageRating(nextSongs),
              realFavoritesCount: nextSongs.filter((song) => song.isRealFavorite).length,
              songsWithPersonalNoteCount: nextSongs.filter(
                (song) => song.personalNote.trim().length > 0,
              ).length,
            }
          : currentDashboard,
      );
      return nextSongs;
    });
    setSelectedSongDetail((currentDetail) =>
      currentDetail && currentDetail.song.id === updatedSong.id
        ? {
            ...currentDetail,
            song: updatedSong,
          }
        : currentDetail,
    );
  };

  useEffect(() => {
    const boot = async () => {
      try {
        setIsLoading(true);
        const [dashboardResult, songsResult, tasksResult] = await Promise.all([
          fetchJson<DashboardResponse>("/api/music-tracker/dashboard"),
          fetchJson<Song[]>("/api/music-tracker/songs"),
          fetchJson<SongReviewTask[]>("/api/music-tracker/review-tasks?status=pending"),
        ]);

        setDashboard(dashboardResult);
        setSongs(songsResult);
        setReviewTasks(tasksResult);
        setSelectedSongId(songsResult[0]?.id ?? null);
        if (!songsResult[0]?.id) {
          setSelectedSongDetail(null);
        }
      } catch (error) {
        notifyError(error instanceof Error ? error.message : "No se pudo cargar Music Tracker.");
      } finally {
        setIsLoading(false);
      }
    };

    void boot();
  }, [notifyError]);

  useEffect(() => {
    if (!selectedSongId) {
      return;
    }

    const loadDetail = async () => {
      try {
        const detail = await fetchJson<SongDetailResponse>(`/api/music-tracker/songs/${selectedSongId}`);
        setSelectedSongDetail(detail);
      } catch (error) {
        notifyError(
          error instanceof Error ? error.message : "No se pudo cargar el detalle de la canción.",
        );
      }
    };

    void loadDetail();
  }, [notifyError, selectedSongId]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch =
        !searchText.trim() ||
        [song.canonicalTitle, song.canonicalArtist, song.manualTitle, song.manualArtist]
          .join(" ")
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());

      const matchesOrganization =
        !organizationFilter || song.organizationState === organizationFilter;

      const matchesDuplicate = !duplicateFilter || song.duplicateStatus === duplicateFilter;

      const matchesMetadata = !metadataFilter || song.metadataConfidence === metadataFilter;

      return matchesSearch && matchesOrganization && matchesDuplicate && matchesMetadata;
    });
  }, [duplicateFilter, metadataFilter, organizationFilter, searchText, songs]);

  const songsById = useMemo(
    () => new Map(songs.map((song) => [song.id, song])),
    [songs],
  );

  const reviewQueueRows = useMemo(
    () =>
      reviewTasks.map((task) => ({
        task,
        song: songsById.get(task.songId) ?? null,
      })),
    [reviewTasks, songsById],
  );

  const handleExport = async (format: "json" | "csv" | "excel") => {
    window.location.href = `/api/music-tracker/export?format=${format}`;
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--tx)]">
      <ToolTopbar
        className="border-[var(--br)] bg-[var(--bg2)]"
        left={
          <Link
            href="/"
            className="font-mono text-[17px] font-bold no-underline transition-opacity hover:opacity-75"
          >
            Diario<span className="text-[var(--acc)]">48</span>
            <span className="mx-2 text-[14px] font-normal text-[var(--tx4)]">/</span>
            <span className="text-[13px] font-normal text-[var(--tx3)]">Music Tracker</span>
          </Link>
        }
        center={
          <div className="flex overflow-hidden rounded border border-[var(--br)]">
            {(["dashboard", "library", "review", "reports"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-[11px] transition-colors ${
                  viewMode === mode
                    ? "bg-[var(--tx)] text-[var(--bg2)]"
                    : "bg-[var(--bg2)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
                }`}
              >
                {labels[mode]}
              </button>
            ))}
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <AuthStatusControls variant="tool" nextPath="/tools/music-tracker" />
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
          </div>
        }
      />

      {isLoading ? (
        <section className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-[12px] text-[var(--acc)]">cargando music tracker…</p>
            <p className="mt-2 text-[12px] text-[var(--tx3)]">
              preparando dashboard, biblioteca y cola de revisión
            </p>
          </div>
        </section>
      ) : (
        <section className="grid flex-1 grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
          <div className="min-w-0 overflow-hidden border-r border-[var(--br)] bg-[var(--bg)]">
            {viewMode === "dashboard" ? (
              <DashboardView
                dashboard={dashboard}
                notifySuccess={notifySuccess}
                notifyError={notifyError}
              />
            ) : null}

            {viewMode === "library" ? (
              <LibraryView
                songs={filteredSongs}
                searchText={searchText}
                onSearchTextChange={setSearchText}
                organizationFilter={organizationFilter}
                onOrganizationFilterChange={setOrganizationFilter}
                duplicateFilter={duplicateFilter}
                onDuplicateFilterChange={setDuplicateFilter}
                metadataFilter={metadataFilter}
                onMetadataFilterChange={setMetadataFilter}
                selectedSongId={selectedSongId}
                onSelectSong={setSelectedSongId}
                onSongUpdated={applySongUpdate}
                notifySuccess={notifySuccess}
                notifyError={notifyError}
              />
            ) : null}

            {viewMode === "review" ? (
              <ReviewQueueView
                rows={reviewQueueRows}
                selectedSongId={selectedSongId}
                onSelectSong={setSelectedSongId}
              />
            ) : null}

            {viewMode === "reports" ? (
              <ReportsView dashboard={dashboard} onExport={handleExport} />
            ) : null}
          </div>

          <SongDetailPanel
            detail={selectedSongDetail}
            onSongUpdated={applySongUpdate}
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        </section>
      )}
      <ToastViewport toasts={toasts} />
    </main>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const payload = (await response.json()) as { data?: T; error?: string };

  if (!response.ok || payload.data === undefined) {
    throw new Error(payload.error || "No se pudo completar la solicitud.");
  }

  return payload.data;
}

function calculateAverageRating(songs: Song[]) {
  const ratedSongs = songs.filter((song) => typeof song.rating === "number");

  if (!ratedSongs.length) {
    return 0;
  }

  const total = ratedSongs.reduce((sum, song) => sum + (song.rating ?? 0), 0);
  return Number((total / ratedSongs.length).toFixed(2));
}

async function patchSongPreferences(
  songId: string,
  input: {
    rating?: number | null;
    isRealFavorite?: boolean;
    personalNote?: string;
  },
): Promise<Song> {
  const response = await fetch(`/api/music-tracker/songs/${songId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as { data?: Song; error?: string };

  if (!response.ok || payload.data === undefined) {
    throw new Error(payload.error || "No se pudo actualizar la canción.");
  }

  return payload.data;
}

function DashboardView({
  dashboard,
  notifySuccess,
  notifyError,
}: {
  dashboard: DashboardResponse | null;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  const metrics = dashboard
    ? [
        { label: "tracks importados", value: dashboard.totalImportedSongs },
        { label: "canciones únicas", value: dashboard.totalUniqueSongs },
        { label: "pendientes revisión", value: dashboard.pendingReviewSongs },
        { label: "posibles duplicados", value: dashboard.possibleDuplicateSongs },
        { label: "metadata dudosa", value: dashboard.metadataDoubtfulSongs },
        { label: "playlists importadas", value: dashboard.importedPlaylists },
      ]
    : [];

  return (
    <div className="d48-scrollbar h-full overflow-y-auto p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
              {metric.label}
            </p>
            <p className="mt-3 font-mono text-[28px] font-semibold text-[var(--tx)]">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <TopListCard title="top artistas" items={dashboard?.topArtists ?? []} itemKey="artist" />
        <TopListCard title="top géneros" items={dashboard?.topGenres ?? []} itemKey="genre" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="canciones puntuadas" value={dashboard?.ratedSongsCount ?? 0} />
        <MetricCard label="rating promedio" value={dashboard?.averageRating ?? 0} />
        <MetricCard label="favoritas reales" value={dashboard?.realFavoritesCount ?? 0} />
        <MetricCard label="con nota personal" value={dashboard?.songsWithPersonalNoteCount ?? 0} />
      </div>

      <div className="mt-4">
        <YtMusicCredentialCard notifySuccess={notifySuccess} notifyError={notifyError} />
      </div>

      <div className="mt-4">
        <YtMusicSourcesCard notifySuccess={notifySuccess} notifyError={notifyError} />
      </div>

      <div className="mt-4">
        <YtMusicSearchCard notifySuccess={notifySuccess} notifyError={notifyError} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">{label}</p>
      <p className="mt-3 font-mono text-[22px] font-semibold text-[var(--tx)]">{value}</p>
    </div>
  );
}

function YtMusicCredentialCard({
  notifySuccess,
  notifyError,
}: {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  const [summary, setSummary] = useState<MusicProviderCredentialSummary | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setIsLoading(true);
        const nextSummary = await fetchJson<MusicProviderCredentialSummary>(
          "/api/music-tracker/provider-credentials/ytmusic",
        );
        setSummary(nextSummary);
      } catch (loadError) {
        notifyError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el estado de YT Music.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadStatus();
  }, [notifyError]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/music-tracker/provider-credentials/ytmusic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ browserJson: draft }),
      });

      const payload = (await response.json()) as {
        data?: MusicProviderCredentialSummary;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo guardar la credencial.");
      }

      setSummary(payload.data);
      setDraft("");
      notifySuccess("Credencial guardada. Ahora puedes validarla desde backend.");
    } catch (saveError) {
      notifyError(
        saveError instanceof Error ? saveError.message : "No se pudo guardar la credencial.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    try {
      setIsValidating(true);

      const response = await fetch("/api/music-tracker/provider-credentials/ytmusic/validate", {
        method: "POST",
      });

      const payload = (await response.json()) as {
        data?: MusicProviderCredentialSummary;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo validar la credencial.");
      }

      setSummary(payload.data);
      notifySuccess(
        payload.data.status === "valid"
          ? "Credencial validada correctamente."
          : "La credencial quedó marcada como inválida.",
      );
    } catch (validateError) {
      notifyError(
        validateError instanceof Error
          ? validateError.message
          : "No se pudo validar la credencial.",
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch("/api/music-tracker/provider-credentials/ytmusic", {
        method: "DELETE",
      });

      const payload = (await response.json()) as {
        data?: MusicProviderCredentialSummary;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo eliminar la credencial.");
      }

      setSummary(payload.data);
      setDraft("");
      notifySuccess("Credencial eliminada.");
    } catch (deleteError) {
      notifyError(
        deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la credencial.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
            conexión con yt music
          </p>
          <p className="mt-2 text-[12px] text-[var(--tx3)]">
            Guarda el contenido sensible derivado de tu browser.json. Se cifra en backend y nunca
            vuelve al frontend.
          </p>
        </div>
        <StateBadge label={summary?.status ?? (isLoading ? "loading" : "not-configured")} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Pega aquí el contenido de browser.json o su equivalente utilizable por YT Music"
            className="min-h-[180px] w-full rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "guardando…"
                : summary?.hasCredential
                  ? "actualizar credencial"
                  : "guardar credencial"}
            </button>
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating || !summary?.hasCredential}
              className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isValidating ? "validando…" : "validar desde backend"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || !summary?.hasCredential}
              className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-[12px] text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "eliminando…" : "eliminar"}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
          <InfoRow
            label="estado"
            value={summary?.status ?? (isLoading ? "cargando" : "not-configured")}
          />
          <InfoRow label="credencial guardada" value={summary?.hasCredential ? "sí" : "no"} />
          <InfoRow
            label="última validación"
            value={formatDateTime(summary?.lastValidatedAt) || "sin validar"}
          />
          <InfoRow
            label="última sincronización"
            value={formatDateTime(summary?.lastSyncAt) || "sin sincronizar"}
          />
          <InfoRow label="actualizada" value={formatDateTime(summary?.updatedAt) || "sin fecha"} />
          {summary?.lastError ? (
            <p className="rounded border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-[11px] text-yellow-200">
              {summary.lastError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function YtMusicSourcesCard({
  notifySuccess,
  notifyError,
}: {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  const [sources, setSources] = useState<YtMusicSourceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importingRef, setImportingRef] = useState("");
  const [syncingMode, setSyncingMode] = useState<"" | "all" | "likes" | "playlists">("");

  const handleLoadSources = async () => {
    try {
      setIsLoading(true);
      const result = await fetchJson<YtMusicSourceSummary[]>("/api/music-tracker/ytmusic/sources");
      setSources(result);
      notifySuccess("Fuentes de YT Music cargadas.");
    } catch (loadError) {
      notifyError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar las fuentes de YT Music.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (sourceRef: string) => {
    try {
      setImportingRef(sourceRef);

      const response = await fetch("/api/music-tracker/ytmusic/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceRef }),
      });

      const payload = (await response.json()) as {
        data?: {
          playlist?: { originalName?: string };
          importedTracks?: number;
          songs?: number;
        };
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo importar la fuente seleccionada.");
      }

      notifySuccess(
        `Importación completada: ${payload.data.importedTracks ?? 0} tracks procesados y ${payload.data.songs ?? 0} canciones resueltas.`,
      );
    } catch (importError) {
      notifyError(
        importError instanceof Error
          ? importError.message
          : "No se pudo importar la fuente seleccionada.",
      );
    } finally {
      setImportingRef("");
    }
  };

  const handleSync = async (mode: "all" | "likes" | "playlists") => {
    try {
      setSyncingMode(mode);

      const response = await fetch("/api/music-tracker/ytmusic/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      });

      const payload = (await response.json()) as {
        data?: YtMusicSyncResponse;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo sincronizar YT Music.");
      }

      const failedCount = payload.data.failedSources.length;
      notifySuccess(
        `Sincronización ${mode}: ${payload.data.totalImportedTracks} tracks y ${payload.data.totalSongs} canciones. ${failedCount ? `${failedCount} fuentes fallaron.` : "Sin errores."}`,
      );
      if (!sources.length) {
        void handleLoadSources();
      }
    } catch (syncError) {
      notifyError(
        syncError instanceof Error ? syncError.message : "No se pudo sincronizar YT Music.",
      );
    } finally {
      setSyncingMode("");
    }
  };

  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
            fuentes disponibles de yt music
          </p>
          <p className="mt-2 text-[12px] text-[var(--tx3)]">
            Carga likes y playlists desde backend usando la credencial guardada. Cada fuente se
            mapea a DTOs internos antes de entrar al dominio.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSources}
          disabled={isLoading}
          className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "cargando fuentes…" : "cargar fuentes"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSync("all")}
            disabled={syncingMode !== ""}
            className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncingMode === "all" ? "sincronizando…" : "importar desde YT Music"}
          </button>
          <button
            type="button"
            onClick={() => handleSync("likes")}
            disabled={syncingMode !== ""}
            className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncingMode === "likes" ? "actualizando…" : "actualizar likes"}
          </button>
          <button
            type="button"
            onClick={() => handleSync("playlists")}
            disabled={syncingMode !== ""}
            className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncingMode === "playlists" ? "actualizando…" : "actualizar playlists"}
          </button>
        </div>

        {sources.length ? (
          sources.map((source) => (
            <div
              key={source.sourceRef}
              className="flex flex-wrap items-center justify-between gap-3 rounded border border-[var(--br)] bg-[var(--bg3)] p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-semibold text-[var(--tx)]">{source.title}</p>
                  <StateBadge label={source.sourceKind} />
                </div>
                <p className="mt-1 text-[11px] text-[var(--tx3)]">
                  {source.itemCount ?? 0} tracks · {source.externalPlaylistId}
                </p>
                {source.sourceUrl ? (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[11px] text-[var(--acc)] underline-offset-2 hover:underline"
                  >
                    abrir en yt music
                  </a>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => handleImport(source.sourceRef)}
                disabled={importingRef === source.sourceRef}
                className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {importingRef === source.sourceRef ? "importando…" : "importar"}
              </button>
            </div>
          ))
        ) : (
          <EmptyListMessage message="Todavía no se han cargado fuentes de YT Music." />
        )}
      </div>

    </div>
  );
}

function YtMusicSearchCard({
  notifySuccess,
  notifyError,
}: {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YtMusicSearchTrackSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingTrackId, setAddingTrackId] = useState("");

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const url = `/api/music-tracker/ytmusic/search?query=${encodeURIComponent(query)}&limit=10`;
      const nextResults = await fetchJson<YtMusicSearchTrackSummary[]>(url);
      setResults(nextResults);
      if (!nextResults.length) {
        notifySuccess("No se encontraron canciones para esa búsqueda.");
      }
    } catch (searchError) {
      notifyError(
        searchError instanceof Error ? searchError.message : "No se pudo buscar en YT Music.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTrack = async (track: YtMusicSearchTrackSummary) => {
    try {
      setAddingTrackId(track.externalTrackId);

      const response = await fetch("/api/music-tracker/ytmusic/add-track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ track }),
      });

      const payload = (await response.json()) as {
        data?: { song?: { canonicalTitle?: string; canonicalArtist?: string } };
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo agregar la canción a la biblioteca.");
      }

      notifySuccess(
        `Canción agregada a la biblioteca: ${payload.data.song?.canonicalTitle ?? track.title}.`,
      );
    } catch (addError) {
      notifyError(
        addError instanceof Error
          ? addError.message
          : "No se pudo agregar la canción a la biblioteca.",
      );
    } finally {
      setAddingTrackId("");
    }
  };

  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
          buscador de canciones en yt music
        </p>
        <p className="mt-2 text-[12px] text-[var(--tx3)]">
          Busca canciones individuales y agrégalas a tu biblioteca reutilizando el mismo flujo de
          consolidación.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="buscar canción por título o artista"
          className="min-w-[280px] flex-1 rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "buscando…" : "buscar"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {results.length ? (
          results.map((track) => (
            <div
              key={track.externalTrackId}
              className="flex flex-wrap items-center justify-between gap-3 rounded border border-[var(--br)] bg-[var(--bg3)] p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--tx)]">{track.title}</p>
                <p className="mt-1 text-[11px] text-[var(--tx3)]">
                  {track.artistDisplayName || "sin artista"} {track.albumName ? `· ${track.albumName}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-[var(--tx4)]">
                  {track.externalTrackId} {track.durationText ? `· ${track.durationText}` : ""}
                </p>
                {track.sourceUrl ? (
                  <a
                    href={track.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[11px] text-[var(--acc)] underline-offset-2 hover:underline"
                  >
                    abrir link
                  </a>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => handleAddTrack(track)}
                disabled={addingTrackId === track.externalTrackId}
                className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingTrackId === track.externalTrackId ? "agregando…" : "agregar a biblioteca"}
              </button>
            </div>
          ))
        ) : (
          <EmptyListMessage message="Busca una canción para verla aquí." />
        )}
      </div>
    </div>
  );
}

function TopListCard({
  title,
  items,
  itemKey,
}: {
  title: string;
  items: Array<{ count: number; artist?: string; genre?: string }>;
  itemKey: "artist" | "genre";
}) {
  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">{title}</p>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div
              key={`${item[itemKey] ?? "unknown"}-${item.count}`}
              className="flex items-center justify-between rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px]"
            >
              <span>{item[itemKey] ?? "sin dato"}</span>
              <span className="font-mono text-[var(--tx3)]">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-[12px] text-[var(--tx4)]">Sin datos todavía.</p>
        )}
      </div>
    </div>
  );
}

function LibraryView(props: {
  songs: Song[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  organizationFilter: string;
  onOrganizationFilterChange: (value: string) => void;
  duplicateFilter: string;
  onDuplicateFilterChange: (value: string) => void;
  metadataFilter: string;
  onMetadataFilterChange: (value: string) => void;
  selectedSongId: string | null;
  onSelectSong: (songId: string) => void;
  onSongUpdated: (song: Song) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--br)] bg-[var(--bg2)] p-3">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={props.searchText}
            onChange={(event) => props.onSearchTextChange(event.target.value)}
            placeholder="buscar por título o artista"
            className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
          />
          <SelectFilter
            value={props.organizationFilter}
            onChange={props.onOrganizationFilterChange}
            placeholder="estado"
            options={[
              "imported",
              "needs-review",
              "clean",
              "enriched",
              "classified",
              "archived",
              "discarded",
            ]}
          />
          <SelectFilter
            value={props.duplicateFilter}
            onChange={props.onDuplicateFilterChange}
            placeholder="duplicados"
            options={[
              "not-duplicate",
              "possible-duplicate",
              "confirmed-duplicate",
              "merged",
              "pending-duplicate-review",
            ]}
          />
          <SelectFilter
            value={props.metadataFilter}
            onChange={props.onMetadataFilterChange}
            placeholder="metadata"
            options={[
              "metadata-reliable",
              "metadata-probable",
              "metadata-doubtful",
              "metadata-not-found",
            ]}
          />
        </div>
      </div>

      <div className="d48-scrollbar flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {props.songs.length ? (
            props.songs.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => song.id && props.onSelectSong(song.id)}
                className={`w-full rounded-[10px] border p-3 text-left transition-colors ${
                  props.selectedSongId === song.id
                    ? "border-[var(--acc3)] bg-[var(--acc2)]"
                    : "border-[var(--br)] bg-[var(--bg2)] hover:bg-[var(--bg3)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--tx)]">
                      {song.canonicalTitle}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-[var(--tx3)]">
                      {song.canonicalArtist || "artista sin resolver"}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {typeof song.rating === "number" ? <StateBadge label={`★ ${song.rating}`} /> : null}
                    {song.isRealFavorite ? <StateBadge label="favorita real" /> : null}
                    <StateBadge label={song.organizationState} />
                    <StateBadge label={song.metadataConfidence} />
                    <StateBadge label={song.duplicateStatus} />
                  </div>
                </div>
                <div
                  className="mt-3 flex flex-wrap items-center gap-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  <span className="text-[11px] text-[var(--tx4)]">rating:</span>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={async () => {
                        try {
                          const updatedSong = await patchSongPreferences(song.id ?? "", {
                            rating: song.rating === rating ? null : rating,
                          });
                          props.onSongUpdated(updatedSong);
                          props.notifySuccess("Rating actualizado.");
                        } catch (error) {
                          props.notifyError(
                            error instanceof Error
                              ? error.message
                              : "No se pudo actualizar el rating.",
                          );
                        }
                      }}
                      className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                        song.rating === rating
                          ? "border-[var(--acc3)] bg-[var(--acc2)] text-[var(--tx)]"
                          : "border-[var(--br)] bg-[var(--bg)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </button>
            ))
          ) : (
            <EmptyListMessage message="No hay canciones para esos filtros." />
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewQueueView({
  rows,
  selectedSongId,
  onSelectSong,
}: {
  rows: Array<{ task: SongReviewTask; song: Song | null }>;
  selectedSongId: string | null;
  onSelectSong: (songId: string) => void;
}) {
  return (
    <div className="d48-scrollbar h-full overflow-y-auto p-3">
      <div className="space-y-2">
        {rows.length ? (
          rows.map(({ task, song }) => (
            <button
              key={task.id}
              type="button"
              onClick={() => song?.id && onSelectSong(song.id)}
              className={`w-full rounded-[10px] border p-3 text-left transition-colors ${
                selectedSongId === song?.id
                  ? "border-[var(--acc3)] bg-[var(--acc2)]"
                  : "border-[var(--br)] bg-[var(--bg2)] hover:bg-[var(--bg3)]"
              }`}
            >
              <p className="text-[12px] font-semibold text-[var(--tx)]">
                {song?.canonicalTitle || "canción sin resolver"}
              </p>
              <p className="mt-1 text-[11px] text-[var(--tx3)]">
                {song?.canonicalArtist || "sin artista"} · {task.action}
              </p>
              <p className="mt-2 text-[11px] text-[var(--tx4)]">{task.reason}</p>
            </button>
          ))
        ) : (
          <EmptyListMessage message="No hay tareas pendientes de revisión." />
        )}
      </div>
    </div>
  );
}

function ReportsView({
  dashboard,
  onExport,
}: {
  dashboard: DashboardResponse | null;
  onExport: (format: "json" | "csv" | "excel") => void;
}) {
  return (
    <div className="d48-scrollbar h-full overflow-y-auto p-4">
      <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
          exportación
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ExportButton label="JSON" onClick={() => onExport("json")} />
          <ExportButton label="CSV" onClick={() => onExport("csv")} />
          <ExportButton label="Excel" onClick={() => onExport("excel")} />
        </div>
      </div>

      <div className="mt-4 rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
          salud de biblioteca
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-[var(--bg3)] p-3 text-[11px] text-[var(--tx3)]">
          {JSON.stringify(dashboard?.healthSummary ?? {}, null, 2)}
        </pre>
      </div>

      <div className="mt-4 rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">
          preferencias manuales
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoRow label="canciones puntuadas" value={String(dashboard?.ratedSongsCount ?? 0)} />
          <InfoRow label="rating promedio" value={String(dashboard?.averageRating ?? 0)} />
          <InfoRow label="favoritas reales" value={String(dashboard?.realFavoritesCount ?? 0)} />
          <InfoRow
            label="con nota personal"
            value={String(dashboard?.songsWithPersonalNoteCount ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}

function SongDetailPanel({
  detail,
  onSongUpdated,
  notifySuccess,
  notifyError,
}: {
  detail: SongDetailResponse | null;
  onSongUpdated: (song: Song) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  return (
    <aside className="d48-scrollbar overflow-y-auto bg-[var(--bg2)] p-4">
      {!detail ? (
        <EmptyListMessage message="Selecciona una canción para ver trazabilidad y detalle." />
      ) : (
        <div className="space-y-4">
          <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-4">
            <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">detalle</p>
            <h2 className="mt-2 text-[18px] font-semibold text-[var(--tx)]">
              {detail.song.canonicalTitle}
            </h2>
            <p className="mt-1 text-[12px] text-[var(--tx3)]">{detail.song.canonicalArtist}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {typeof detail.song.rating === "number" ? (
                <StateBadge label={`★ ${detail.song.rating}`} />
              ) : null}
              {detail.song.isRealFavorite ? <StateBadge label="favorita real" /> : null}
              <StateBadge label={detail.song.organizationState} />
              <StateBadge label={detail.song.reviewState} />
              <StateBadge label={detail.song.metadataConfidence} />
              <StateBadge label={detail.song.duplicateStatus} />
            </div>
          </div>

          <DetailSection title="ajustes manuales">
            <SongPreferencesEditor
              key={detail.song.id ?? "song-preferences"}
              song={detail.song}
              onSongUpdated={onSongUpdated}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          </DetailSection>

          <DetailSection title="dato bruto / normalizado">
            {detail.importedTracks.length ? (
              detail.importedTracks.map((track, index) => (
                <div key={track.id ?? index} className="rounded border border-[var(--br)] p-3">
                  <p className="text-[11px] text-[var(--tx3)]">original</p>
                  <p className="mt-1 text-[12px] text-[var(--tx)]">{track.originalTitle}</p>
                  <p className="mt-2 text-[11px] text-[var(--tx3)]">normalizado</p>
                  <p className="mt-1 text-[12px] text-[var(--tx)]">
                    {track.normalizedArtist} — {track.normalizedTitle}
                  </p>
                </div>
              ))
            ) : (
              <EmptyListMessage message="No hay tracks importados asociados." />
            )}
          </DetailSection>

          <DetailSection title="playlists">
            {detail.occurrences.length ? (
              detail.occurrences.map((occurrence, index) => (
                <div key={occurrence.id ?? index} className="rounded border border-[var(--br)] p-3">
                  <p className="text-[12px] text-[var(--tx)]">
                    {occurrence.playlist?.originalName || "playlist sin resolver"}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--tx3)]">
                    posiciones: {occurrence.positions.join(", ") || "—"}
                  </p>
                </div>
              ))
            ) : (
              <EmptyListMessage message="No hay ocurrencias registradas en playlists." />
            )}
          </DetailSection>

          <DetailSection title="revisión">
            {detail.reviewTasks.length ? (
              detail.reviewTasks.map((task, index) => (
                <div key={task.id ?? index} className="rounded border border-[var(--br)] p-3">
                  <p className="text-[12px] text-[var(--tx)]">{task.action}</p>
                  <p className="mt-1 text-[11px] text-[var(--tx3)]">{task.reason}</p>
                </div>
              ))
            ) : (
              <EmptyListMessage message="No hay historial de revisión para esta canción." />
            )}
          </DetailSection>

          <DetailSection title="duplicados sugeridos">
            {detail.duplicateCases.length ? (
              detail.duplicateCases.map((duplicateCase, index) => (
                <div key={duplicateCase.id ?? index} className="rounded border border-[var(--br)] p-3">
                  <p className="text-[12px] text-[var(--tx)]">
                    {duplicateCase.status} · score {duplicateCase.suspicionScore}
                  </p>
                  <ul className="mt-2 list-disc pl-4 text-[11px] text-[var(--tx3)]">
                    {duplicateCase.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <EmptyListMessage message="No hay casos de duplicado para esta canción." />
            )}
          </DetailSection>
        </div>
      )}
    </aside>
  );
}

function SongPreferencesEditor({
  song,
  onSongUpdated,
  notifySuccess,
  notifyError,
}: {
  song: Song;
  onSongUpdated: (song: Song) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}) {
  const [draftNote, setDraftNote] = useState(song.personalNote);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const handlePreferenceSave = async (input: {
    rating?: number | null;
    isRealFavorite?: boolean;
    personalNote?: string;
  }) => {
    if (!song.id) {
      return;
    }

    try {
      setIsSavingPreferences(true);
      const updatedSong = await patchSongPreferences(song.id, input);
      onSongUpdated(updatedSong);
      if (typeof input.personalNote === "string") {
        setDraftNote(updatedSong.personalNote);
      }
      notifySuccess("Ajustes guardados.");
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "No se pudieron guardar los ajustes.",
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] text-[var(--tx4)]">rating manual</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              disabled={isSavingPreferences}
              onClick={() =>
                handlePreferenceSave({
                  rating: song.rating === rating ? null : rating,
                })
              }
              className={`rounded border px-3 py-2 text-[12px] transition-colors ${
                song.rating === rating
                  ? "border-[var(--acc3)] bg-[var(--acc2)] text-[var(--tx)]"
                  : "border-[var(--br)] bg-[var(--bg)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-[12px] text-[var(--tx2)]">
        <input
          type="checkbox"
          checked={song.isRealFavorite}
          disabled={isSavingPreferences}
          onChange={(event) =>
            handlePreferenceSave({
              isRealFavorite: event.target.checked,
            })
          }
        />
        marcar como favorita real
      </label>

      <div>
        <p className="text-[11px] text-[var(--tx4)]">nota personal</p>
        <textarea
          value={draftNote}
          onChange={(event) => setDraftNote(event.target.value)}
          placeholder="anota por qué te importa esta canción, contexto o preferencia"
          className="mt-2 min-h-[100px] w-full rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            disabled={isSavingPreferences}
            onClick={() =>
              handlePreferenceSave({
                personalNote: draftNote,
              })
            }
            className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg3)] hover:text-[var(--tx)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            guardar nota
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded border px-4 py-3 text-[12px] shadow-lg ${
            toast.tone === "success"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
              : "border-red-500/40 bg-red-500/15 text-red-100"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-4">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--tx)]"
    >
      exportar {label}
    </button>
  );
}

function SelectFilter({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded border border-[var(--br)] bg-[var(--bg)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function StateBadge({ label }: { label: string }) {
  return (
    <span className="rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--tx3)]">
      {label}
    </span>
  );
}

function EmptyListMessage({ message }: { message: string }) {
  return <p className="text-[12px] text-[var(--tx4)]">{message}</p>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[var(--br)] bg-[var(--bg2)] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--tx4)]">{label}</p>
      <p className="mt-1 text-[12px] text-[var(--tx2)]">{value}</p>
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const labels: Record<ViewMode, string> = {
  dashboard: "dashboard",
  library: "biblioteca",
  review: "revisión",
  reports: "reportes",
};
