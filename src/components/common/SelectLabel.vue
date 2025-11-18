<template>
  <div :class="size" class="d-lg-block d-none">
    <label
        class="btn btn-white d-flex align-items-center rounded-3 w-100 position-relative label-custom"
        :class="{ 'opacity-50': disabled, 'pointer-events-none': disabled }"
    >

      <!-- 아이콘 -->
      <i :class="icon" class="text-opacity-50"></i>

      <!-- 선택된 텍스트 -->
      <span class="flex-grow-1">
        {{ selectedLabel }}
      </span>

      <!-- 드롭다운 아이콘 -->
      <i class="fa fa-chevron-down ms-2 text-opacity-50"></i>

      <!-- 투명 Select -->
      <select
          class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
          :disabled="disabled"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
      >

      <option
            v-for="opt in normalizedOptions"
            :key="opt.value"
            :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

    </label>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {boolean} from "yup";

const props = defineProps({
  modelValue: String,
  icon: String,
  size: String,
  options: Array,
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(["update:modelValue"]);

/**
 * options를 자동 변환:
 * A1 → value = sidoCode
 * A2 → value = sigunCode
 * 기본 → value 유지
 */

const normalizedOptions = computed(() =>
    props.options.map(o => {
      if (o.sidoType === "A1") {
        return { value: o.sidoCode, label: o.addrName };
      }
      if (o.sidoType === "A2") {
        return { value: o.sigunCode, label: o.addrName };
      }
      return { value: o.value, label: o.label };
    })
);

// 선택된 label
const selectedLabel = computed(() => {
  const opt = normalizedOptions.value.find(o => o.value === props.modelValue);
  return opt ? opt.label : normalizedOptions.value[0]?.label ?? "";
});
</script>

<style scoped>
.label-custom {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
