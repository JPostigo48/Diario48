import "server-only";

import { spawn } from "node:child_process";
import path from "node:path";
import type {
  YtMusicImportableSourceDto,
  YtMusicPlaylistDto,
  YtMusicSearchTrackDto,
} from "@/features/music-tracker/import-sources/infrastructure/ytmusic/dtos";

type BridgeAction = "list_sources" | "load_playlist" | "search_tracks";

type BridgeSuccessPayload<T> = {
  ok: true;
  data: T;
};

type BridgeErrorPayload = {
  ok: false;
  error: string;
};

function getPythonExecutable() {
  return process.env.YTMUSIC_PYTHON_BIN?.trim() || (process.platform === "win32" ? "py" : "python3");
}

function getPythonArgs() {
  const rawArgs = process.env.YTMUSIC_PYTHON_ARGS?.trim();
  return rawArgs ? rawArgs.split(/\s+/).filter(Boolean) : [];
}

async function runBridge<T>(payload: Record<string, unknown>): Promise<T> {
  const scriptPath = path.join(process.cwd(), "scripts", "music_tracker_ytmusic_connector.py");
  const commandArgs = [...getPythonArgs(), scriptPath];
  const rawOutput = await new Promise<string>((resolve, reject) => {
    const child = spawn(getPythonExecutable(), commandArgs, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0 && !stdout.trim()) {
        reject(new Error(stderr.trim() || "El conector de YT Music terminó con error."));
        return;
      }

      resolve(stdout.trim() || stderr.trim());
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

  if (!rawOutput) {
    throw new Error("El conector de YT Music no devolvió respuesta.");
  }

  const parsed = JSON.parse(rawOutput) as BridgeSuccessPayload<T> | BridgeErrorPayload;

  if (!parsed.ok) {
    throw new Error(parsed.error || "El conector de YT Music devolvió un error.");
  }

  return parsed.data;
}

export class YtMusicPythonBridge {
  async listSources(auth: string): Promise<{
    likedSongs: YtMusicImportableSourceDto;
    playlists: YtMusicImportableSourceDto[];
  }> {
    return runBridge({
      action: "list_sources" satisfies BridgeAction,
      auth,
    });
  }

  async loadPlaylist(auth: string, sourceRef: string): Promise<YtMusicPlaylistDto> {
    return runBridge({
      action: "load_playlist" satisfies BridgeAction,
      auth,
      sourceRef,
    });
  }

  async searchTracks(auth: string, query: string, limit: number): Promise<YtMusicSearchTrackDto[]> {
    return runBridge({
      action: "search_tracks" satisfies BridgeAction,
      auth,
      query,
      limit,
    });
  }
}
