<script setup lang="ts">
import { ref } from "vue"
import l from "lodash"

import { useUpdateDateRangeBySelectedPeriod } from "./composables/useUpdateDateRangeBySelectedPeriod"
import {
  filterPricesBySelectedRange,
  transformPriceDataForGraph,
  getFirstAndLastCalendarDateFromBitcoinPrices,
} from "./utils"

import type { DateRange, PredefinedPeriod } from "./types"

const { data: bitcoinPrices, status } = await useFetch("/api/bitcoinPrices")

const selectedCustomPeriodInDays = ref<number | null>(null)
const selectedPredefinedPeriod = ref<PredefinedPeriod>("all")
const selectedRange = ref<DateRange | null>(null)
const defaultRange = ref<DateRange | null>(null)

watch(
  () => bitcoinPrices.value,
  (newValue) => {
    if (newValue && Array.isArray(newValue) && newValue.length > 0) {
      defaultRange.value = {
        start: getFirstAndLastCalendarDateFromBitcoinPrices(newValue, "first"),
        end: getFirstAndLastCalendarDateFromBitcoinPrices(newValue, "last"),
      }

      selectedRange.value = l.cloneDeep(defaultRange.value)
    }
  },
  { immediate: true }
)

const pricesToShow = computed(() => {
  if (
    !bitcoinPrices.value ||
    !Array.isArray(bitcoinPrices.value) ||
    bitcoinPrices.value.length === 0
  ) {
    return []
  }

  const filteredPricesByRange = selectedRange.value
    ? filterPricesBySelectedRange(bitcoinPrices.value, selectedRange.value)
    : bitcoinPrices.value

  return transformPriceDataForGraph(filteredPricesByRange)
})

watch(
  () => [selectedPredefinedPeriod.value, selectedCustomPeriodInDays.value],
  () => {
    if (selectedRange.value)
      useUpdateDateRangeBySelectedPeriod({
        selectedRange,
        predefinedPeriod: selectedPredefinedPeriod.value,
        customPeriodInDays: selectedCustomPeriodInDays.value,
        firstDate: defaultRange.value?.start?.copy(),
      })
  }
)

const getLabelWithoutYearIfOneYear = () => {
  return `${
    selectedRange.value?.start &&
    selectedRange.value?.end &&
    selectedRange.value?.start?.year === selectedRange.value?.end?.year
      ? `{value:%d %B}`
      : `{value: %d %B %Y}`
  }`
}

const options = computed(() => {
  return {
    chart: {
      type: "line",
      height: 400,
    },
    title: {
      text: "Bitcoin Price History",
    },
    subtitle: {
      text: `Days Count: ${l.size(bitcoinPrices.value)}`,
    },
    xAxis: {
      type: "datetime",
      // title: { text: "Date" },
      labels: {
        format: getLabelWithoutYearIfOneYear(),
      },
    },
    yAxis: {
      title: { text: "Price (USD)" },
      min: 0,
    },
    tooltip: {
      shared: true,
      xDateFormat: "%d %B %Y",
      valueDecimals: 2,
      valuePrefix: "$",
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: "BTC/USD",
        type: "line",
        data: pricesToShow.value,
      },
    ],
    credits: {
      enabled: false,
    },
  }
})
</script>

<template>
  <div
    v-if="status === 'success'"
    class="flex-1 flex flex-col gap-6 md:gap-4 items-center"
  >
    <div class="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
      <PeriodPicker
        v-model:selected-predefined-period="selectedPredefinedPeriod"
        v-model:selected-custom-period-in-days="selectedCustomPeriodInDays"
      />
    </div>

    <div class="flex flex-row gap-4 justify-between">
      <DateRangePicker
        v-if="selectedRange && defaultRange"
        v-model:selected-range="selectedRange"
        :default-range="defaultRange"
      />
    </div>

    <div class="w-full">
      <highchart :options="options" />
    </div>
  </div>

  <div
    v-if="status === 'pending'"
    class="flex-1 flex flex-col items-center gap-4"
  >
    <USkeleton class="flex flex-col h-6 w-4/6 items-center justify-center">
      <div class="text-sm text-gray-400">loading...</div></USkeleton
    >
    <USkeleton class="h-8 w-2/6" />
    <USkeleton class="h-40 w-5/6 max-h-1/2" />
  </div>

  <div v-if="status === 'error'" class="flex-1 flex flex-col">
    <div class="text-red-500">
      Error loading bitcoin prices. Please try again later.
    </div>
  </div>
</template>
