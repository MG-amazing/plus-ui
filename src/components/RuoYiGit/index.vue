<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup lang="ts">
const url = ref('https://github.com/MG-amazing/RuoYi-Vue-Plus-Excel');

function goto() {
  window.open(url.value);
}
</script>
