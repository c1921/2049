<template>
  <div id="app">
    <ContactList v-if="!selectedContact" @select="handleSelectContact" />
    <ChatWindow v-else :contact="selectedContact" @back="handleBack" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ContactList from './components/ContactList.vue';
import ChatWindow from './components/ChatWindow.vue';

export default defineComponent({
  components: {
    ContactList,
    ChatWindow,
  },
  setup() {
    const selectedContact = ref<{ id: number; name: string } | null>(null);


    const handleSelectContact = (contact: { id: number; name: string }) => {
      selectedContact.value = contact;
    };

    const handleBack = () => {
      selectedContact.value = null;
    };

    return {
      selectedContact,
      handleSelectContact,
      handleBack,
    };
  },
});
</script>
