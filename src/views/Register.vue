<template>
  <div class="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100">
    <div class="bg-white p-8 rounded md:shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="username" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Nama</label>
          <input v-model="nama" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div class="flex justify-between items-center mb-4">
          <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Register</button>
        </div>
        <div class="text-center">
          <router-link to="/login" class="text-blue-500">Back to Login</router-link>
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
    const email = ref("");
    const nama = ref("");
    const router = useRouter();

    const register = async () => {
      try {
        console.log("Sending registration request with", { username: username.value, password: password.value, email: email.value, nama: nama.value });
        await axios.post("http://api-voucher.test/api/register", {
          username: username.value,
          password: password.value,
          email: email.value,
          nama: nama.value,
        });
        router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Validation error");
      }
    };

    return { username, password, email, nama, register };
  },
};
</script>
