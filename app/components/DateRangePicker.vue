<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date"
import type { DateRange } from "./BitcoinPriceChart/types"
import { DateFormatter, getLocalTimeZone } from "@internationalized/date"

const props = defineProps<{
  firstDate: CalendarDate
  lastDate: CalendarDate
}>()

const selectedRange = defineModel<DateRange>("selectedRange")

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
})

const maxDate = computed(() => {
  return props.lastDate?.copy() ?? undefined
})

const minDate = computed(() => {
  return props.firstDate?.copy() ?? undefined
})

watch(
  () => selectedRange.value?.start,
  (newStart) => {
    if (
      newStart &&
      selectedRange.value?.end &&
      newStart.compare(selectedRange.value.end.copy()) > 0
    ) {
      selectedRange.value.end = newStart.copy()
    }
  }
)

watch(
  () => selectedRange.value?.end,
  (newEnd) => {
    if (
      newEnd &&
      selectedRange.value?.start &&
      newEnd.compare(selectedRange.value.start.copy()) < 0
    ) {
      selectedRange.value.start = newEnd.copy()
    }
  }
)

function resetSelectedRange() {
  selectedRange.value = {
    start: props.firstDate?.copy(),
    end: props.lastDate?.copy(),
  }
}

const isNotDefaultRange = computed(() => {
  if (
    !selectedRange.value ||
    !selectedRange.value.start ||
    !selectedRange.value.end
  ) {
    return false
  }
  return (
    selectedRange.value.start?.compare(props.firstDate?.copy()) !== 0 ||
    selectedRange.value.end?.compare(props.lastDate?.copy()) !== 0
  )
})
</script>

<template>
  <template v-if="selectedRange">
    <UPopover>
      <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
        {{
          selectedRange.start
            ? df.format(selectedRange.start.toDate(getLocalTimeZone()))
            : "Select a date"
        }}
      </UButton>

      <template #content>
        <UCalendar
          v-model="selectedRange.start"
          class="p-2"
          :min-value="minDate"
          :max-value="maxDate"
        />
      </template>
    </UPopover>

    <UPopover>
      <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
        {{
          selectedRange.end
            ? df.format(selectedRange.end.toDate(getLocalTimeZone()))
            : "Select a date"
        }}
      </UButton>

      <template #content>
        <UCalendar
          v-model="selectedRange.end"
          :min-value="minDate"
          :max-value="maxDate"
          class="p-2"
        />
      </template>
    </UPopover>

    <UButton
      v-if="
        selectedRange &&
        selectedRange.start &&
        selectedRange.end &&
        isNotDefaultRange
      "
      icon="i-lucide-x"
      color="primary"
      variant="solid"
      @click="resetSelectedRange()"
    />
  </template>
</template>
