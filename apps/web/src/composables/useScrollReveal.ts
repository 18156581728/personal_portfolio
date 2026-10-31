import { onMounted, onUnmounted } from "vue";

/** 只为区块添加进入动画；系统偏好减少动效时完全跳过。 */
export function useScrollReveal() {
  let observer: IntersectionObserver | undefined;
  let mutationObserver: MutationObserver | undefined;

  onMounted(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("reveal-ready");
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => observer?.observe(element));

    // 项目列表由接口异步渲染，动态节点也需要纳入进入动画。
    mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-reveal]:not(.is-visible)")) {
            observer?.observe(node);
          }
          node
            .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
            .forEach((element) => observer?.observe(element));
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    document.documentElement.classList.remove("reveal-ready");
  });
}
