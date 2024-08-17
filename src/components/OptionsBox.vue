<template>
  <div class="options-box">
    <div class="buttons">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="button is-primary"
        @click="$emit('select', index)"
      >
        {{ option.text[0] }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DialogueOption } from '../dialogues/types';

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<DialogueOption[]>,
      required: true,
    },
  },
  emits: ['select'],
});
</script>

<style scoped>
.options-box {
  padding: 1rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button {
  flex: 1;
  margin: 0.25rem;
}
</style>
