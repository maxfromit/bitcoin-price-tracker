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

// Keep selectedRange.start <= selectedRange.end by updating the other value if needed and vice versa
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

const isChangedRange = computed(() =>
  selectedRange.value &&
  selectedRange.value.start &&
  selectedRange.value.end &&
  (selectedRange.value.start?.compare(props.firstDate?.copy()) !== 0 ||
    selectedRange.value.end?.compare(props.lastDate?.copy()) !== 0)
    ? true
    : false
)
</script>

<template>
  <template v-if="selectedRange">
    <UPopover>
      <UButton color="neutral" variant="subtle">
        {{
          selectedRange.start
            ? df.format(selectedRange.start.toDate(getLocalTimeZone()))
            : "Select a date"
        }}
      </UButton>

      <template #content>
        <UCalendar
          v-model="selectedRange.start"
          :min-value="minDate"
          :max-value="maxDate"
          class="p-2 calendar-dates"
        />
      </template>
    </UPopover>

    <UPopover>
      <UButton color="neutral" variant="subtle">
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
          class="p-2 calendar-dates"
        />
      </template>
    </UPopover>
    <UTooltip
      :text="isChangedRange ? 'Reset to default range' : 'No changes to reset'"
    >
      <UButton
        icon="i-lucide-refresh-ccw"
        variant="ghost"
        :color="isChangedRange ? 'primary' : 'neutral'"
        :disabled="!isChangedRange"
        @click="resetSelectedRange()"
      />
    </UTooltip>
  </template>
</template>

<style scoped lang="scss">
.calendar-dates :deep(.m-0\.5.relative:not([data-disabled])) {
  cursor: pointer;
}
</style>
