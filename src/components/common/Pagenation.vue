<template>
  <div class="d-md-flex align-items-center">
    <div class="me-md-auto text-md-left text-center mb-2 mb-md-0" v-if="!isShowLeft">
      Showing {{ start }} to {{ end }} of {{ total }} entries
    </div>

    <ul class="pagination mb-0 justify-content-center">
      <li class="page-item" :class="{ disabled: modelValue === 1 }" @click="change(1)">
        <a class="page-link" href="javascript:void(0)">&lt;&lt;</a>
      </li>
      <li class="page-item" :class="{ disabled: modelValue === 1 }" @click="change(modelValue - 1)">
        <a class="page-link" href="javascript:void(0)">&lt;</a>
      </li>

      <!-- ✅ 페이지 숫자/점점점 렌더링 -->
      <li
          v-for="(p, idx) in pageItems"
          :key="`${p}-${idx}`"
          class="page-item"
          :class="{
          active: p === modelValue,
          disabled: p === '...'
        }"
          @click="p !== '...' && change(Number(p))"
      >
        <a class="page-link" href="javascript:void(0)">
          {{ p }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: modelValue === totalPages }" @click="change(modelValue + 1)">
        <a class="page-link" href="javascript:void(0)">&gt;</a>
      </li>
      <li class="page-item" :class="{ disabled: modelValue === totalPages }" @click="change(totalPages)">
        <a class="page-link" href="javascript:void(0)">&gt;&gt;</a>
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
  isShowLeft?: boolean
  maxButtons?: number // ✅ 추가: 가운데 표시할 최대 숫자 개수
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  total: 0,
  perPage: 10,
  maxButtons: 5
})

const emit = defineEmits(["update:modelValue"])

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const start = computed(() => (props.modelValue - 1) * props.perPage + 1)
const end = computed(() => Math.min(props.modelValue * props.perPage, props.total))

function change(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit("update:modelValue", page)
}

/**
 * ✅ 표시용 페이지 배열 생성
 * - 최대 maxButtons 개 숫자만 가운데에서 보여줌
 * - 1, 마지막 페이지는 항상 보여주고
 * - 사이가 멀면 ... 삽입
 */
const pageItems = computed<(number | "...")[]>(() => {
  const total = totalPages.value
  const current = props.modelValue
  const max = Math.max(3, props.maxButtons) // 최소 3은 보장

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | "...")[] = []
  const half = Math.floor(max / 2)

  let startPage = current - half
  let endPage = current + half

  // maxButtons가 짝수면 오른쪽을 하나 줄여서 균형 맞춤
  if (max % 2 === 0) endPage -= 1

  if (startPage < 1) {
    startPage = 1
    endPage = startPage + max - 1
  }
  if (endPage > total) {
    endPage = total
    startPage = endPage - max + 1
  }

  // 1페이지 앞쪽 생략 처리
  if (startPage > 1) {
    items.push(1)
    if (startPage > 2) items.push("...")
  }

  // 가운데 구간
  for (let p = startPage; p <= endPage; p++) {
    items.push(p)
  }

  // 마지막 페이지 뒤쪽 생략 처리
  if (endPage < total) {
    if (endPage < total - 1) items.push("...")
    items.push(total)
  }

  return items
})
</script>

<style scoped>
/* 점점점은 클릭 안되게 + 살짝 흐리게 */
.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}
</style>
