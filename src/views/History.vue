<template>
  <div class="relative flex flex-col min-h-screen">
    <!-- Header -->
    <Header :buttonText="'Home'" :route="'/dashboard'" :userName="userName" @toggle-sidebar="toggleSidebar" />

    <!-- Overlay -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black opacity-50 z-40" @click="toggleSidebar"></div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar :categories="claimCounts" :totalClaims="totalClaims" :isSidebarOpen="isSidebarOpen" :userName="userName" @close-sidebar="toggleSidebar" />

      <!-- Body -->
      <main class="flex-1 p-4">
        <h2 class="text-2xl mb-4">History</h2>
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Nama</th>
              <th class="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="claim in claimedVouchers" :key="claim.id">
              <td class="py-2 px-4 border-b">
                <div class="flex items-center">
                  <img :src="claim.voucher.foto" alt="Voucher Image" class="w-10 h-10 object-cover mr-4" />
                  <span>{{ claim.voucher.nama }}</span>
                </div>
              </td>
              <td class="py-2 px-4 border-b">
                <button @click="removeClaim(claim.id)" class="bg-red-500 text-white p-2 rounded">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
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
    const claimedVouchers = ref([]);
    const claimCounts = ref([]);
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

    const fetchClaimedVouchers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://api-voucher.test/api/vouchers/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        claimedVouchers.value = response.data;

        const categoryCount = {};
        claimedVouchers.value.forEach((claim) => {
          const kategori = claim.voucher.kategori;
          categoryCount[kategori] = (categoryCount[kategori] || 0) + 1;
        });

        claimCounts.value = [];
        for (const [name, count] of Object.entries(categoryCount)) {
          claimCounts.value.push({ name, count });
        }

        totalClaims.value = claimedVouchers.value.length;
      } catch (error) {
        console.error("Failed to fetch claimed vouchers:", error);
      }
    };

    const removeClaim = async (claimId) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://api-voucher.test/api/vouchers/history/${claimId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        claimedVouchers.value = claimedVouchers.value.filter((claim) => claim.id !== claimId);
        fetchClaimedVouchers();
      } catch (error) {
        console.error("Failed to remove claim:", error);
      }
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(() => {
      fetchUserData();
      fetchClaimedVouchers();
    });

    return { claimedVouchers, claimCounts, totalClaims, removeClaim, toggleSidebar, userName, isSidebarOpen };
  },
};
</script>
