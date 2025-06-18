<template>
  <div class="h-full bg-base-100 border-r border-base-300 rounded-lg">
    <ul class="menu bg-base-200 rounded-lg p-2">
      <li v-for="contact in contacts" :key="contact.id" @click="selectContact(contact)">
        <a class="flex items-center p-3 hover:bg-primary hover:text-primary-content rounded-md transition-colors">
          <span class="avatar placeholder mr-2">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
              <span>{{ contact.name.charAt(0) }}</span>
            </div>
          </span>
          {{ contact.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['select'],
  setup(_, { emit }) {
    const contacts = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ];

    const selectContact = (contact: { id: number; name: string }) => {
      emit('select', contact);
    };

    return {
      contacts,
      selectContact,
    };
  },
});
</script>
