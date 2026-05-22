"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { MainHeroSlide } from "@/lib/main-hero-slides";

const HERO_MOTION_COMPLETE_EVENT = "home-hero-motion-complete";
const AUTO_SLIDE_INTERVAL_MS = 5200;
const INTRO_FALLBACK_MS = 1800;
const DEBUG_INTRO_FALLBACK_MS = 6200;

function getIsDebugMode() {
  return typeof window !== "undefined" && new URLSearchParams(window.location.search).get("motion") === "debug";
}

function getShouldReduceSliderMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  const motionParam = new URLSearchParams(window.location.search).get("motion");

  return motionParam === "off" || motionParam === "reduce";
}

type HeroImageSliderProps = {
  introSlide: MainHeroSlide;
  slides: MainHeroSlide[];
};

export function HeroImageSlider({ introSlide, slides }: HeroImageSliderProps) {
  const [isDebugMode] = useState(getIsDebugMode);
  const [shouldReduceSliderMotion] = useState(getShouldReduceSliderMotion);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const [settledIndex, setSettledIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const hasSlides = slides.length > 0;

  const startSlider = useCallback(() => {
    if (!hasSlides) {
      return;
    }

    setIsSliderReady(true);
  }, [hasSlides]);

  useEffect(() => {
    if (!hasSlides) {
      return;
    }

    if (shouldReduceSliderMotion) {
      const readyId = window.setTimeout(startSlider, 0);

      return () => {
        window.clearTimeout(readyId);
      };
    }

    const fallbackMs = isDebugMode ? DEBUG_INTRO_FALLBACK_MS : INTRO_FALLBACK_MS;
    const fallbackId = window.setTimeout(startSlider, fallbackMs);

    window.addEventListener(HERO_MOTION_COMPLETE_EVENT, startSlider, { once: true });

    return () => {
      window.clearTimeout(fallbackId);
      window.removeEventListener(HERO_MOTION_COMPLETE_EVENT, startSlider);
    };
  }, [hasSlides, isDebugMode, shouldReduceSliderMotion, startSlider]);

  useEffect(() => {
    if (!isSliderReady || slides.length <= 1 || incomingIndex !== null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = (settledIndex + 1) % slides.length;

      if (shouldReduceSliderMotion) {
        setSettledIndex(nextIndex);
        return;
      }

      setIncomingIndex(nextIndex);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [incomingIndex, isSliderReady, settledIndex, shouldReduceSliderMotion, slides.length]);

  if (!isSliderReady || !hasSlides) {
    return null;
  }

  const settledSlide = slides[settledIndex] ?? introSlide;
  const incomingSlide = incomingIndex === null ? null : (slides[incomingIndex] ?? introSlide);

  const handleIncomingComplete = () => {
    if (incomingIndex === null) {
      return;
    }

    setSettledIndex(incomingIndex);
    setIncomingIndex(null);
  };

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={settledSlide.src}
          alt={settledSlide.alt}
          fill
          loading="eager"
          sizes="100vw"
          className="home-hero-image hero-kenburns object-cover object-[58%_50%]"
        />
      </div>
      {incomingSlide ? (
        <motion.div
          key={incomingSlide.src}
          className="absolute inset-0 z-[1]"
          initial={shouldReduceSliderMotion ? false : { x: "100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: shouldReduceSliderMotion ? 0 : 0.78, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={handleIncomingComplete}
        >
          <Image
            src={incomingSlide.src}
            alt={incomingSlide.alt}
            fill
            loading="eager"
            sizes="100vw"
            className="home-hero-image hero-kenburns object-cover object-[58%_50%]"
          />
        </motion.div>
      ) : null}
    </>
  );
}
