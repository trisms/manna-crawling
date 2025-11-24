<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-window">
      <!-- HEADER -->
      <div class="modal-header">
        <h5>계정관리</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <!-- BODY -->
      <div class="modal-body d-flex" style="height: 600px;">

        <!-- LEFT: 필터 + 리스트 (60%) -->
        <div class="w-50 border-end pe-3 d-flex flex-column">
          <!-- 검색 필터 -->
          <div class="mb-3">
            <div class="row g-2">
              <div class="col-2">
                <label class="form-label small">상태</label>
                <select class="form-select form-select-sm" v-model="store.searchParams.dataStatus">
                  <option value="">전체</option>
                  <option value="1">사용중</option>
                  <option value="0">휴면</option>
                </select>
              </div>
              <div class="col-2">
                <label class="form-label small">권한</label>
                <select class="form-select form-select-sm" v-model="store.searchParams.role">
                  <option value="">전체</option>
                  <option value="1">관리자</option>
                  <option value="2">사용자</option>
                </select>
              </div>
              <div class="col-2">
                <label class="form-label small">검색 유형</label>
                <select class="form-select form-select-sm" v-model="store.searchParams.searchType">
                  <option value="">전체</option>
                  <option value="name">이름</option>
                  <option value="id">아이디</option>
                  <option value="phone">전화번호</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label small">키워드</label>
                <div class="input-group">
                  <input type="text" class="form-control form-control-sm " v-model="store.searchParams.keyword" placeholder="검색어" />
                  <button class="btn btn-sm btn-primary" @click="applyFilter">검색</button>
                  <button class="btn btn-sm btn-secondary " @click="resetFilter">초기화</button>
                </div>


              </div>
            </div>
            <div class="mt-2 text-end">

            </div>
          </div>
          <div class="widget-todolist rounded mb-1" data-id="widget">
            <div class="d-flex w-100">
              <div class="widget-todolist-header w-75">
                <div class="widget-todolist-header-title">계정 목록  (총 <span>{{ store.items.length }} </span><small>명</small>)</div>
<!--                <div class="widget-todolist-header-total">
                  <span>{{ store.items.length }} </span><small>명</small>
                </div>-->
              </div>
              <div class="widget-todolist-item w-25 border-bottom" @click="createNew">
                <div class="widget-todolist-content border-0 m-auto text-right">
                  <div  class="form-control border-0 shadow-none rounded-0 p-0 h-20px bg-none" @click="createNew">  <i class="fa fa-plus text-body text-opacity-30 fa-fw ms-auto"></i> 계정 추가 </div>
                </div>
              </div>
            </div>


<!--            <div class="widget-todolist-item" @click="createNew">
              <div class="widget-todolist-input border-bottom">
                <i class="fa fa-plus text-body text-opacity-30 fa-fw"></i>
              </div>
              <div class="widget-todolist-content border-0 border-bottom">
                <div  class="form-control border-0 shadow-none rounded-0 p-0 h-20px bg-none" @click="createNew">새 계정 추가</div>
              </div>
            </div>-->
          </div>
          <!-- 리스트 (widget 스타일) -->
          <div class="flex-grow-1 overflow-auto">

            <div class="widget-todolist rounded mb-4" data-id="widget">

              <div class="widget-todolist-body">
                <div
                    v-for="item in store.items"
                    :key="item.id"
                    class="widget-todolist-item"
                    :class="{  disabled: item.dataStatus === '0',active: selected?.id === item.id && !isNewMode }"
                    @click="select(item)"
                >
                  <div class="widget-todolist-input">
                    <div class="form-check">
                      <input
                          class="form-check-input"
                          type="checkbox"
                          :checked="selected?.id === item.id && !isNewMode"
                      />
                    </div>
                  </div>
                  <div class="widget-todolist-content">
                    <h6 class="mb-2px">{{ item.id }} </h6>
                    <div class="text-body text-opacity-75 fw-bold fs-11px">
                      {{ item.phone }} · {{ item.role === '1' ? '관리자': '사용자' }} · {{ item.dataStatus === '1' ? '사용중': '정지'}}
                    </div>
                  </div>
                  <div class="widget-todolist-icon">
                    {{ item.name }} <i class="fa fa-user-circle text-secondary"></i>
                  </div>
                </div>

                <!-- 새 항목 입력 (Add) -->

              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: 상세 / 수정 / 추가 폼 (40%) -->
        <div class="w-50 ps-3">
          <h6 class="mb-3">
            {{ isNewMode ? "신규 계정 추가" : "상세 / 수정" }}
          </h6>

          <div>
            <div class="mb-2">
              <label class="form-label">이름</label>
              <input type="text" class="form-control" v-model="editForm.name" />
            </div>
            <div class="mb-2">
              <label class="form-label">아이디</label>
              <input type="text" class="form-control" v-model="editForm.id" :disabled="!isNewMode"   @input="editForm.id = editForm.id.replace(/[^a-zA-Z0-9]/g, '')"/>
            </div>
            <div class="mb-2">
              <label class="form-label"> {{ isNewMode ? "비밀번호" : "비밀번호 (미입력시 변경없음)" }}</label>
              <input type="password" class="form-control" v-model="editForm.password" />
            </div>
            <div class="mb-2">
              <label class="form-label">비밀번호  확인</label>
              <input type="password" class="form-control" v-model="editForm.passwordChk" />
            </div>

            <div class="mb-2">
              <label class="form-label">전화번호</label>
              <input type="text" class="form-control" v-model="editForm.phone" />
            </div>

            <div class="mb-2">
              <label class="form-label">권한</label>
              <select class="form-select" v-model="editForm.role">
                <option value="1">관리자</option>
                <option value="2">사용자</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="form-label">상태</label>
              <select class="form-select" v-model="editForm.dataStatus">
                <option value="1">사용중</option>
                <option value="0">중지</option>
              </select>
            </div>

            <div class="mt-4 d-flex gap-2">
              <input type="button" class="btn btn-primary w-100" @click="save" :value="isNewMode ? '추가' : '수정'">
