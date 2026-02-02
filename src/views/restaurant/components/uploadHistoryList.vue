<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-window" style="width: 80%;">
      <div class="modal-body">
        <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
          <div class="list-group-item d-flex border-top-0">
            <div class="flex-fill border-bottom">
              <div class="fs-14px lh-12 mb-2px fw-bold text-dark" style="padding-bottom: 20px">업로드 내역</div>
              <!-- 상단 검색/필터 영역 -->
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
                      { label: '요기요', value: '3' }
                    ]"
                  />
                  <!-- ⚠️ 원본 코드 그대로 유지: v-model이 appType로 동일하게 되어 있었음 -->
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
                      <a href="#" class="btn btn-white d-flex align-items-center w-75 p-0" aria-expanded="false">
                        <div class="input-group">
                          <input
                              type="text"
                              class="form-control bg-light border-0"
                              v-model="store.searchParamsHistory.keyword"
                              placeholder="검색어를 입력해주세요."
                          />
                          <button type="button" class="btn btn-sm btn-white border-0" @click="searchHistory">
                            <i class="fa fa-fw fa-search ms-n1"></i> 검색
                          </button>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-1 fs-12px">
                <div class="text-gray-600 flex-1"></div>
              </div>

              <hr class="mb-10px bg-gray-600" />

              <!-- ✅ 헤더 + 바디를 같은 레이아웃으로 통일 -->
              <div class="table-shell">
                <!-- 헤더(= 기존 th) -->
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

                <!-- 바디(스크롤 영역) -->
                <div class="table-body">
                  <div
                      class="row-item"
                      v-for="(item ,index) in store.uploadHistoryList"
                      :key="item.hisNo"
                  >
                    <div class="row-flex">
                      <span class="col icon-col">
<!--                        <i class="fas fa-lg fa-fw fa-list text-warning"></i>-->
                      </span>
                      <span class="col col-5">{{ index +1 ?? index +1 ?? '' }}</span>
                      <span class="col col-1">{{ item.grStNo ?? '' }}</span>
                      <span class="col col-2">{{ appType(item.appType)}}</span>
                      <span class="col col-3">{{ item.stName ?? '' }}</span>

                      <!-- 아래 필드들은 서버 응답에 맞춰 교체하세요 -->
                      <span class="col col-4">{{ item.stCode ?? item.stCode ?? '' }}</span>

                      <span class="col col-6">{{ dataStatus(item.dataStatus)}}</span>
                      <span class="col col-7">{{ uploadType(item.uploadType)}}</span>
                      <span class="col col-8">{{ uploadGoodsType(item.uploadGoodsType)}}</span>
                      <span class="col col-9">{{ formatDate(item.uploadDate ?? item.uploadDate ?? '') }}</span>
                      <span class="col col-10">{{ item.modUserId ?? item.modUserId ?? '' }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectLabel from "@/components/common/SelectLabel.vue";
import { useRestaurantStore } from "@/stores/restaurant/useRestaurantStore";

defineProps({
  visible: Boolean,
  addList: {
    type: Array,
    default: () => []
  },
});

const store = useRestaurantStore();

/** 원본에 search 함수 호출이 있으니 stub이라도 둡니다 (프로젝트에 맞게 구현) */
const searchHistory = async () => {
  await store.callUploadHistory();
}

function formatPrice(value: number | string) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toLocaleString('ko-KR');
}

function formatDate(v: string) {
  if (!v) return '';
  // "2026-01-05T19:03:28" -> "2026-01-05"
  return String(v).split('T')[0];
}


const dataStatus = (dataStatus: string | number) => {
  if (dataStatus === '') return '전체';
  if (dataStatus === '1') return '미등록';
  if (dataStatus === '2') return '등록';
  if (dataStatus === '3') return '진행중';
  if (dataStatus === '4') return '등록실패';
  return '';
};
const appType = (appType: string | number) => {
  if (appType === '1') return '배민';
  if (appType === '2') return '쿠팡';
  if (appType === '3') return '요기요';
  return '';
};
const uploadType = (uploadType: string | number) => {
  if (uploadType === '1') return '기존 상품삭제 후 업로드';
  if (uploadType === '2') return '기존 상품유지 후 업로드';
  return '';
};
const uploadGoodsType = (uploadGoodsType: string | number) => {
  if (uploadGoodsType === '1') return '상품만 등록';
  if (uploadGoodsType === '2') return '상품/가맹점 정보 등록';
  return '';
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-window {
  background: #fff;
  width: 900px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.modal-header,
.modal-footer {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.modal-footer {
  border-top: 1px solid #eee;
}

.modal-body {
  padding: 15px;
}

/* ✅ 헤더/바디 정렬 핵심 컨테이너 */
.table-shell{
  border-radius: 8px;
  overflow: hidden;
}

/* 헤더 sticky */
.list-head{
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 700;
  font-size: 12px;
}

/* 바디 스크롤 */
.table-body{
  max-height: 500px;
  overflow-y: auto;
}

/* 헤더/행 공통 flex row */
.row-flex{
  display:flex;
  align-items:center;
  width:100%;
  min-height: 34px;
}

/* 행 스타일 */
.row-item{
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.row-item:hover{
  background: rgba(0,0,0,0.02);
}

/* 컬럼 공통: 말줄임 + 패딩 */
.col{
  padding: 6px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 아이콘 컬럼 */
.icon-col{
  flex: 0 0 34px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding-left: 6px;
  padding-right: 6px;
}

/* ✅ 폭을 한 곳에서 통제 */
.col-1{  flex: 0 0 110px; }
.col-2{  flex: 0 0 110px; }
.col-3{  flex: 1 1 220px; min-width: 180px; }
.col-4{  flex: 0 0 140px; }
.col-5{  flex: 0 0 70px; }
.col-6{  flex: 0 0 110px; }
.col-7{  flex: 0 0 150px; }
.col-8{  flex: 0 0 110px; }
.col-9{  flex: 0 0 140px; }
.col-10{ flex: 0 0 120px; }

/* (선택) 하위 트리용 */
.subtree{
  background: #f8f9fa;
}
.sub-row{
  padding-left: 16px;
}
</style>
