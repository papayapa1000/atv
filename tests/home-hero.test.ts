import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("hero location CTA uses a cohesive filled lake color", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes('href="/water-ski-atv#location"'), true);
  assert.equal(source.includes("border border-lake bg-lake"), true);
  assert.equal(source.includes("text-white"), true);
  assert.equal(source.includes("hover:border-forest hover:bg-forest"), true);
  assert.equal(source.includes("bg-surface/72 px-6 py-3 text-sm font-extrabold text-lake"), false);
});

test("hero phone CTA uses darker orange on hover", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("전화예약 바로하기"), true);
  assert.equal(source.includes("border border-sun bg-sun"), true);
  assert.equal(source.includes("hover:border-sunset hover:bg-sunset hover:text-white"), true);
  assert.equal(source.includes("hover:bg-lake hover:text-white active:scale-[0.98]"), false);
});

test("hero headline uses a clear leisure-focused message", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("제천 청풍호에서 즐기는"), true);
  assert.equal(source.includes("수상레저와 ATV"), true);
  assert.equal(source.includes("하루를 크게 씁니다"), false);
});

test("hero body copy explains the lake and ATV experience naturally", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("청풍호의 물살 위 수상레저와 호반 산길을 달리는 ATV를 한곳에서 즐겨보세요."), true);
  assert.equal(source.includes("인원과 일정에 맞춰 알맞은 코스를 안내해 드립니다."), true);
  assert.equal(source.includes("전화 한 번으로 종목과 시간대를 바로 맞춥니다"), false);
  assert.equal(source.includes("하루 일정으로 정리해 드립니다"), false);
});

test("hero text panel sits closer to the top of the hero", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("mt-0 max-w-[36rem]"), true);
  assert.equal(source.includes("lg:mt-0"), true);
  assert.equal(source.includes("mt-7 max-w-[36rem]"), false);
  assert.equal(source.includes("lg:mt-7"), false);
});

test("hero top lake and open-time badge is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("Jecheon Cheongpung Lake"), false);
  assert.equal(source.includes("Open 07:00-19:00"), false);
  assert.equal(source.includes("MapPin"), false);
});

test("hero category badge is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("Water Leisure / ATV / Boat Tour"), false);
  assert.equal(source.includes("supanova-badge mb-4"), false);
});

test("hero information panel is removed", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("heroHighlights"), false);
  assert.equal(source.includes("<dl"), false);
  assert.equal(source.includes("border border-white/18 bg-forest/82"), false);
  assert.equal(source.includes("text-white shadow-[0_20px_54px_-38px_rgba(5,47,45,0.82)] backdrop-blur-md"), false);
  assert.equal(source.includes("border border-surface/72 bg-surface/64 p-1.5 text-sm text-foreground backdrop-blur-sm"), false);
});

test("hero text copy does not use a translucent panel background", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes("bg-surface/64"), false);
  assert.equal(source.includes("backdrop-blur-sm"), false);
  assert.equal(source.includes("border border-surface/70"), false);
  assert.equal(source.includes("shadow-[0_18px_62px_-52px_rgba(7,59,58,0.42)]"), false);
  assert.equal(source.includes("rounded-[1.5rem]"), false);
});

test("hero description alone uses a subtle text background without a hero scrim", () => {
  const heroSource = readFileSync("src/components/home/Hero.tsx", "utf8");
  const cssSource = readFileSync("src/app/globals.css", "utf8");
  const descriptionBlock = cssSource.match(/\.home-hero-description\s*\{[^}]+\}/s)?.[0] ?? "";

  assert.equal(heroSource.includes("home-hero-readability-scrim"), false);
  assert.equal(cssSource.includes(".home-hero-readability-scrim"), false);
  assert.equal(descriptionBlock.includes(".home-hero-description"), true);
  assert.equal(descriptionBlock.includes("display: inline-block"), true);
  assert.equal(descriptionBlock.includes("background: rgba(255, 253, 248, 0.32)"), true);
  assert.equal(descriptionBlock.includes("backdrop-filter: blur(2px)"), true);
  assert.equal(descriptionBlock.includes("border-radius: 0.9rem"), true);
  assert.equal(descriptionBlock.includes("box-shadow"), true);
});

test("hero renders the post-intro image slider without replacing the current intro image", () => {
  const source = readFileSync("src/components/home/Hero.tsx", "utf8");

  assert.equal(source.includes('import { HeroImageSlider } from "@/components/home/HeroImageSlider";'), true);
  assert.equal(source.includes('import { mainHeroIntroSlide, mainHeroSlides } from "@/lib/main-hero-slides";'), true);
  assert.equal(source.includes("<HeroImageSlider"), true);
  assert.equal(source.includes("introSlide={mainHeroIntroSlide}"), true);
  assert.equal(source.includes("slides={mainHeroSlides}"), true);
});

