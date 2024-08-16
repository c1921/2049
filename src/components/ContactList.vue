<template>
  <div class="contact-list">
    <h1 class="title">Contacts</h1>
    <ul>
      <li v-for="contact in contacts" :key="contact.id" @click="selectContact(contact)">
        {{ contact.name }}
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

<style scoped>
.contact-list {
  max-width: 300px;
  margin: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

li:hover {
  background-color: #48c774;
  color: white;
}
</style>
