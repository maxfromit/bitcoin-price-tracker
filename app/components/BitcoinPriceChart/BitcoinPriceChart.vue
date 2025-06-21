<script setup lang="ts">
import { ref } from "vue"
import type { CalendarDate } from "@internationalized/date"
import type { DateRange, Period } from "./types"
import l from "lodash"
import { startOfWeek } from "@internationalized/date"
import { filterPricesBySelectedPeriod } from "./utils/filterPricesBySelectedPeriod"
import { filterPricesBySelectedRange } from "./utils/filterPricesBySelectedRange"
import { getFirstAndLastCalendarDateFromPrices } from "./utils/getFirstAndLastDateFromPrices"
import { getLabelByPeriod } from "./utils/getLabelByPeriod"
import { transformPriceDataForGraph } from "./utils/transformPriceDataForGraph"

const { data: prices, pending, error } = await useFetch("/api/bitcoin-prices")

// const periods = ref(["1d", "1w", "1m", "1y", "all"])

const periodInDays = ref(null)

const maxPeriodInDays = computed(() =>
  selectedRange.value?.start && selectedRange.value?.end
    ? selectedRange.value?.end.compare(selectedRange.value?.start.copy())
    : null
)

const periods = computed(() => {
  const defaultPeriods = ["1d", "1w", "1m", "1y", "all", "custom"]

  if (!!selectedRange.value?.start && !!selectedRange.value?.end) {
    if (selectedRange.value.start.year === selectedRange.value.end.year) {
      l.pull(defaultPeriods, "1y", "all")
      if (selectedRange.value.start.month === selectedRange.value.end.month) {
        l.pull(defaultPeriods, "1m")
      }
      if (
        startOfWeek(selectedRange.value.start.copy(), "en-US").compare(
          startOfWeek(selectedRange.value.end.copy(), "en-US")
        ) === 0
      ) {
        l.pull(defaultPeriods, "1w")
      }
    }
  }

  return defaultPeriods
})

const selectedPeriod = ref<Period>("1d")

const selectedRange = ref<DateRange | null>(null)

const pricesToShow = computed(() => {
  if (
    !prices.value ||
    !Array.isArray(prices.value) ||
    prices.value.length === 0
  ) {
    return []
  }

  const filteredPricesByRange = selectedRange.value
    ? filterPricesBySelectedRange(prices.value, selectedRange.value)
    : prices.value

  const filteredPricesByPeriod = filterPricesBySelectedPeriod(
    filteredPricesByRange,
    selectedPeriod.value,
    periodInDays.value
  )

  return transformPriceDataForGraph(filteredPricesByPeriod)
})

const firstDate = ref<CalendarDate | null>(null)
const lastDate = ref<CalendarDate | null>(null)

watch(
  () => prices.value,
  (newValue) => {
    if (newValue && Array.isArray(newValue) && newValue.length > 0) {
      firstDate.value = getFirstAndLastCalendarDateFromPrices(newValue, "first")
      lastDate.value = getFirstAndLastCalendarDateFromPrices(newValue, "last")

      selectedRange.value = {
        start: firstDate.value,
        end: lastDate.value,
      }
    }
  },
  { immediate: true }
)

const isTheSameYear = computed(() => {
  if (!firstDate.value || !lastDate.value) {
    return false
  }
  if (selectedRange.value?.start && selectedRange.value?.end) {
    return selectedRange.value?.start?.year === selectedRange.value?.end?.year
  }
  return firstDate.value?.year === lastDate.value?.year
})

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
      text: `Days Count: ${l.size(prices.value)}`,
    },
    xAxis: {
      type: "datetime",
      title: { text: "Date" },
      labels: {
        format: getLabelByPeriod(selectedPeriod.value, isTheSameYear.value),
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
  <div v-if="!pending" class="flex flex-col gap-4">
    <div class="flex flex-row gap-4 items-center">
      <PeriodPicker
        v-model:selected-period="selectedPeriod"
        v-model:periods="periods"
      />
      <UInputNumber
        v-if="selectedPeriod === 'custom'"
        v-model="periodInDays"
        :min="1"
        :max="maxPeriodInDays ?? undefined"
        :placeholder="`days ${
          maxPeriodInDays ? `(max: ${maxPeriodInDays})` : ''
        }`"
        color="neutral"
        variant="subtle"
        orientation="vertical"
      />
    </div>

    <div class="flex-1">
      <highchart :options="options" />
    </div>
    <div class="flex flex-row gap-4">
      <DateRangePicker
        v-if="selectedRange && firstDate && lastDate"
        v-model:selected-range="selectedRange"
        :first-date="firstDate.copy()"
        :last-date="lastDate.copy()"
      />
    </div>
  </div>

  <div v-if="pending" class="flex flex-col items-center gap-2">
    <div class="text-sm text-gray-500">Loading Bitcoin prices...</div>
    <div class="flex flex-col items-center gap-2">
      <USkeleton class="h-4 w-[200px]" />
      <USkeleton class="h-20 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>

  <div v-if="error">
    <p class="text-red-500">
      Error loading Bitcoin prices. Please try again later.
    </p>
  </div>
</template>
