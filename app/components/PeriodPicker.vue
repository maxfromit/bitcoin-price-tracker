<script setup lang="ts">
import type { Period } from "./BitcoinPriceChart/BitcoinPriceChart.vue"
import type { RadioGroupItem, DropdownMenuItem } from "@nuxt/ui"

const selectedPeriod = defineModel<Period>("selectedPeriod")
const periods = defineModel<RadioGroupItem[]>("periods")

const items = ref<DropdownMenuItem[]>([
  {
    label: "input",
  },
])
const openDropdown = ref(false)

watch(
  () => selectedPeriod.value,
  (newPeriod) => {
    if (newPeriod === "custom") {
      openDropdown.value = true
    } else {
      openDropdown.value = false
    }
  }
)

function handleCustomClick(period?: Period) {
  console.log("Custom period selected:", period)
  if (period === "custom") {
    openDropdown.value = true
  }
}
</script>

<template>
  <UDropdownMenu
    v-model:open="openDropdown"
    :items="items"
    :content="{
      align: 'start',
      side: 'bottom',
      sideOffset: 8,
    }"
    :ui="{
      content: 'w-48',
    }"
  >
    <template #default>
      <URadioGroup
        v-if="periods && periods.length > 0"
        v-model="selectedPeriod"
        orientation="horizontal"
        variant="list"
        default-value="all"
        :items="periods"
        @change="handleCustomClick(selectedPeriod)"
      >
        <template #label="{ item }">
          <div class="cursor-pointer" @click.stop="selectedPeriod = item.value">
            {{ item.value }}
          </div>
        </template>
      </URadioGroup>
    </template>

    <template #item>
      <div @click.stop>
        <slot name="input" />
      </div>
    </template>
  </UDropdownMenu>
</template>
