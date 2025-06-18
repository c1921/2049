<template>
  <div id="app" class="flex flex-col md:flex-row h-screen">
    <div class="md:w-1/3" :class="{'hidden md:block': selectedContact}">
      <ContactList @select="handleSelectContact" />
    </div>
    <div class="flex-1" :class="{'hidden': !selectedContact, 'md:block': selectedContact}">
      <ChatWindow v-if="selectedContact" :contact="selectedContact" :key="selectedContact.id" @back="handleBack" />
      <div v-else class="flex h-full items-center justify-center bg-base-200">
        <p class="text-base-content/50">请选择一个联系人开始聊天</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ContactList from './components/ContactList.vue';
import ChatWindow from './components/ChatWindow.vue';

export default defineComponent({
  components: {
    ContactList,
    ChatWindow,
  },
  setup() {
    const selectedContact = ref<{ id: number; name: string } | null>(null);

    onMounted(() => {
      setTimeout(() => window.HSStaticMethods.autoInit(), 100)
    });

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
