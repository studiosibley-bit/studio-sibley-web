"use client";

import { useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ease } from "@/lib/motion";

const EXIT_COMPLETE_EVENT = "pagetransition:exitcomplete";
const RESTORING_CLASS = "pt-restoring";

/**
 * Call from a "back" link's onNavigate, alongside saving the scroll position
 * to restore. Synchronously adds a class to <html> that a static rule in
 * globals.css uses to hide every `data-pt-content` element, before
 * navigation/rendering begins.
 *
 * This can't be scoped to a specific pathname (e.g. a `[data-pt-page="/x"]`
 * selector) or driven by per-instance React state: during this transition,
 * the page actually rendering the destination route's content can briefly do
 * so under a Fiber whose `pathname` prop is still the PREVIOUS route (Next
 * can swap which route segment `{children}` resolves to slightly before
 * `usePathname()` catches up on that same instance) — confirmed by direct
 * inspection, not theory. A pathname-matched attribute then fails to match
 * the very content it's supposed to hide. Hiding ALL `data-pt-content`
 * elements unconditionally during the restore window sidesteps the whole
 * problem: it doesn't matter which Fiber/instance is currently rendering
 * what, or how many of them there are.
 */
export function armScrollRestore(pathname: string) {
  sessionStorage.setItem(`restoreScroll:${pathname}`, "1");
  document.documentElement.classList.add(RESTORING_CLASS);
}

function clearRestoringClass() {
  document.documentElement.classList.remove(RESTORING_CLASS);
}

function PageContent({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  useLayoutEffect(() => {
    const flagKey = `restoreScroll:${pathname}`;
    if (!sessionStorage.getItem(flagKey)) return;

    function applyRestore() {
      sessionStorage.removeItem(flagKey);
      const saved = sessionStorage.getItem(`scrollY:${pathname}`);
      window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, left: 0, behavior: "instant" });
      clearRestoringClass();
    }

    // The outgoing page is still mounted during the crossfade (mode="sync"),
    // so restoring scroll the instant this page mounts applies it against a
    // temporarily taller, not-yet-settled layout. Worse, React doesn't
    // actually flush the old page's DOM removal until a tick after
    // onExitComplete fires, and that removal triggers its own reflow that
    // resets scroll again — so we wait two more frames past exit-complete
    // for that to settle. Content stays hidden via the global `.pt-restoring`
    // class from `armScrollRestore` the entire time, so none of this is ever
    // visible.
    let raf1 = 0;
    let raf2 = 0;
    function onExitComplete() {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(applyRestore);
      });
    }
    window.addEventListener(EXIT_COMPLETE_EVENT, onExitComplete, { once: true });
    return () => {
      window.removeEventListener(EXIT_COMPLETE_EVENT, onExitComplete);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease }}
      style={{ display: "contents" }}
    >
      {/* `display: contents` above means opacity/transform never actually
          render on that element (no box for them to apply to) — pages have
          always appeared instantly, not faded. Don't rely on it for visual
          hiding. `data-pt-content` is the hook the global `.pt-restoring`
          rule in globals.css targets — see `armScrollRestore` above for why
          this is intentionally NOT scoped to this instance's own pathname. */}
      <div data-pt-content>{children}</div>
    </motion.div>
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence
      mode="sync"
      onExitComplete={() => window.dispatchEvent(new Event(EXIT_COMPLETE_EVENT))}
    >
      <PageContent key={pathname} pathname={pathname}>
        {children}
      </PageContent>
    </AnimatePresence>
  );
}
