const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeVideoId(rawUrl: string) {
  const value = rawUrl.trim();

  if (!value) {
    return "";
  }

  if (youtubeIdPattern.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return youtubeIdPattern.test(id) ? id : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const watchId = url.searchParams.get("v") ?? "";
      if (youtubeIdPattern.test(watchId)) {
        return watchId;
      }

      const [kind, id] = url.pathname.split("/").filter(Boolean);
      if ((kind === "shorts" || kind === "embed" || kind === "live") && youtubeIdPattern.test(id ?? "")) {
        return id;
      }
    }
  } catch {
    return "";
  }

  return "";
}

export function getYouTubeThumbnailUrl(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(youtubeId: string) {
  return `https://www.youtube.com/embed/${youtubeId}`;
}
