<template>
  <div class="p-4 border-t border-base-300 flex justify-center">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="btn btn-primary flex-1 m-1"
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
