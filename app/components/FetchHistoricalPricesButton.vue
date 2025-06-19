<script setup lang="ts">
import { ref } from "vue"
const { data: prices, pending, error } = await useFetch("/api/bitcoin-prices")
import { fetchHistoricalPrices } from "~~/server/utils/fetchHistoricalPrices"
import { transformFetchedDataForBitcoinPrice } from "~~/server/utils/transformFetchedDataForBitcoinPrice"
// import { fetchTransformAndInsertBitcoinPrices } from "~~/server/utils/insertBitcoinPrices"
const isLoading = ref(false)
const fetchedData = ref([]) // Store fetched data
const transformedData = ref([]) // Store fetched data

// const handleFetch = async () => {
//   isLoading.value = true
//   try {
//     const data = await fetchHistoricalPrices()
//     fetchedData.value = data ?? [] // Update the ref with fetched data
//     console.log("fetchedData.value:", fetchedData.value)
//     const transformedFetchedData = transformFetchedDataForBitcoinPrice(
//       fetchedData.value
//     ) // Transform the fetched data.

//     transformedData.value = transformedFetchedData ?? [] // Update the ref with transformed data
//     console.log("transformedData.value:", transformedData.value)
//   } catch (error) {
//     console.error("Error fetching historical prices:", error)
//   } finally {
//     isLoading.value = false
//   }
// }
</script>

<template>
  <div>
    <!-- <button
      @click="handleFetch"
      :disabled="isLoading"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {{ isLoading ? "Fetching..." : "Fetch Historical Prices" }}
    </button> -->

    <!-- Display fetched data -->
    <div>
      <h1 class="text-xl font-bold mb-4">Bitcoin Price History</h1>
      <div v-if="pending" class="text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-red-500">Error loading data</div>
      <table v-else class="min-w-full border border-gray-300 rounded">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Evaluated At</th>
            <th class="px-4 py-2">Close Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in prices" :key="row.evaluatedAt">
            <td class="px-4 py-2">{{ row.evaluatedAt }}</td>
            <td class="px-4 py-2">{{ row.closePriceUsd }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
