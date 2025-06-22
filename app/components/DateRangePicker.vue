<script setup lang="ts">
import l from "lodash"
import { DateFormatter, getLocalTimeZone } from "@internationalized/date"
import type { DateRange } from "./BitcoinPriceChart/types"

const props = defineProps<{
  defaultRange: DateRange
}>()

const selectedRange = defineModel<DateRange>("selectedRange")

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
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
  selectedRange.value = l.cloneDeep(props.defaultRange)
}

const isChangedRange = computed(() =>
  selectedRange.value &&
  selectedRange.value.start &&
  selectedRange.value.end &&
  !l.isEqual(selectedRange.value, props.defaultRange)
    ? true
    : false
)
</script>

<template>
  <template v-if="selectedRange && defaultRange">
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
          :min-value="defaultRange.start?.copy()"
          :max-value="defaultRange.end?.copy()"
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
          :min-value="defaultRange.start?.copy()"
          :max-value="defaultRange.end?.copy()"
          class="p-2 calendar-dates"
        />
      </template>
    </UPopover>
    <UTooltip
      :text="isChangedRange ? 'Reset to full range' : 'No changes to reset'"
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