<!--              <button
                  v-if="!isNewMode"
                  class="btn btn-danger w-50"
                  @click="remove"
              >
                삭제
              </button>-->
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useAdminStore } from "@/stores/systems/useAdminStore";

const store = useAdminStore();

const props = defineProps({
  visible: Boolean,
});

// 선택 상태
const selected = ref<any>(null);
const isNewMode = ref(false);

// 상세/입력 폼
const editForm = reactive({
  userNo: 0,
  dataStatus: "",
  id: "",
  name: "",
  password: "",
  passwordChk: "",
  phone: "",
  role: "",
});

// 검색 필터
const filters = reactive({
  dataStatus: "",
  role: "",
  searchType: "",
  keyword: "",
});

// ⭐ 리스트 불러오기
async function searchList() {
  await store.callListAPI({
    dataStatus: filters.dataStatus,
    role: filters.role,
    searchType: filters.searchType,
    keyword: filters.keyword,
  });
}

// ⭐ 상세정보 가져오기
async function loadDetail(userNo: number) {
  const detail = await store.callDetailAPI(userNo);
  Object.assign(editForm, store.form);
}

// 필터 적용
function applyFilter() {
  searchList();
}

function resetFilter() {
  filters.dataStatus = "";
  filters.role = "";
  filters.searchType = "";
  filters.keyword = "";
  searchList();
}

// 신규 생성 모드
function createNew() {
  isNewMode.value = true;
  selected.value = null;

  Object.assign(editForm, {
    userNo: 0,
    dataStatus: "1",
    id: "",
    name: "",
    phone: "",
    role: "1",
    password: "",
    passwordChk: "",
    putDate: "",
  });
}

// 리스트 선택 → 상세조회
async function select(item: any) {
  isNewMode.value = false;
  selected.value = item;

  await loadDetail(item.userNo);
}

// 저장 (추가 or 수정)
async function save() {
  if (isNewMode.value) {

    if (isNewMode.value) {
      if (!/^[a-zA-Z0-9]+$/.test(editForm.id)) {
        alert("아이디는 영문과 숫자만 입력 가능합니다.");
        return;
      }
    }

    // 신규 등록
    const result = await store.callInsertAPI({
      dataStatus: editForm.dataStatus,
      name: editForm.name,
      id:editForm.id,
      password: editForm.password,
      passwordChk: editForm.passwordChk,
      phone: editForm.phone,
      role: editForm.role,
    },()=>{
      searchList();
      isNewMode.value = false;
      selected.value = result;
      createNew();
    });
   /* loadDetail(editForm.userNo);*/

  } else {
    // 수정
    await store.callUpdateAPI({
      userNo: editForm.userNo,
      dataStatus: editForm.dataStatus,
      password: editForm.password,
      passwordChk: editForm.passwordChk,
      id: editForm.id,
      name: editForm.name,
      phone: editForm.phone,
      role: editForm.role,
    },() => {
  //*!*    searchList();*!/*/
      loadDetail(editForm.userNo);
    });

    /*await loadDetail(editForm.userNo);*/
  }
}

// 삭제
/*
async function remove() {
  if (!selected.value) return;
  if (!confirm("정말 삭제하시겠습니까?")) return;

  await store.callDeleteAPI(selected.value.userNo);

  alert("삭제되었습니다.");

  searchList();
  createNew();
}
*/

// 모달이 열릴 때 초기화
watch(
    () => props.visible,
    (val) => {
      if (val) {
        resetFilter();
        searchList();
        createNew();
      }
    }
);
</script>


<style scoped>
.widget-todolist-item.disabled {
  background-color: #fbfbfb;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 70%;
  background: white;
  margin: 80px auto;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.modal-body {
  padding: 20px;
}

.widget-todolist-item {
  cursor: pointer;
  transition: 0.15s;
}
.widget-todolist-item:hover {
  background: #f0f6ff;
}
.widget-todolist-item.active {
  background: #e6f0ff;
  border-left: 3px solid #348fe2;
}

.w-60 {
  width: 60%;
}
.w-40 {
  width: 40%;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}
.form-control,
.form-select {
  height: 36px;
  font-size: 14px;
}
.text-right {
  text-align: right;
}

</style>
