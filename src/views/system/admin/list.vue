<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-window">
      <!-- HEADER -->
      <div class="modal-header">
        <h5>계정관리</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <!-- BODY: 60 / 40 레이아웃 -->
      <div class="modal-body d-flex" style="height: 500px">

        <!-- LEFT 60% LIST -->
        <div class="w-60 border-end pe-3 overflow-auto">
          <h6 class="mb-3">계정 목록</h6>

          <div v-for="item in accountList"
               :key="item.id"
               class="list-item p-2 border rounded mb-2"
               :class="{ active: selected?.id === item.id }"
               @click="select(item)">
            <div class="fw-bold">{{ item.name }}</div>
            <div class="text-muted small">{{ item.phone }}</div>
          </div>
        </div>

        <!-- RIGHT 40% DETAIL -->
        <div class="w-40 ps-3">
          <h6 class="mb-3">상세정보</h6>

          <div v-if="selected">
            <div class="mb-2"><strong>이름:</strong> {{ selected.name }}</div>
            <div class="mb-2"><strong>전화번호:</strong> {{ selected.phone }}</div>
            <div class="mb-2"><strong>권한:</strong> {{ selected.role }}</div>
            <div class="mb-2"><strong>상태:</strong> {{ selected.status }}</div>

            <button class="btn btn-primary btn-sm mt-3">정보수정</button>
          </div>

          <div v-else class="text-muted mt-5">
            좌측에서 계정을 선택해주세요.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean
});

const selected = ref(null);

// 예시 데이터 (실제로는 API 또는 store에서 받아옴)
const accountList = ref([
  { id: 1, name: '홍길동', phone: '010-1111-2222', role: '관리자', status: '사용중' },
  { id: 2, name: '김철수', phone: '010-3333-4444', role: '직원', status: '휴면' },
  { id: 3, name: '관리자1', phone: '010-5555-6666', role: '관리자', status: '사용중' },
]);

function select(item) {
  selected.value = item;
}

// 모달 열릴 때 상세정보 초기화
watch(() => props.visible, (val) => {
  if (val) selected.value = null;
});
</script>


<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.modal-window {
  width: 900px;
  background: white;
  margin: 80px auto;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}

.list-item {
  cursor: pointer;
  background: #fafafa;
}
.list-item.active {
  background: #e6f0ff;
  border-color: #80b5ff;
}
.w-60 { width: 60%; }
.w-40 { width: 40%; }
</style>