test("main hero slider assets exist for every referenced webp image", () => {
  const slideDataPath = "src/lib/main-hero-slides.ts";

  assert.equal(existsSync(slideDataPath), true);

  const source = readFileSync(slideDataPath, "utf8");
  const referencedImagePaths = [...source.matchAll(/src: "([^"]+\.webp)"/g)].map((match) => match[1]);

  assert.equal(referencedImagePaths.length > 0, true);
  referencedImagePaths.forEach((imagePath) => {
    assert.equal(existsSync(`public${imagePath}`), true);
  });
});

test("main hero slider excludes removed images", () => {
  const source = readFileSync("src/lib/main-hero-slides.ts", "utf8");

  assert.equal(source.includes("/images/main-slider/main-hero-03.webp"), false);
  assert.equal(source.includes("/images/main-slider/main-hero-04.webp"), false);
});

test("main hero first image uses the selected main-hero-00 asset", () => {
  const heroSource = readFileSync("src/components/home/Hero.tsx", "utf8");
  const slideSource = readFileSync("src/lib/main-hero-slides.ts", "utf8");

  assert.equal(existsSync("public/images/main-slider/main-hero-00.webp"), true);
  assert.equal(heroSource.includes('src="/images/main-slider/main-hero-00.webp"'), true);
  assert.equal(slideSource.includes('src: "/images/main-slider/main-hero-00.webp"'), true);
  assert.equal(slideSource.includes("export const mainHeroSlides: MainHeroSlide[] = [\n  mainHeroIntroSlide,"), true);
  assert.equal(heroSource.includes('src="/images/hero-sunset-boat.webp"'), false);
  assert.equal(slideSource.includes('src: "/images/hero-sunset-boat.webp"'), false);
});

test("hero slider waits for the page motion completion event and autoplays without arrow controls", () => {
  const sliderPath = "src/components/home/HeroImageSlider.tsx";

  assert.equal(existsSync(sliderPath), true);

  const source = readFileSync(sliderPath, "utf8");

  assert.equal(source.includes('"motion/react"'), true);
  assert.equal(source.includes("home-hero-motion-complete"), true);
  assert.equal(source.includes("setInterval"), true);
  assert.equal(source.includes('aria-label="Previous hero image"'), false);
  assert.equal(source.includes('aria-label="Next hero image"'), false);
  assert.equal(source.includes("CaretLeft"), false);
  assert.equal(source.includes("CaretRight"), false);
  assert.equal(source.includes("goToOffset"), false);
});

test("hero slider image transition lets the new image cover from the right", () => {
  const source = readFileSync("src/components/home/HeroImageSlider.tsx", "utf8");

  assert.equal(source.includes("const [settledIndex, setSettledIndex] = useState(0);"), true);
  assert.equal(source.includes("const [incomingIndex, setIncomingIndex] = useState<number | null>(null);"), true);
  assert.equal(source.includes("const settledSlide = slides[settledIndex] ?? introSlide;"), true);
  assert.equal(source.includes("const incomingSlide = incomingIndex === null ? null : (slides[incomingIndex] ?? introSlide);"), true);
  assert.equal(source.includes("onAnimationComplete={handleIncomingComplete}"), true);
  assert.equal(source.includes("src={settledSlide.src}"), true);
  assert.equal(source.includes("src={incomingSlide.src}"), true);
  assert.equal(source.includes('initial={shouldReduceSliderMotion ? false : { x: "100%" }}'), true);
  assert.equal(source.includes('animate={{ x: "0%" }}'), true);
  assert.equal(source.includes("exit="), false);
  assert.equal(source.includes('x: "-100%"'), false);
  assert.equal(source.includes("scale: 1.015"), false);
});

test("hero slider animates by default and only disables motion through an explicit query", () => {
  const source = readFileSync("src/components/home/HeroImageSlider.tsx", "utf8");

  assert.equal(source.includes("const [isDebugMode] = useState(getIsDebugMode);"), true);
  assert.equal(source.includes("useReducedMotion"), false);
  assert.equal(source.includes('new URLSearchParams(window.location.search).get("motion") === "debug"'), true);
  assert.equal(source.includes('motionParam === "off" || motionParam === "reduce"'), true);
  assert.equal(source.includes("const [shouldReduceSliderMotion] = useState(getShouldReduceSliderMotion);"), true);
  assert.equal(source.includes('initial={shouldReduceSliderMotion ? false : { x: "100%" }}'), true);
  assert.equal(source.includes("transition={{ duration: shouldReduceSliderMotion ? 0 : 0.78"), true);
  assert.equal(source.includes("if (shouldReduceMotion)"), false);
});

test("home hero motion dispatches a completion event for the slider", () => {
  const source = readFileSync("src/components/motion/PageMotion.tsx", "utf8");

  assert.equal(source.includes('new CustomEvent("home-hero-motion-complete")'), true);
});
