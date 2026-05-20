"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { animate, inView, stagger, type AnimationPlaybackControls } from "motion";
import { MotionConfig, motion, type Transition, useReducedMotion } from "motion/react";

type DomReveal = {
  initial: string;
  enter: string;
  duration: number;
  delay?: number;
  stagger?: number;
};

type MotionProfile = {
  name: string;
  label: string;
  pageInitial: {
    opacity: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  };
  pageTransition: Transition;
  section: DomReveal;
  component: DomReveal;
  media: DomReveal;
  viewportMargin: `${number}px ${number}px ${number}% ${number}px`;
};

const softEase = [0.16, 1, 0.3, 1] as const;

const profiles = {
  home: {
    name: "home",
    label: "Home",
    pageInitial: { opacity: 0 },
    pageTransition: { duration: 0.24, ease: softEase },
    section: {
      initial: "translate3d(0, 86px, 0) scale(0.965)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.98,
      stagger: 0.1,
    },
    component: {
      initial: "translate3d(0, 56px, 0) scale(0.965)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.82,
      stagger: 0.08,
    },
    media: {
      initial: "translate3d(0, 22px, 0) scale(1.08)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 1.05,
    },
    viewportMargin: "0px 0px -14% 0px",
  },
  activity: {
    name: "activity",
    label: "Activity",
    pageInitial: { opacity: 0, x: -26, scale: 0.992 },
    pageTransition: { duration: 0.32, ease: softEase },
    section: {
      initial: "translate3d(-88px, 52px, 0) scale(0.965)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.92,
      stagger: 0.09,
    },
    component: {
      initial: "translate3d(72px, 0, 0) scale(0.965)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.76,
      stagger: 0.065,
    },
    media: {
      initial: "translate3d(0, 0, 0) scale(1.095)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.96,
    },
    viewportMargin: "0px 0px -12% 0px",
  },
  collection: {
    name: "collection",
    label: "Collection",
    pageInitial: { opacity: 0, y: 26, scale: 0.986 },
    pageTransition: { duration: 0.34, ease: softEase },
    section: {
      initial: "translate3d(0, 72px, 0) scale(0.955)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.84,
      stagger: 0.07,
    },
    component: {
      initial: "translate3d(0, 42px, 0) scale(0.92)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.68,
      stagger: 0.055,
    },
    media: {
      initial: "translate3d(0, 0, 0) scale(1.075)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.9,
    },
    viewportMargin: "0px 0px -10% 0px",
  },
  reservation: {
    name: "reservation",
    label: "Reservation",
    pageInitial: { opacity: 0, y: 22, scale: 0.994 },
    pageTransition: { duration: 0.3, ease: softEase },
    section: {
      initial: "translate3d(0, 42px, 0) scale(0.985)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.62,
      stagger: 0.05,
    },
    component: {
      initial: "translate3d(0, 26px, 0) scale(0.985)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.52,
      stagger: 0.04,
    },
    media: {
      initial: "translate3d(0, 14px, 0) scale(1.035)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.72,
    },
    viewportMargin: "0px 0px -12% 0px",
  },
  admin: {
    name: "admin",
    label: "Admin",
    pageInitial: { opacity: 0, y: 18 },
    pageTransition: { duration: 0.28, ease: softEase },
    section: {
      initial: "translate3d(0, 20px, 0)",
      enter: "translate3d(0, 0, 0)",
      duration: 0.38,
      stagger: 0.025,
    },
    component: {
      initial: "translate3d(0, 18px, 0)",
      enter: "translate3d(0, 0, 0)",
      duration: 0.34,
      stagger: 0.025,
    },
    media: {
      initial: "translate3d(0, 0, 0) scale(1.01)",
      enter: "translate3d(0, 0, 0) scale(1)",
      duration: 0.42,
    },
    viewportMargin: "0px 0px -8% 0px",
  },
} satisfies Record<string, MotionProfile>;

function resolveProfile(pathname: string): MotionProfile {
  if (pathname === "/") {
    return profiles.home;
  }

  if (pathname.startsWith("/admin")) {
    return profiles.admin;
  }

  if (pathname.startsWith("/reservation")) {
    return profiles.reservation;
  }

  if (pathname.startsWith("/activities") || pathname.startsWith("/water-ski-atv")) {
    return profiles.activity;
  }

  if (pathname.startsWith("/gallery") || pathname.startsWith("/showcase") || pathname.startsWith("/videos") || pathname.startsWith("/stay")) {
    return profiles.collection;
  }

  return profiles.reservation;
}

function isVisibleElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement) || element.closest("[data-motion-skip]")) {
    return false;
  }

  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

function uniqueElements(elements: Element[]): HTMLElement[] {
  return Array.from(new Set(elements)).filter(isVisibleElement);
}

function setInitialStyle(element: HTMLElement, transform: string) {
  element.style.opacity = "0";
  element.style.transform = transform;
  element.style.willChange = "transform, opacity";
}

function clearMotionStyle(element: HTMLElement) {
  element.style.opacity = "";
  element.style.transform = "";
  element.style.willChange = "";
  delete element.dataset.motionPrepared;
}

