<template>
  <div class="d-md-flex align-items-center">
    <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
      Showing {{ start }} to {{ end }} of {{ total }} entries
    </div>

    <ul class="pagination mb-0 justify-content-center">
      <li
          class="page-item"
          :class="{ disabled: modelValue === 1 }"
          @click="change(modelValue - 1)"
      >
        <a class="page-link" href="javascript:void(0)">Previous</a>
      </li>

      <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: modelValue === page }"
          @click="change(page)"
      >
        <a class="page-link" href="javascript:void(0)">
          {{ page }}
        </a>
      </li>

      <li
          class="page-item"
          :class="{ disabled: modelValue === totalPages }"
          @click="change(modelValue + 1)"
      >
        <a class="page-link" href="javascript:void(0)">Next</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  modelValue: number
  total: number
  perPage: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  total: 0,
  perPage: 10
})
const emit = defineEmits(["update:modelValue"])

const totalPages = computed(() =>
    Math.ceil(props.total / props.perPage)
)

const start = computed(() =>
    (props.modelValue - 1) * props.perPage + 1
)

const end = computed(() =>
    Math.min(props.modelValue * props.perPage, props.total)
)

function change(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit("update:modelValue", page)
}
</script>

<style scoped>
/* 필요하면 커스텀 */
</style>
