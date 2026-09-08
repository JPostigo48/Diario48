import json
import sys
from typing import Any

try:
    from ytmusicapi import YTMusic
except Exception as exc:  # pragma: no cover
    print(
        json.dumps(
            {
                "ok": False,
                "error": f"No se pudo importar ytmusicapi: {exc}",
            }
        )
    )
    sys.exit(1)


def parse_input() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("No se recibió payload para el conector de YT Music.")
    return json.loads(raw)


def parse_auth(raw_auth: str) -> Any:
    raw_auth = raw_auth.strip()
    if not raw_auth:
        raise ValueError("La credencial de YT Music está vacía.")

    try:
        return json.loads(raw_auth)
    except json.JSONDecodeError:
        return raw_auth


def map_track(raw_track: dict[str, Any], index: int) -> dict[str, Any]:
    artists = raw_track.get("artists") or []
    first_artist = artists[0]["name"] if artists else ""
    album = raw_track.get("album") or {}
    thumbnails = raw_track.get("thumbnails") or []

    return {
        "externalTrackId": raw_track.get("videoId") or raw_track.get("setVideoId") or f"track-{index}",
        "title": raw_track.get("title") or "",
        "artists": [artist.get("name") or "" for artist in artists if artist.get("name")],
        "artistDisplayName": ", ".join(
            [artist.get("name") or "" for artist in artists if artist.get("name")]
        ),
        "channelName": first_artist,
        "albumName": album.get("name") or "",
        "durationText": raw_track.get("duration") or "",
        "durationSeconds": raw_track.get("duration_seconds"),
        "isAvailable": bool(raw_track.get("isAvailable", True)),
        "isExplicit": bool(raw_track.get("isExplicit", False)),
        "thumbnails": thumbnails,
        "url": f"https://music.youtube.com/watch?v={raw_track.get('videoId')}"
        if raw_track.get("videoId")
        else "",
        "providerPayload": {
            "videoId": raw_track.get("videoId"),
            "setVideoId": raw_track.get("setVideoId"),
            "likeStatus": raw_track.get("likeStatus"),
            "inLibrary": raw_track.get("inLibrary"),
            "feedbackTokens": raw_track.get("feedbackTokens"),
        },
    }


def map_search_track(raw_track: dict[str, Any], index: int) -> dict[str, Any]:
    artists = raw_track.get("artists") or []
    album = raw_track.get("album") or {}
    thumbnails = raw_track.get("thumbnails") or []

    return {
        "externalTrackId": raw_track.get("videoId") or f"search-track-{index}",
        "title": raw_track.get("title") or "",
        "artists": [artist.get("name") or "" for artist in artists if artist.get("name")],
        "artistDisplayName": ", ".join(
            [artist.get("name") or "" for artist in artists if artist.get("name")]
        ),
        "channelName": (artists[0].get("name") if artists else "") or "",
        "albumName": album.get("name") or "",
        "durationText": raw_track.get("duration") or "",
        "durationSeconds": raw_track.get("duration_seconds"),
        "isAvailable": bool(raw_track.get("isAvailable", True)),
        "isExplicit": bool(raw_track.get("isExplicit", False)),
        "thumbnails": thumbnails,
        "url": f"https://music.youtube.com/watch?v={raw_track.get('videoId')}"
        if raw_track.get("videoId")
        else "",
        "providerPayload": {
            "resultType": raw_track.get("resultType"),
            "category": raw_track.get("category"),
            "videoType": raw_track.get("videoType"),
        },
    }


def map_playlist(raw_playlist: dict[str, Any], source_ref: str) -> dict[str, Any]:
    tracks = [map_track(track, index) for index, track in enumerate(raw_playlist.get("tracks") or [], start=1)]
    thumbnails = raw_playlist.get("thumbnails") or []

    return {
        "sourceRef": source_ref,
        "externalPlaylistId": raw_playlist.get("id") or "",
        "title": raw_playlist.get("title") or "",
        "description": raw_playlist.get("description") or "",
        "trackCount": raw_playlist.get("trackCount") or len(tracks),
        "privacy": raw_playlist.get("privacy") or "",
        "year": raw_playlist.get("year") or "",
        "thumbnails": thumbnails,
        "sourceUrl": f"https://music.youtube.com/playlist?list={raw_playlist.get('id')}"
        if raw_playlist.get("id")
        else "",
        "tracks": tracks,
        "providerPayload": {
            "author": raw_playlist.get("author"),
            "duration": raw_playlist.get("duration"),
            "durationSeconds": raw_playlist.get("duration_seconds"),
            "owned": raw_playlist.get("owned"),
            "trackCount": raw_playlist.get("trackCount"),
        },
    }


def list_sources(client: YTMusic) -> dict[str, Any]:
    liked = client.get_playlist("LM", limit=1)
    playlists = client.get_library_playlists(limit=None)

    return {
        "likedSongs": {
            "sourceRef": "likes",
            "kind": "liked-songs",
            "externalPlaylistId": liked.get("id") or "LM",
            "title": liked.get("title") or "Liked Songs",
            "description": liked.get("description") or "",
            "itemCount": liked.get("trackCount") or 0,
            "sourceUrl": "https://music.youtube.com/playlist?list=LM",
            "thumbnails": liked.get("thumbnails") or [],
            "providerPayload": {
                "privacy": liked.get("privacy"),
                "trackCount": liked.get("trackCount"),
            },
        },
        "playlists": [
            {
                "sourceRef": f"playlist:{playlist.get('playlistId')}",
                "kind": "playlist",
                "externalPlaylistId": playlist.get("playlistId") or "",
                "title": playlist.get("title") or "",
                "description": "",
                "itemCount": playlist.get("count") or 0,
                "sourceUrl": f"https://music.youtube.com/playlist?list={playlist.get('playlistId')}"
                if playlist.get("playlistId")
                else "",
                "thumbnails": playlist.get("thumbnails") or [],
                "providerPayload": {
                    "count": playlist.get("count"),
                },
            }
            for playlist in playlists
        ],
    }


def load_playlist(client: YTMusic, source_ref: str) -> dict[str, Any]:
    if source_ref == "likes":
        raw_playlist = client.get_playlist("LM", limit=None)
        return map_playlist(raw_playlist, "likes")

    if source_ref.startswith("playlist:"):
        playlist_id = source_ref.split(":", 1)[1]
        raw_playlist = client.get_playlist(playlist_id, limit=None)
        return map_playlist(raw_playlist, source_ref)

    raise ValueError("sourceRef de YT Music no soportado.")


def search_tracks(client: YTMusic, query: str, limit: int) -> list[dict[str, Any]]:
    results = client.search(query, filter="songs", limit=limit)
    return [map_search_track(track, index) for index, track in enumerate(results, start=1)]


def main() -> None:
    payload = parse_input()
    auth = parse_auth(payload.get("auth", ""))
    client = YTMusic(auth=auth)
    action = payload.get("action")

    if action == "list_sources":
        data = list_sources(client)
    elif action == "load_playlist":
        data = load_playlist(client, payload.get("sourceRef", ""))
    elif action == "search_tracks":
        data = search_tracks(client, payload.get("query", ""), int(payload.get("limit", 10)))
    else:
        raise ValueError("Acción no soportada para el conector de YT Music.")

    print(json.dumps({"ok": True, "data": data}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False))
        sys.exit(1)