function revealElement(element: HTMLElement, reveal: DomReveal, debugScale: number) {
  element.dataset.motionRevealed = "true";

  const control = animate(
    element,
    { opacity: [0, 1], transform: [reveal.initial, reveal.enter] },
    { duration: reveal.duration * debugScale, delay: (reveal.delay ?? 0) * debugScale, ease: softEase },
  );

  void control.finished.then(() => clearMotionStyle(element));
  return control;
}

function revealGroup(elements: HTMLElement[], reveal: DomReveal, debugScale: number) {
  const unrevealedElements = elements.filter((element) => element.dataset.motionRevealed !== "true");

  if (unrevealedElements.length === 0) {
    return [];
  }

  unrevealedElements.forEach((element) => {
    element.dataset.motionRevealed = "true";
    setInitialStyle(element, reveal.initial);
  });

  const controls = animate(
    unrevealedElements,
    { opacity: [0, 1], transform: [reveal.initial, reveal.enter] },
    {
      duration: reveal.duration * debugScale,
      delay: stagger((reveal.stagger ?? 0.05) * debugScale),
      ease: softEase,
    },
  );

  void controls.finished.then(() => {
    unrevealedElements.forEach(clearMotionStyle);
  });

  return [controls];
}

function getSectionTargets(scope: HTMLElement) {
  return uniqueElements(Array.from(scope.querySelectorAll("main > section, main > article, main > form")));
}

function getComponentTargets(section: HTMLElement) {
  return uniqueElements(
    Array.from(
      section.querySelectorAll(
        [
          ":scope .depth-panel",
          ":scope .depth-panel-quiet",
          ":scope article",
          ":scope form",
          ":scope table",
          ":scope [role='listitem']",
          ":scope li",
          ":scope nav[aria-label]",
        ].join(", "),
      ),
    ),
  )
    .filter((element) => element !== section)
    .slice(0, 18);
}

function getMediaTargets(scope: HTMLElement) {
  return uniqueElements(Array.from(scope.querySelectorAll("main .image-lift, main [data-motion-media]"))).slice(0, 28);
}

function useScrollReveals(scopeRef: React.RefObject<HTMLDivElement | null>, profile: MotionProfile, debugScale: number, isReducedMotion: boolean) {
  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope || isReducedMotion) {
      scope?.querySelectorAll<HTMLElement>("[data-motion-prepared='true']").forEach(clearMotionStyle);
      return;
    }

    const cleanupFns: Array<() => void> = [];
    const activeControls: AnimationPlaybackControls[] = [];
    const sections = getSectionTargets(scope);
    const [, ...scrollSections] = sections;
    const componentTargets: HTMLElement[] = uniqueElements(sections.flatMap((section) => getComponentTargets(section)));
    const mediaTargets = getMediaTargets(scope);

    const prepare = (element: HTMLElement, transform: string) => {
      setInitialStyle(element, transform);
      element.dataset.motionPrepared = "true";
    };

    scrollSections.forEach((section, index) => {
      prepare(section, index % 2 === 0 || profile.name !== "activity" ? profile.section.initial : "translate3d(56px, 36px, 0) scale(0.98)");
      cleanupFns.push(
        inView(
          section,
          () => {
            activeControls.push(revealElement(section, profile.section, debugScale));
          },
          { margin: "0px 0px 0px 0px", amount: "some" },
        ),
      );
    });

    if (componentTargets.length > 0) {
      componentTargets.forEach((element) => prepare(element, profile.component.initial));
      cleanupFns.push(
        inView(
          componentTargets,
          (element) => {
            if (!(element instanceof HTMLElement)) {
              return;
            }

            const nearby = componentTargets.filter((target) => {
              const targetTop = target.getBoundingClientRect().top;
              const elementTop = element.getBoundingClientRect().top;
              return Math.abs(targetTop - elementTop) < 120 && target.dataset.motionPrepared === "true";
            });

            activeControls.push(...revealGroup(nearby.length > 0 ? nearby : [element], profile.component, debugScale));
          },
          { margin: profile.viewportMargin, amount: 0.14 },
        ),
      );
    }

    mediaTargets.forEach((element) => prepare(element, profile.media.initial));
    mediaTargets.forEach((element) => {
      cleanupFns.push(
        inView(
          element,
          () => {
            activeControls.push(revealElement(element, profile.media, debugScale));
          },
          { margin: "0px 0px -8% 0px", amount: 0.2 },
        ),
      );
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      activeControls.forEach((control) => control.stop());
      [...scrollSections, ...componentTargets, ...mediaTargets].forEach(clearMotionStyle);
    };
  }, [debugScale, isReducedMotion, profile, scopeRef]);
}

function clearHomeHeroStyle(elements: HTMLElement[]) {
  elements.forEach((element) => {
    element.style.opacity = "";
    element.style.transform = "";
    element.style.filter = "";
    element.style.clipPath = "";
    element.style.willChange = "";
  });
}

