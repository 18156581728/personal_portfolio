<script setup lang="ts">
defineProps<{
  index: string;
  eyebrow: string;
  title: string;
  headingId: string;
}>();
</script>

<template>
  <div class="section-heading">
    <p class="eyebrow">
      <span>{{ index }}</span>
      <span class="eyebrow__line" />
      {{ eyebrow }}
    </p>
    <h2 :id="headingId">{{ title }}</h2>
  </div>
</template>
