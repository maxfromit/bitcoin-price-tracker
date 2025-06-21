<script setup lang="ts">
import type { PredefinedPeriod } from "./BitcoinPriceChart/types"
import { predefinedPeriods } from "./BitcoinPriceChart/types"
import l from "lodash"

const selectedPredefinedPeriod = defineModel<PredefinedPeriod | null>(
  "selectedPredefinedPeriod"
)
const selectedCustomPeriodInDays = defineModel<number | null>(
  "selectedCustomPeriodInDays"
)

watch(
  () => selectedCustomPeriodInDays.value,
  (newPeriod) => {
    if (l.isNumber(newPeriod) && newPeriod < 1) {
      selectedCustomPeriodInDays.value = 1
    }

    if (l.isNumber(newPeriod) && newPeriod > 0) {
      selectedPredefinedPeriod.value = null
    }
  }
)

watch(
  () => selectedPredefinedPeriod.value,
  (newPeriod) => {
    if (!!selectedCustomPeriodInDays.value && !!newPeriod) {
      selectedCustomPeriodInDays.value = null
    }
  }
)
</script>

<template>
  <URadioGroup
    v-if="predefinedPeriods && predefinedPeriods.length > 0"
    v-model="selectedPredefinedPeriod"
    :items="predefinedPeriods"
    orientation="horizontal"
    variant="list"
    default-value="all"
  />

  <UInput
    v-model="selectedCustomPeriodInDays"
    type="number"
    color="neutral"
    placeholder="Custom period in days"
    variant="outline"
    orientation="vertical"
  />
</template>
