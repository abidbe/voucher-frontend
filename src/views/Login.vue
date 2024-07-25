<template>
  <div class="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100">
    <div class="bg-white p-8 rounded sm:shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="username" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="flex justify-between items-center mb-4">
          <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Login</button>
        </div>
        <div class="text-center">
          <router-link to="/register" class="text-blue-500">Register</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post("http://api-voucher.test/api/login", {
          username: username.value,
          password: password.value,
        });
        localStorage.setItem("token", response.data.access_token);
        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid login credentials");
      }
    };

    return { username, password, login };
  },
};
</script>