function useHomeHeroMotion(scopeRef: React.RefObject<HTMLDivElement | null>, pathname: string, debugScale: number) {
  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope || pathname !== "/") {
      return;
    }

    const heroStage = scope.querySelector<HTMLElement>(".home-hero-stage");
    const heroImage = scope.querySelector<HTMLElement>(".home-hero-image");
    const heroCopy = scope.querySelector<HTMLElement>(".home-hero-copy");
    const heroSweep = scope.querySelector<HTMLElement>(".home-hero-light-sweep");
    const heroItems = Array.from(scope.querySelectorAll<HTMLElement>(".home-hero-title, .home-hero-description, .home-hero-actions"));

    if (!heroStage || !heroImage || !heroCopy) {
      return;
    }

    const animatedElements = [heroStage, heroImage, heroCopy, heroSweep, ...heroItems].filter(Boolean) as HTMLElement[];
    const controls: AnimationPlaybackControls[] = [];

    heroStage.style.clipPath = "polygon(0 0, 100% 0, 100% 0, 0 0)";
    heroStage.style.willChange = "clip-path";
    heroImage.style.transform = "scale(1.16) rotate(-0.8deg)";
    heroImage.style.filter = "contrast(1.08) brightness(1.14) saturate(1.12)";
    heroImage.style.willChange = "transform, filter";
    heroCopy.style.opacity = "0";
    heroCopy.style.transform = "translate3d(0, 28px, 0) scale(0.985)";
    heroCopy.style.willChange = "transform, opacity";

    heroItems.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translate3d(0, 24px, 0)";
      element.style.willChange = "transform, opacity";
    });

    if (heroSweep) {
      heroSweep.style.opacity = "0";
      heroSweep.style.transform = "translate3d(-34%, 0, 0) rotate(0.001deg)";
      heroSweep.style.willChange = "transform, opacity";
    }

    controls.push(
      animate(
        heroStage,
        { clipPath: ["polygon(0 0, 100% 0, 100% 0, 0 0)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"] },
        { duration: 0.68 * debugScale, ease: softEase },
      ),
    );

    controls.push(
      animate(
        heroImage,
        {
          filter: ["contrast(1.08) brightness(1.14) saturate(1.12)", "contrast(1.03) brightness(1.04) saturate(1.04)"],
          transform: ["scale(1.16) rotate(-0.8deg)", "scale(1.02) rotate(0deg)"],
        },
        { duration: 1.08 * debugScale, ease: softEase },
      ),
    );

    controls.push(
      animate(
        heroCopy,
        { opacity: [0, 1], transform: ["translate3d(0, 28px, 0) scale(0.985)", "translate3d(0, 0, 0) scale(1)"] },
        { duration: 0.54 * debugScale, delay: 0.16 * debugScale, ease: softEase },
      ),
    );

    if (heroItems.length > 0) {
      controls.push(
        animate(
          heroItems,
          { opacity: [0, 1], transform: ["translate3d(0, 24px, 0)", "translate3d(0, 0, 0)"] },
          { duration: 0.48 * debugScale, delay: stagger(0.07 * debugScale, { startDelay: 0.26 * debugScale }), ease: softEase },
        ),
      );
    }

    if (heroSweep) {
      controls.push(
        animate(
          heroSweep,
          {
            opacity: [0, 0.9, 0],
            transform: ["translate3d(-34%, 0, 0) rotate(0.001deg)", "translate3d(22%, 0, 0) rotate(0.001deg)", "translate3d(58%, 0, 0) rotate(0.001deg)"],
          },
          { duration: 0.98 * debugScale, delay: 0.12 * debugScale, ease: softEase },
        ),
      );
    }

    void Promise.all(controls.map((control) => control.finished.catch(() => undefined))).then(() => {
      clearHomeHeroStyle(animatedElements);
    });

    return () => {
      controls.forEach((control) => control.stop());
      clearHomeHeroStyle(animatedElements);
    };
  }, [debugScale, pathname, scopeRef]);
}

export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const scopeRef = useRef<HTMLDivElement>(null);
  const profile = useMemo(() => resolveProfile(pathname), [pathname]);
  const [isDebugMode, setIsDebugMode] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("motion") === "debug");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsDebugMode(new URLSearchParams(window.location.search).get("motion") === "debug");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  const debugScale = 1;
  const shouldReduceMotion = false;

  useScrollReveals(scopeRef, profile, debugScale, shouldReduceMotion && !isDebugMode);
  useHomeHeroMotion(scopeRef, pathname, debugScale);

  return (
    <MotionConfig reducedMotion="never">
      <div
        ref={scopeRef}
        className="page-motion-shell"
        data-motion-profile={profile.name}
        data-motion-debug={isDebugMode ? "true" : "false"}
        data-prefers-reduced-motion={prefersReducedMotion ? "true" : "false"}
      >
        <span className="page-motion-debug" aria-hidden="true">
          Motion {profile.label}
        </span>
        <motion.div
          key={pathname}
          className="page-motion-view"
          initial={shouldReduceMotion && !isDebugMode ? false : profile.pageInitial}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          transition={profile.pageTransition}
        >
          {children}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
