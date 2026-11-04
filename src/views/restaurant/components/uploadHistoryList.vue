<template>
  <!-- UI_VERSION: upload-history-refined-footer-20261104 -->
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-window" style="width: 80%;">
      <div class="modal-body">
        <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
          <div class="list-group-item d-flex border-top-0">
            <div class="flex-fill border-bottom history-content">
              <div
                  class="fs-14px lh-12 mb-2px fw-bold text-dark"
                  style="padding-bottom: 20px"
              >
                업로드 내역
              </div>

              <!-- 기존 검색/필터 영역 유지 -->
              <div class="d-flex justify-content-between">
                <div class="row w-100">
                  <SelectLabel
                      size="col-lg-2"
                      icon="fas fa-lg fa-fw fa-mobile-screen-button"
                      v-model="store.searchParamsHistory.appType"
                      :options="[
                      { label: '주문앱', value: '' },
                      { label: '배민', value: '1' },
                      { label: '쿠팡', value: '2' },
                      { label: '요기요', value: '3' },
                    ]"
                  />
                  <SelectLabel
                      size="col-lg-2"
                      icon="fas fa-lg fa-fw fa-mobile-screen-button"
                      v-model="store.searchParamsHistory.dataStatus"
                      :options="[
                      { label: 'DB등록여부', value: '' },
                      { label: '미등록', value: '1' },
                      { label: '등록완료', value: '2' },
                      { label: '진행중', value: '3' },
                      { label: '등록실패', value: '4' },
                    ]"
                  />

                  <div class="d-flex justify-content-end w-50">
                    <div class="input-group">
                      <select class="form-select" v-model="store.searchParamsHistory.searchType">
                        <option value="">전체</option>
                        <option value="stCode">가맹점코드</option>
                      </select>
                      <div class="btn btn-white d-flex align-items-center w-75 p-0">
                        <div class="input-group">
                          <input
                              type="text"
                              class="form-control bg-light border-0"
                              v-model="store.searchParamsHistory.keyword"
                              placeholder="검색어를 입력해주세요."
                              @keyup.enter="searchHistory"
                          />
                          <button
                              type="button"
                              class="btn btn-sm btn-white border-0"
                              :disabled="store.uploadHistoryLoading"
                              @click="searchHistory"
                          >
                            <i
                                class="fa fa-fw ms-n1"
                                :class="store.uploadHistoryLoading ? 'fa-spinner fa-spin' : 'fa-search'"
                            ></i>
                            {{ store.uploadHistoryLoading ? '검색중' : '검색' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-1 fs-12px">
                <div class="text-gray-600 flex-1"></div>
              </div>
              <hr class="mb-10px bg-gray-600" />

              <!-- 기존 목록 UI 유지, 데이터는 서버에서 해당 페이지의 자료만 받음 -->
              <div class="table-shell">
                <div class="list-head">
                  <div class="row-flex">
                    <span class="col icon-col"></span>
                    <span class="col col-5">NO</span>
                    <span class="col col-1">가맹점 NO</span>
                    <span class="col col-2">주문앱 타입</span>
                    <span class="col col-3">음식점 상호</span>
                    <span class="col col-4">가맹점 코드</span>
                    <span class="col col-6">데이터 상태</span>
                    <span class="col col-7">업로드 타입</span>
                    <span class="col col-8">상품타입</span>
                    <span class="col col-9">날짜</span>
                    <span class="col col-10">수정자ID</span>
                  </div>
                </div>

                <div class="table-body" :aria-busy="store.uploadHistoryLoading">
                  <!-- 목록은 로딩 중에도 유지해 팝업 높이가 바뀌지 않도록 처리 -->
                  <div
                      v-if="store.uploadHistoryLoading"
                      class="history-loading-overlay"
                      role="status"
                      aria-live="polite"
                  >
                    <i class="fa fa-spinner fa-spin me-2" aria-hidden="true"></i>
                    조회 중입니다.
                  </div>
                  <div v-if="!store.uploadHistoryLoading && store.uploadHistoryError" class="history-status text-danger">
                    {{ store.uploadHistoryError }}
                  </div>
                  <div v-else-if="!store.uploadHistoryLoading && store.uploadHistoryList.length === 0" class="history-status">
                    조회된 업로드 내역이 없습니다.
                  </div>

                  <template v-if="store.uploadHistoryList.length > 0">
                    <div
                        v-for="(item, index) in store.uploadHistoryList"
                        :key="item.hisNo ?? `${store.uploadHistoryPage}-${index}`"
                        class="row-item"
                    >
                      <div class="row-flex">
                        <span class="col icon-col"></span>
                        <span class="col col-5">{{ rowNumber(index) }}</span>
                        <span class="col col-1">{{ item.grStNo ?? '' }}</span>
                        <span class="col col-2">{{ appType(item.appType) }}</span>
                        <span class="col col-3">{{ item.stName ?? '' }}</span>
                        <span class="col col-4">{{ item.stCode ?? '' }}</span>
                        <span class="col col-6">{{ dataStatus(item.dataStatus) }}</span>
                        <span class="col col-7">{{ uploadType(item.uploadType) }}</span>
                        <span class="col col-8">{{ uploadGoodsType(item.uploadGoodsType) }}</span>
                        <span class="col col-9">{{ formatDate(item.uploadDate ?? '') }}</span>
                        <span class="col col-10">{{ item.modUserId ?? '' }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- 업로드 내역 전용 하단 툴바: 정보/페이지/직접 이동/닫기를 한 줄에 정돈 -->
      <footer class="history-bottom-bar" aria-label="업로드 내역 탐색">
        <div class="history-summary" aria-live="polite">
          <span class="history-count-label">전체</span>
          <strong class="history-total-count">{{ Number(store.uploadHistoryTotalSize || 0).toLocaleString() }}</strong>
          <span class="history-count-unit">건</span>
          <span class="history-summary-divider" aria-hidden="true"></span>
          <span class="history-range">{{ pageStart.toLocaleString() }}–{{ pageEnd.toLocaleString() }}건 표시</span>
        </div>

        <nav class="history-page-nav" aria-label="업로드 내역 페이지 이동">
          <button
              type="button"
              class="history-page-button history-page-arrow"
              title="첫 페이지"
              aria-label="첫 페이지"
              :disabled="store.uploadHistoryLoading || currentPage <= 1"
              @click="movePage(1)"
          >«</button>
          <button
              type="button"
              class="history-page-button history-page-arrow"
              title="이전 페이지"
              aria-label="이전 페이지"
              :disabled="store.uploadHistoryLoading || currentPage <= 1"
              @click="movePage(currentPage - 1)"
          >‹</button>
          <span class="history-nav-separator" aria-hidden="true"></span>
          <button
              v-for="page in visiblePages"
              :key="page"
              type="button"
              class="history-page-button history-page-number"
              :class="{ 'is-active': page === currentPage }"
              :aria-current="page === currentPage ? 'page' : undefined"
              :disabled="store.uploadHistoryLoading"
              @click="movePage(page)"
          >{{ page }}</button>
          <span class="history-nav-separator" aria-hidden="true"></span>
          <button
              type="button"
              class="history-page-button history-page-arrow"
              title="다음 페이지"
              aria-label="다음 페이지"
              :disabled="store.uploadHistoryLoading || currentPage >= totalPages"
              @click="movePage(currentPage + 1)"
          >›</button>
          <button
              type="button"
              class="history-page-button history-page-arrow"
              title="마지막 페이지"
              aria-label="마지막 페이지"
              :disabled="store.uploadHistoryLoading || currentPage >= totalPages"
              @click="movePage(totalPages)"
          >»</button>
        </nav>

        <div class="history-actions">
          <span class="history-page-indicator">{{ currentPage.toLocaleString() }} <span>/</span> {{ totalPages.toLocaleString() }}</span>
          <div class="history-page-jump">
            <label for="history-page-input">바로 이동</label>
            <input
                id="history-page-input"
                v-model="jumpPage"
                type="number"
                inputmode="numeric"
                min="1"
                :max="totalPages"
                class="history-page-input"
                :disabled="store.uploadHistoryLoading"
                @keyup.enter="goToPage"
            />
            <button
                type="button"
                class="history-jump-button"
                :disabled="store.uploadHistoryLoading"
                @click="goToPage"
            >이동</button>
          </div>
          <span class="history-action-divider" aria-hidden="true"></span>
          <button type="button" class="history-close" @click="$emit('close')">닫기</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SelectLabel from '@/components/common/SelectLabel.vue';
import { useRestaurantStore } from '@/stores/restaurant/useRestaurantStore';

defineProps({
  visible: Boolean,
  addList: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['close']);

const store = useRestaurantStore();

// 첫 호출은 기존 RestaurantList.vue의 openModal()에서 수행합니다.
// 검색하거나 팝업의 페이지를 이동할 때만 이 컴포넌트에서 새로 조회합니다.
const searchHistory = async () => {
  if (store.uploadHistoryLoading) return;
  await store.callUploadHistory(1);
};

// 전체 페이지 메타데이터가 0이어도 페이지 표시 영역은 항상 유지합니다.
const totalPages = computed(() => Math.max(
    1,
    Number(store.uploadHistoryTotalPages) || 0,
    Math.ceil(Number(store.uploadHistoryTotalSize || 0) / Math.max(1, Number(store.uploadHistorySize) || 10)),
));
const currentPage = computed(() => Math.max(1, Number(store.uploadHistoryPage) || 1));
const pageStart = computed(() =>
    store.uploadHistoryList.length > 0
        ? (currentPage.value - 1) * store.uploadHistorySize + 1
        : 0
);
const pageEnd = computed(() =>
    store.uploadHistoryList.length > 0
        ? Math.min(store.uploadHistoryTotalSize, pageStart.value + store.uploadHistoryList.length - 1)
        : 0
);

const jumpPage = ref('1');
watch(currentPage, (page) => { jumpPage.value = String(page); }, { immediate: true });

const visiblePages = computed(() => {
  const count = totalPages.value;
  const start = Math.max(1, Math.min(currentPage.value - 2, count - 4));
  return Array.from({ length: Math.min(5, count - start + 1) }, (_, index) => start + index);
});

const movePage = async (page: number) => {
  if (store.uploadHistoryLoading) return;
  if (!Number.isInteger(page) || page < 1 || page > totalPages.value) return;
  if (page === currentPage.value) return;
  await store.callUploadHistory(page);
};

const goToPage = async () => {
  const page = Number(jumpPage.value);
  if (!Number.isInteger(page) || page < 1 || page > totalPages.value) {
    window.$emitter.emit('warning', `1부터 ${totalPages.value.toLocaleString()}까지의 페이지를 입력해주세요.`);
    return;
  }
  await movePage(page);
};

const rowNumber = (index: number) =>
    (store.uploadHistoryPage - 1) * store.uploadHistorySize + index + 1;

function formatDate(value: string) {
  if (!value) return '';
  return String(value).split('T')[0];
}

const dataStatus = (value: string | number) => {
  switch (String(value)) {
    case '1': return '미등록';
    case '2': return '등록';
    case '3': return '진행중';
    case '4': return '등록실패';
    default: return '';
  }
};

const appType = (value: string | number) => {
  switch (String(value)) {
    case '1': return '배민';
    case '2': return '쿠팡';
    case '3': return '요기요';
    default: return '';
  }
};

const uploadType = (value: string | number) => {
  switch (String(value)) {
    case '1': return '기존 상품삭제 후 업로드';
    case '2': return '기존 상품유지 후 업로드';
    default: return '';
  }
};

const uploadGoodsType = (value: string | number) => {
  switch (String(value)) {
    case '1': return '상품만 등록';
    case '2': return '상품/가맹점 정보 등록';
    default: return '';
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-window {
  background: #fff;
  width: 900px;
  max-width: 98vw;
  height: min(680px, calc(100dvh - 40px));
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.modal-footer {
  padding: 12px 15px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  flex: 0 0 auto;
}
.modal-body {
  padding: 15px;
  min-height: 0;
  overflow-y: auto;
  flex: 1 1 auto;
}
.history-content { min-width: 0; }

/* 기존 표 스타일 및 컬럼 너비 유지 */
.table-shell {
  border-radius: 8px;
  overflow-x: auto;
}
.list-head {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 700;
  font-size: 12px;
}
.table-body {
  /* 조회 상태/조회 건수와 관계없이 표 높이 고정 */
  position: relative;
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
.history-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.76);
}
.row-flex {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: max-content;
  min-height: 34px;
}
.row-item { border-bottom: 1px solid rgba(0, 0, 0, 0.04); }
.row-item:hover { background: rgba(0, 0, 0, 0.02); }
.col {
  padding: 6px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-col {
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 6px;
  padding-right: 6px;
}
.col-1 { flex: 0 0 110px; }
.col-2 { flex: 0 0 110px; }
.col-3 { flex: 1 1 220px; min-width: 180px; }
.col-4 { flex: 0 0 140px; }
.col-5 { flex: 0 0 70px; }
.col-6 { flex: 0 0 110px; }
.col-7 { flex: 0 0 150px; }
.col-8 { flex: 0 0 110px; }
.col-9 { flex: 0 0 140px; }
.col-10 { flex: 0 0 120px; }

.history-status {
  text-align: center;
  color: #6c757d;
  padding: 35px 12px;
  font-size: 13px;
}

/* 정돈된 단일 하단 툴바. 페이지 전환 시 높이는 변경되지 않습니다. */
.history-bottom-bar {
  display: grid;
  grid-template-columns: minmax(225px, 1fr) auto minmax(300px, 1fr);
  align-items: center;
  column-gap: 18px;
  row-gap: 10px;
  flex: 0 0 auto;
  min-height: 72px;
  padding: 12px 20px;
  background: #ffffff;
  border-top: 1px solid #e8edf2;
  box-sizing: border-box;
}
.history-summary {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  white-space: nowrap;
  color: #667085;
  font-size: 12px;
}
.history-count-label, .history-count-unit { font-weight: 500; }
.history-total-count { color: #2582d8; font-size: 15px; font-weight: 750; font-variant-numeric: tabular-nums; }
.history-summary-divider { width: 1px; height: 12px; margin: 0 9px; background: #dce3eb; }
.history-range { color: #8993a5; }
.history-page-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid #e9eef4;
  border-radius: 10px;
  background: #f6f8fb;
  width: max-content;
  white-space: nowrap;
}
.history-page-button {
  border: 0;
  border-radius: 7px;
  width: 33px;
  height: 33px;
  padding: 0;
  background: transparent;
  color: #526075;
  font-size: 13px;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
  transition: background-color .12s ease, color .12s ease;
  font-variant-numeric: tabular-nums;
}
.history-page-arrow { font-size: 20px; font-weight: 400; color: #6b778a; padding-bottom: 2px; }
.history-page-button:hover:not(:disabled):not(.is-active) { background: #e7eef7; color: #2669aa; }
.history-page-button.is-active { background: #348fe2; color: #fff; box-shadow: 0 2px 5px rgba(52,143,226,.16); }
.history-page-button:disabled { color: #c1c9d3; cursor: default; opacity: 1; }
.history-page-button.is-active:disabled { color: #fff; }
.history-page-button:focus-visible,
.history-page-input:focus-visible,
.history-jump-button:focus-visible,
.history-close:focus-visible { outline: 2px solid #348fe2; outline-offset: 2px; }
.history-nav-separator { width: 1px; height: 18px; margin: 0 3px; background: #dfe6ee; }
.history-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
  white-space: nowrap;
}
.history-page-indicator { color: #68768a; font-size: 12px; font-variant-numeric: tabular-nums; }
.history-page-indicator > span { color: #b0b9c5; padding: 0 4px; }
.history-page-jump { display: inline-flex; align-items: center; gap: 6px; }
.history-page-jump label { color: #69778b; font-size: 12px; white-space: nowrap; }
.history-page-input {
  width: 61px;
  height: 33px;
  padding: 0 6px;
  border: 1px solid #dce3eb;
  border-radius: 7px;
  background: #fff;
  color: #344054;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  box-sizing: border-box;
  font-variant-numeric: tabular-nums;
  appearance: textfield;
  -moz-appearance: textfield;
}
.history-page-input::-webkit-outer-spin-button,
.history-page-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.history-page-input:disabled { background: #f7f9fb; }
.history-jump-button {
  height: 33px;
  padding: 0 10px;
  border: 1px solid #cbd8e6;
  border-radius: 7px;
  background: #fff;
  color: #476075;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.history-jump-button:hover:not(:disabled) { background: #eff6ff; border-color: #8fbce8; color: #216bb0; }
.history-jump-button:disabled { opacity: .5; cursor: default; }
.history-action-divider { height: 23px; width: 1px; background: #e3e8ef; }
.history-close {
  min-width: 58px;
  height: 35px;
  padding: 0 13px;
  border: 1px solid #dce3ea;
  border-radius: 7px;
  background: #f5f7fa;
  color: #4b5565;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}
.history-close:hover { background: #e9edf2; }

/* 표 10행을 400px 높이에 균형 있게 채워 하단 공백을 줄입니다. */
.table-body .row-flex { min-height: 39px; height: 39px; }

@media (max-width: 1280px) {
  .history-bottom-bar { grid-template-columns: 1fr auto; padding: 12px 16px; }
  .history-page-nav { grid-column: 1 / -1; grid-row: 2; justify-self: center; }
  .history-actions { grid-column: 2; grid-row: 1; }
  .history-summary { grid-column: 1; grid-row: 1; }
}
@media (max-width: 760px) {
  .modal-window { width: min(98vw, 900px) !important; }
  .history-bottom-bar { grid-template-columns: 1fr; row-gap: 12px; }
  .history-summary { grid-column: 1; grid-row: 1; justify-content: center; flex-wrap: wrap; }
  .history-page-nav { grid-column: 1; grid-row: 2; justify-self: center; }
  .history-actions { grid-column: 1; grid-row: 3; justify-content: center; gap: 10px; }
  .history-page-nav .history-page-button { width: 31px; height: 32px; }
}
@media (max-width: 430px) {
  .history-page-jump label, .history-page-indicator { display: none; }
  .history-summary-divider { margin: 0 5px; }
  .history-actions { justify-content: space-between; }
}
</style>
