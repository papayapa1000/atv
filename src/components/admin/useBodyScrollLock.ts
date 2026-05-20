"use client";

import { useEffect } from "react";

let activeLockCount = 0;
let previousOverflow = "";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    if (activeLockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    activeLockCount += 1;

    return () => {
      activeLockCount = Math.max(activeLockCount - 1, 0);

      if (activeLockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [locked]);
}
