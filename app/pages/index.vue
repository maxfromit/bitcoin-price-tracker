<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">Nuxt UI - Starter</h1>
    <div class="flex flex-col gap-10">
      <BitcoinPriceChart />

      <FetchHistoricalPricesButton />
    </div>

    <div>
      <h1 class="text-xl font-bold">Bitcoin Prices</h1>

      <!-- <div v-else>
        <ul>
          <li v-for="price in data.data" :key="price.id">
            <strong>{{ price.evaluatedAt }}</strong
            >: ${{ price.closePriceUsd }}
          </li>
        </ul>
      </div> -->
    </div>
    <div class="flex items-center gap-2">
      <UButton
        label="Documentation"
        icon="i-lucide-square-play"
        to="https://ui.nuxt.com/getting-started/installation/nuxt"
        target="_blank"
      />

      <UButton
        label="GitHub"
        color="neutral"
        variant="outline"
        icon="i-simple-icons-github"
        to="https://github.com/nuxt/ui"
        target="_blank"
      />
    </div>
  </div>
</template>
