import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "light", as = "h2" }: SectionHeadingProps) {
  const isDark = tone === "dark";
  const HeadingTag = as;

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
          isDark ? "bg-foam/10 text-sun" : "bg-sun/12 text-sun"
        }`}
      >
        {eyebrow}
      </p>
      <HeadingTag
        className={`headline-tight text-balance mt-5 break-keep-all text-4xl font-black leading-[1.08] sm:text-6xl ${
          isDark ? "text-foam" : "text-foreground"
        }`}
      >
        {title}
      </HeadingTag>
      {description ? (
        <p className={`text-pretty mt-5 max-w-2xl text-base leading-8 sm:text-lg ${isDark ? "text-foam/72" : "text-ink-muted"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
