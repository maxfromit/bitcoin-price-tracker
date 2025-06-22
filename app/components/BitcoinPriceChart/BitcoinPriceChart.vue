<script setup lang="ts">
import { ref } from "vue"
import l from "lodash"

import { useUpdateDateRangeBySelectedPeriod } from "./composables/useUpdateDateRangeBySelectedPeriod"
import { filterPricesBySelectedRange } from "./utils/filterPricesBySelectedRange"
import { getFirstAndLastCalendarDateFromBitcoinPrices } from "./utils/getFirstAndLastCalendarDateFromBitcoinPrices"
import { transformPriceDataForGraph } from "./utils/transformPriceDataForGraph"

import type { Chart } from "highcharts"
import type { DateRange, PredefinedPeriod } from "./types"

const { data: bitcoinPrices, status } = await useFetch("/api/bitcoinPrices")

const chartRef = ref<Chart | null>(null)

watchEffect(() => {
  if (status.value !== "success" && chartRef.value) {
    chartRef.value.showLoading()
  }
  if (status.value === "success" && chartRef.value) {
    chartRef.value.hideLoading()
  }
})

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
      events: {
        load() {
          chartRef.value = this // Save the chart instance
        },
      },
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
  <div class="flex flex-col flex-1 gap-2">
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

    <div v-if="status === 'pending'" class="flex flex-col items-center gap-2">
      <div class="text-sm text-gray-500">Loading Bitcoin prices...</div>
      <div class="flex flex-col items-center gap-2">
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-20 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>

    <div v-if="status === 'error'" class="p-5">
      <div class="text-red-500">
        Error loading Bitcoin divrices. Please try again later.
      </div>
    </div>
  </div>
</template>
