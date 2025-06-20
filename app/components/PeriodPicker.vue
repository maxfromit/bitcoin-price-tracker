<script setup lang="ts">
import type { Period } from "./BitcoinPriceChart/BitcoinPriceChart.vue"
import type { RadioGroupItem } from "@nuxt/ui"

const selectedPeriod = defineModel<Period>("selectedPeriod")
const periods = defineModel<RadioGroupItem[]>("periods")
</script>

<template>
  <URadioGroup
    v-if="periods && periods.length > 0"
    v-model="selectedPeriod"
    orientation="horizontal"
    variant="list"
    default-value="all"
    :items="periods"
  />
</template>
