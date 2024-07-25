<template>
  <aside :class="['fixed sm:relative w-64 h-screen bg-gray-200 p-4 z-50 transition-transform transform', { '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }, 'sm:translate-x-0']">
    <div class="sm:hidden flex items-center mb-4">
      <img src="../assets/user-icon.svg" alt="User Icon" class="w-10 h-10 rounded-full" />
      <span class="ml-2">{{ userName }}</span>
    </div>
    <ul>
      <li v-for="category in categories" :key="category.name" @click="filterVouchers(category.name)" class="p-2 cursor-pointer bg-gray-300 my-2 rounded flex justify-between">
        <span>{{ category.name }}</span>
        <span>{{ category.count }}</span>
      </li>
    </ul>
    <div class="p-2 bg-gray-400 my-2 rounded flex justify-between">
      <span>Total diclaim</span>
      <span>{{ totalClaims }}</span>
    </div>
    <button @click="logout" class="bg-red-500 text-white p-2 w-full rounded mt-4">Log Out</button>
  </aside>
</template>

<script>
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
    totalClaims: {
      type: Number,
      required: true,
    },
    filterVouchers: {
      type: Function,
      required: true,
    },
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://api-voucher.test/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.removeItem("token");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    return { logout };
  },
};
</script>
