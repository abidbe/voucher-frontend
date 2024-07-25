<template>
  <div class="relative flex flex-col min-h-screen">
    <!-- Header -->
    <Header :buttonText="'History'" :route="'/history'" :userName="userName" @toggle-sidebar="toggleSidebar" />

    <!-- Overlay -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black opacity-50 z-40" @click="toggleSidebar"></div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar :categories="categories" :totalClaims="totalClaims" :filterVouchers="filterVouchers" :isSidebarOpen="isSidebarOpen" :userName="userName" @close-sidebar="toggleSidebar" />

      <!-- Body -->
      <main class="flex-1 p-4">
        <h2 class="text-2xl mb-4">Home</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="voucher in filteredVouchers" :key="voucher.id" class="bg-white p-4 rounded shadow">
            <img :src="voucher.foto" alt="Voucher Image" class="w-full h-32 object-cover mb-2" />
            <div class="text-lg font-semibold mb-2">{{ voucher.nama }}</div>
            <div class="text-gray-500 mb-2">{{ voucher.kategori }}</div>
            <button @click="claimVoucher(voucher.id)" class="bg-blue-500 text-white p-2 w-full rounded">Claim</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Header,
    Sidebar,
  },
  setup() {
    const userName = ref("");
    const isSidebarOpen = ref(false);
    const vouchers = ref([]);
    const categories = ref([{ name: "All", count: 0 }]);
    const filteredVouchers = ref([]);
    const totalClaims = ref(0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://api-voucher.test/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        userName.value = response.data.nama;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const fetchVouchers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://api-voucher.test/api/vouchers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const claimedVouchers = await axios.get("http://api-voucher.test/api/vouchers/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const claimedVoucherIds = claimedVouchers.data.map((claim) => claim.id_voucher);

        vouchers.value = response.data.filter((voucher) => !claimedVoucherIds.includes(voucher.id));
        filteredVouchers.value = vouchers.value;

        const categoryCount = {};
        vouchers.value.forEach((voucher) => {
          categoryCount[voucher.kategori] = (categoryCount[voucher.kategori] || 0) + 1;
        });

        categories.value = [{ name: "All", count: vouchers.value.length }];
        for (const [name, count] of Object.entries(categoryCount)) {
          categories.value.push({ name, count });
        }

        totalClaims.value = claimedVoucherIds.length;
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };

    const filterVouchers = (category) => {
      if (category === "All") {
        filteredVouchers.value = vouchers.value;
      } else {
        filteredVouchers.value = vouchers.value.filter((voucher) => voucher.kategori === category);
      }
    };

    const claimVoucher = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://api-voucher.test/api/vouchers/claim/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        vouchers.value = vouchers.value.filter((voucher) => voucher.id !== id);
        filterVouchers(categories.value.find((category) => category.name === "All").name); // Re-filter vouchers to update display
      } catch (error) {
        console.error("Failed to claim voucher:", error);
      }
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(() => {
      fetchUserData();
      fetchVouchers();
    });

    return { categories, filteredVouchers, filterVouchers, claimVoucher, totalClaims, userName, isSidebarOpen, toggleSidebar };
  },
};
</script>

<style scoped>
.bg-gray-500 {
  background-color: #6b7280;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
