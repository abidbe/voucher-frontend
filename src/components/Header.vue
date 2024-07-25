<template>
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <div class="flex items-center">
      <button @click="toggleSidebar" class="sm:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <img src="../assets/user-icon.svg" alt="User Icon" class="w-10 h-10 rounded-full sm:inline hidden" />
      <span class="ml-2 sm:inline hidden">{{ userName }}</span>
    </div>
    <h1 class="text-center flex-1">Voucher</h1>
    <button @click="navigateTo" class="bg-gray-600 px-4 py-2 rounded">{{ buttonText }}</button>
  </header>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();

    const navigateTo = () => {
      router.push(props.route);
    };

    const toggleSidebar = () => {
      emit("toggle-sidebar");
    };

    return { navigateTo, toggleSidebar };
  },
};
</script>

<style scoped>
/* Tambahkan gaya khusus untuk komponen header */
h1 {
  text-align: center;
  flex: 1;
}
</style>
