<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import { navigationItems } from "../data/navigation";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  navigate: [id: string];
}>();

const panel = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;

function closeAndRestore(): void {
  emit("close");
  nextTick(() => previousFocus?.focus());
}

function handleNavigate(id: string): void {
  closeAndRestore();
  // 等菜单遮罩解除后再滚动，避免移动端锁滚动与平滑滚动互相竞争。
  window.requestAnimationFrame(() => emit("navigate", id));
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    closeAndRestore();
    return;
  }
  if (event.key !== "Tab" || !panel.value) return;

  const focusable = [...panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement;
      document.body.classList.add("menu-open");
      await nextTick();
      closeButton.value?.focus();
    } else {
      document.body.classList.remove("menu-open");
    }
  },
);

onUnmounted(() => document.body.classList.remove("menu-open"));
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-fade">
      <div
        v-if="open"
        id="mobile-navigation"
        ref="panel"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
        @keydown="handleKeydown"
      >
        <div class="mobile-menu__glow" aria-hidden="true" />
        <div class="mobile-menu__top">
          <span class="eyebrow">{{ profile.englishName }} / MENU</span>
          <button
            ref="closeButton"
            type="button"
            class="menu-button"
            aria-label="关闭导航菜单"
            @click="closeAndRestore"
          >
            <AppIcon name="close" :size="23" />
          </button>
        </div>

        <nav class="mobile-menu__nav" aria-label="移动端主导航">
          <a
            v-for="item in navigationItems"
            :key="item.id"
            :href="item.href"
            class="mobile-menu__link"
            @click.prevent="handleNavigate(item.id)"
          >
            <span>{{ item.index }}</span>
            <strong>{{ item.label }}</strong>
            <AppIcon name="arrow-right" :size="20" />
          </a>
        </nav>

        <div class="mobile-menu__footer">
          <a
            v-if="profile.resumeUrl"
            :href="profile.resumeUrl"
            class="button button--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            下载简历
          </a>
          <div class="flex gap-3">
            <a
              v-for="social in profile.socials"
              :key="social.label"
              :href="social.href"
              class="icon-link"
              :aria-label="social.label"
              :target="social.href.startsWith('mailto:') ? undefined : '_blank'"
              :rel="social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
            >
              <AppIcon :name="social.icon" :size="19" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
