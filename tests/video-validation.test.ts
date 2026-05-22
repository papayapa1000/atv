import assert from "node:assert/strict";
import test from "node:test";
import { normalizeVideoPage } from "../src/lib/videos/pagination";
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from "../src/lib/videos/youtube";
import { normalizeVideoPostForm, validateVideoPostForm } from "../src/lib/videos/validation";

test("extracts YouTube video IDs from common URL forms", () => {
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeThumbnailUrl("dQw4w9WgXcQ"), "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
});

test("validates YouTube video post data", () => {
  const normalized = normalizeVideoPostForm({
    title: " 청풍호 영상 ",
    youtubeUrl: " https://youtu.be/dQw4w9WgXcQ ",
    content: " 상세페이지에 표시할 설명입니다. ",
    isPublished: "on",
  });

  assert.equal(normalized.youtubeId, "dQw4w9WgXcQ");
  const result = validateVideoPostForm(normalized);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.sourceType, "youtube");
    assert.equal(result.data.youtubeId, "dQw4w9WgXcQ");
  }
});

test("requires exactly one video source", () => {
  const result = validateVideoPostForm({
    title: "소스 없음",
    youtubeUrl: "",
    youtubeId: "",
    videoFile: null,
    content: "등록할 영상 소스가 없습니다.",
    isPublished: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.source ?? "", /유튜브/);
  }
});

test("allows video edit validation to keep an existing uploaded video", () => {
  const result = validateVideoPostForm(
    {
      title: "동영상 수정",
      youtubeUrl: "",
      youtubeId: "",
      videoFile: null,
      content: "기존 업로드 영상을 유지하면서 설명만 수정합니다.",
      isPublished: true,
    },
    { allowMissingSource: true },
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.sourceType, "file");
    assert.equal(result.data.videoFile, null);
  }
});

test("rejects video files larger than the Supabase Storage bucket limit", () => {
  const oversizedFile = new File(["x"], "large-video.mp4", {
    type: "video/mp4",
  });
  Object.defineProperty(oversizedFile, "size", { value: 250 * 1024 * 1024 + 1 });
  const result = validateVideoPostForm({
    title: "테스트 영상",
    youtubeUrl: "",
    youtubeId: "",
    videoFile: oversizedFile,
    content: "영상 파일 크기를 검증합니다.",
    isPublished: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.videoFile ?? "", /250MB/);
  }
});

test("normalizes video pagination", () => {
  assert.deepEqual(normalizeVideoPage("2", 18), {
    page: 2,
    pageSize: 9,
    totalCount: 18,
    totalPages: 2,
    offset: 9,
  });
});
