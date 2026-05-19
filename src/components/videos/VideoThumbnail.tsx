import Image from "next/image";
import { Play } from "@phosphor-icons/react/ssr";
import type { VideoPost } from "@/lib/videos/repository";

type VideoThumbnailProps = {
  post: VideoPost;
  priority?: boolean;
  fill?: boolean;
};

export function VideoThumbnail({ post, priority = false, fill = false }: VideoThumbnailProps) {
  return (
    <div className={fill ? "relative h-full w-full overflow-hidden bg-mist" : "relative aspect-video overflow-hidden bg-mist"}>
      {post.sourceType === "youtube" && post.thumbnailUrl ? (
        <Image
          src={post.thumbnailUrl}
          alt={post.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : post.videoUrl ? (
        <video
          src={`${post.videoUrl}#t=0.1`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          muted
          playsInline
          preload="metadata"
          aria-label={`${post.title} 영상 썸네일`}
        />
      ) : (
        <div className="h-full w-full bg-surface-muted" />
      )}
      <div className="absolute inset-0 bg-foreground/12 opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
      <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-lake shadow-[0_16px_40px_-24px_rgba(16,34,30,0.6)] backdrop-blur">
        <Play aria-hidden="true" className="h-4 w-4" weight="fill" />
      </span>
    </div>
  );
}
