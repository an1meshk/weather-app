import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUnitStore = defineStore('unitStore', () => {
  const isMetricUnit = ref(false); // Default to false (Imperial)

  const toggleUnit = () => {
    isMetricUnit.value = !isMetricUnit.value;
  };

  const currentUnit = computed(() => (isMetricUnit.value ? UNIT_METRIC : UNIT_IMPERIAL));

  return {
    isMetricUnit,
    toggleUnit,
    currentUnit,
  };
});
