<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AboutSection from "../components/AboutSection.vue";
import ContactSection from "../components/ContactSection.vue";
import ExperienceSection from "../components/ExperienceSection.vue";
import IdentityBlock from "../components/IdentityBlock.vue";
import MobileMenu from "../components/MobileMenu.vue";
import ProjectsSection from "../components/ProjectsSection.vue";
import Sidebar from "../components/Sidebar.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";
import SkillsSection from "../components/SkillsSection.vue";
import { useActiveSection } from "../composables/useActiveSection";
import { useScrollReveal } from "../composables/useScrollReveal";

const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();
const { activeSection, navigateToSection } = useActiveSection();
const sectionPaths: Record<string, string> = {
  home: "/",
  projects: "/projects",
  about: "/about",
  skills: "/skills",
  experience: "/experience",
  contact: "/contact",
};
const sectionByPath = Object.fromEntries(
  Object.entries(sectionPaths).map(([id, path]) => [path, id]),
);
let pendingInitialSection =
  sectionByPath[route.path] && sectionByPath[route.path] !== "projects"
    ? sectionByPath[route.path]
    : null;

function navigate(id: string): void {
  const path = sectionPaths[id];
  if (path && route.path !== path) {
    void router.push(path);
  }
  navigateToSection(id);
}

function focusMainContent(): void {
  document.getElementById("main-content")?.focus();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function handleProjectsLoaded(): void {
  if (!pendingInitialSection) return;
  const section = pendingInitialSection;
  pendingInitialSection = null;
  window.requestAnimationFrame(() => navigateToSection(section));
}

watch(
  () => route.path,
  async (path) => {
    const section = sectionByPath[path];
    if (!section) return;
    await nextTick();
    window.requestAnimationFrame(() => navigateToSection(section));
  },
  { immediate: true },
);

onMounted(() => {
  const legacySection = route.hash.slice(1);
  const legacyPath = sectionPaths[legacySection];
  if (legacyPath) {
    void router.replace(legacyPath);
  }
});

useScrollReveal();
</script>

<template>
  <div class="portfolio-page">
    <a class="skip-link" href="/" @click.prevent="focusMainContent">
      跳到主要内容
    </a>
    <div class="ambient ambient--one" aria-hidden="true" />
    <div class="ambient ambient--two" aria-hidden="true" />
    <div class="ambient ambient--three" aria-hidden="true" />

    <SiteHeader :menu-open="menuOpen" @open-menu="menuOpen = true" />
    <MobileMenu
      :open="menuOpen"
      @close="menuOpen = false"
      @navigate="navigate"
    />

    <div class="portfolio-layout">
      <Sidebar
        :active-section="activeSection"
        @navigate="navigate"
      />

      <main id="main-content" class="main-column" tabindex="-1">
        <section
          id="home"
          class="mobile-hero lg:hidden"
          aria-label="个人简介"
        >
          <IdentityBlock compact />
        </section>

        <ProjectsSection @loaded="handleProjectsLoaded" />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
        <SiteFooter />
      </main>
    </div>
  </div>
</template>
