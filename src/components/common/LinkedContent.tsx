const contentUrlPattern = /(https?:\/\/[^\s]+)/g;

function splitTrailingPunctuation(value: string) {
  const match = value.match(/[),.!?]+$/);

  if (!match) {
    return { url: value, trailing: "" };
  }

  return {
    url: value.slice(0, -match[0].length),
    trailing: match[0],
  };
}

export function LinkedContent({ content }: { content: string }) {
  return content.split(contentUrlPattern).map((part, index) => {
    if (!part.match(/^https?:\/\//)) {
      return part;
    }

    const { url, trailing } = splitTrailingPunctuation(part);

    try {
      const parsed = new URL(url);

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return part;
      }
    } catch {
      return part;
    }

    return (
      <span key={`${url}-${index}`}>
        <a href={url} target="_blank" rel="noreferrer" className="font-bold text-lake underline decoration-lake/30 underline-offset-4 hover:text-sunset">
          {url}
        </a>
        {trailing}
      </span>
    );
  });
}
