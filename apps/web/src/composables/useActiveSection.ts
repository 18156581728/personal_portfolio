import { onMounted, onUnmounted, ref } from "vue";

export const sectionIds = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const;

type SectionId = (typeof sectionIds)[number];

/**
 * 滚动高亮与锚点导航。
 * 点击导航时先锁定目标，避免平滑滚动途经其他区块时高亮来回闪烁。
 */
export function useActiveSection() {
  const activeSection = ref<string>("home");
  let lockedSection: SectionId | null = null;
  let releaseTimer: number | undefined;
  let frameId: number | undefined;

  function visibleTargets(): HTMLElement[] {
    return sectionIds
      .map((id) => document.getElementById(id))
      .filter(
        (element): element is HTMLElement =>
          element !== null && element.getClientRects().length > 0,
      )
      .sort((a, b) => a.offsetTop - b.offsetTop);
  }

  function updateActiveSection(): void {
    if (lockedSection) return;

    const targets = visibleTargets();
    if (!targets.length) return;

    const pageBottom = document.documentElement.scrollHeight;
    const reachedBottom =
      window.scrollY + window.innerHeight >= pageBottom - 2;
    if (reachedBottom) {
      activeSection.value = targets.at(-1)?.id || "contact";
      return;
    }

    const marker = window.scrollY + window.innerHeight * 0.32;
    let current: SectionId = "home";

    for (const target of targets) {
      if (target.offsetTop > marker) break;
      current = target.id as SectionId;
    }

    activeSection.value = current;
  }

  function scheduleUpdate(): void {
    if (frameId !== undefined) return;
    frameId = window.requestAnimationFrame(() => {
      frameId = undefined;
      updateActiveSection();
    });
  }

  function releaseNavigationLock(): void {
    lockedSection = null;
    window.clearTimeout(releaseTimer);
    releaseTimer = undefined;
    scheduleUpdate();
  }

  function navigateToSection(id: string): void {
    if (!sectionIds.includes(id as SectionId)) return;
    const section = document.getElementById(id);
    if (!section) return;

    // 连续点击时只保留最后一次目标，避免旧计时器提前解除新锁定。
    lockedSection = id as SectionId;
    activeSection.value = id;
    window.clearTimeout(releaseTimer);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    // 平滑滚动期间保持目标高亮；每次新点击都会重置释放时间。
    releaseTimer = window.setTimeout(releaseNavigationLock, 1400);
  }

  onMounted(() => {
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    updateActiveSection();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.clearTimeout(releaseTimer);
    if (frameId !== undefined) window.cancelAnimationFrame(frameId);
  });

  return { activeSection, navigateToSection };
}
